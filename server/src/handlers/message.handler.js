const { messageValidator } = require('../utils/validation');
const { validatePayload } = require('../middlewares/validate');
const Webhook = require('../models/webhook.model');

const { mainQueue } = require('./queue.handler');
const config = require('../config');
const { runCallback } = require('../utils/callback');
const { getQueueProvider } = require('../providers');
const flakeConfig = require('../../flake.config');
const { generateBatchId } = require('../utils/strings');

const queueConfig = config.flake.config;

const handleMessage = async (message, provider, strict = true) => {
    const { raw, payload } = message;
    let { job_id } = message;
    if (strict) {
        const { success } = validatePayload(messageValidator, payload);
        if (!success) {
            return console.log(success.message);
        }
    }
    const { id, request_payload, url } = payload;

    try {
        if (!job_id) job_id = generateBatchId();
        // const job_id = nanoid();
        const webhookData = {
            job_id,
            url,
            request_id: id || job_id,
            request_payload,
            payload: raw,
        };
        const addConfig = {
            attempts: queueConfig.max_retry || 5,
            backoff: {
                type: queueConfig.retry_mode || 'exponential',
                delay: queueConfig.retry_delay || 5000,
            },
        };
        // Create a new webhook instance
        const webhook = new Webhook();
        const save = await webhook.addSafe(webhookData);
        const queuePayload = {
            job_id: save.job_id,
            model: save,
            message: raw,
            request_id: save.request_id,
            request: {
                url,
                payload: request_payload,
            },
        };
        await mainQueue.add(
            { ...queuePayload },
            {
                jobId: save.job_id,
                ...addConfig,
            }
        );

        return {
            job_id: save.job_id,
        };

        // webhook.
    } catch (e) {
        console.log(e);
        // TODO add to failed table
        console.log('unable to process message');
        return null;
    }
};

const resendMessage = async (payload) => {
    const { provider } = payload;
    if (!provider) throw Error('Provider must be defined to resend');
    const providerInstance = getQueueProvider(provider, {
        ...config,
        ...flakeConfig.provider,
    });
    if (!providerInstance) throw Error(`Unknown provider ${provider}`);

    const message = await providerInstance.parseMessage(payload);

    // Message is formed back here
    return handleMessage(message, provider);
};

module.exports = { handleMessage, resendMessage };
