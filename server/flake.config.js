const _ = require('lodash');
const { currentProvider, getCurrentProvider } = require('./src/providers/queue');

const config = {
    provider: {
        ingest: 'SQSQueueProvider',
        queueUrl: 'https://sqs.eu-west-2.amazonaws.com/582447311186/VA_QUEUE',
        queueName: 'VA_QUEUE',
        schedule: '*/20 * * * * *',
        parseResponse: true,
        retryCount: 5,
        deleteOnMax: true,
        retryInterval: 50,
    },
    config: {
        max_retry: 3,
        retry_mode: 'exponential', // fixed, exponential, fullJitter, decorrelatedJitter
        retry_delay: 10000,
        // queue: {
        //     backoffStrategy: {
        //         type: 'exponential', // Use an exponential backoff strategy
        //         delay: 1000, // Initial delay in milliseconds
        //     },
        // },
        // Set the backoff strategy for retrying failed jobs
    },
    handlers: {
        onProcessHandler: () => {},
    },
    events: {
        onJobSuccess: async (job) => {
            const { data } = job;
            const provider = await getCurrentProvider();
            if (provider) {
                await provider.deleteMessage(data.message);
            }
            console.log('job success log');
        },
        onJobFailed: (job, error) => {
            console.log('job failed log');
            console.log(job.id);
            console.log(error);
        },
        onJobExpired: (job) => {},
        onJobError: (job, error) => {},
        onJobMaxAttempt: async (job, error) => {
            const { data } = job;
            const email = _.get('email', 'data.meta');
            if (email) {
                console.log(email);
            }

            if (config.provider.deleteOnMax) {
                const provider = await getCurrentProvider();
                if (provider) {
                    await provider.deleteMessage(data.message);
                }
                console.log('job max attempt');
            }
        },
    },
    admin: {
        port: 5000,
    },
};
module.exports = config;
