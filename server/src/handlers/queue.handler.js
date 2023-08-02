const Queue = require('bull');
const Redis = require('ioredis');
const _ = require('lodash');
const config = require('../config');
const { sendHttpRequest } = require('../services/http.service');
const Webhook = require('../models/webhook.model');
const { runCallback } = require('../utils/callback');

const QueueConstants = {
    MAIN_QUEUE: 'mainQueue',
};
const queueConfig = config.flake.config;
let client;
let subscriber;

const opts = {
    // redisOpts here will contain at least a property of connectionName which will identify the queue based on its name
    createClient(type, redisOpts) {
        switch (type) {
            case 'client':
                if (!client) {
                    client = new Redis(process.env.REDIS_URL || 'localhost', {
                        ...redisOpts,
                        maxRetriesPerRequest: null,
                        enableReadyCheck: false,
                    });
                }
                return client;
            case 'subscriber':
                if (!subscriber) {
                    subscriber = new Redis(process.env.REDIS_URL || 'localhost', {
                        ...redisOpts,
                        maxRetriesPerRequest: null,
                        enableReadyCheck: false,
                    });
                }
                return subscriber;
            case 'bclient':
                return new Redis(process.env.REDIS_URL || 'localhost', {
                    ...redisOpts,
                    maxRetriesPerRequest: null,
                    enableReadyCheck: false,
                });
            default:
                throw new Error('Unexpected connection type: ', type);
        }
    },
};

// Create a new Bull queue with the Redis connection
const mainQueue = new Queue(QueueConstants.MAIN_QUEUE, opts);

mainQueue.process(async (job) => {
    // Job processing logic goes here

    console.log(job);
    if (job.id === 'ping') return true;

    const retries = job.attemptsMade;
    const max_retry = queueConfig.max_retry || 5;
    console.log(`Job ${job.id} has failed with ${retries} and max :${max_retry} retries`);
    if (retries >= max_retry) {
        // Apply the backoff strategy for retrying failed jobs
        console.log(`maximum attempts made ${job.attemptsMade + 1}`);
    }

    const webhook = new Webhook();
    const { data } = job;
    const model = _.get(data, 'model');

    try {
        const httpRequest = _.get(data, 'request');

        const request = await sendHttpRequest(httpRequest.url, { ...httpRequest.payload, timeout: 10000 });

        const response_payload = request.success
            ? { status: request.response.status, data: request.response.data }
            : {};

        await webhook.updateRetry(model.id, {
            response_payload,
            status: request.success ? 'success' : 'failed',
            last_attempted_at: new Date(),
            meta: {
                date: new Date(),
                status: 'success',
                message: request.response.data,
            },
        });
        if (config.flake.events.onJobSuccess) {
            runCallback('success', config.flake.events.onJobSuccess, job);
            // await config.flake.events.onJobSuccess(job);
        }
        return true;
    } catch (e) {
        // console.log(e);
        await webhook.updateRetry(
            model.id,
            {
                response_payload: { status: 'failed', message: e.message },
                status: 'failed',
                last_attempted_at: new Date(),
                meta: {
                    date: new Date(),
                    status: 'failed',
                    message: e.message,
                },
            },
            1
        );
        if (config.flake.events.onJobError) {
            // config.flake.events.onJobError(job);
            runCallback('error', config.flake.events.onJobError, job);
        }
        // return true;
        throw new Error(e.message);
    }
    // // Retry the job if it fails
    // throw new Error(`Job ${job.id} failed, retrying...`);
});

mainQueue.on('failed', async (job, error) => {
    const retries = job.attemptsMade;
    const max_retry = queueConfig.max_retry || 5;
    console.log(`Job ${job.id} has failed with ${retries} and max :${max_retry} retries`);

    if (retries >= max_retry) {
        const { data } = job;
        console.log(`maximum attempts made ${job.attemptsMade + 1}`);
        // await webhook.updateRetry(model.id, {
        //     response_payload: {
        //         success: false,
        //         message: `maximum attempts made (${max_retry + 1})`,
        //         error: data.error || '',
        //     },
        //     status: 'failed',
        //     last_attempted_at: new Date(),
        //     meta: {
        //         date: new Date(),
        //         message: 'maximum attempts reached',
        //     },
        // });
        if (config.flake.events.onJobMaxAttempt) {
            // await config.flake.events.onJobMaxAttempt(job);
            runCallback('max', config.flake.events.onJobMaxAttempt, job, error);
        }
        return true;
    }
    if (config.flake.events.onJobFailed) {
        runCallback('failed', config.flake.events.onJobFailed, job);
    }
    // throw new Error(`Job ${job.id} failed, retrying...`);
});

mainQueue.on('ready', () => {
    console.log('Queue is ready, listening for jobs...');
});

mainQueue.on('stalled', (job) => {
    console.log(`Job ${job.id} has stalled`);
});

async function clearQueue() {
    try {
        await mainQueue.empty(); // Delete all jobs in the queue
        console.log('Queue cleared successfully.');
    } catch (error) {
        console.error('Error clearing the queue:', error);
    } finally {
        // Optionally, clean completed and failed jobs
        try {
            await mainQueue.clean(0, 'completed'); // Clean completed jobs (older than 0ms)
            await mainQueue.clean(0, 'failed'); // Clean failed jobs (older than 0ms)
            console.log('Completed and failed jobs cleaned.');
        } catch (error) {
            console.error('Error cleaning completed and failed jobs:', error);
        } finally {
            await mainQueue.close(); // Close the queue connection
        }
    }
}

module.exports = { mainQueue, clearQueue };
