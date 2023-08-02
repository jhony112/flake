const httpStatus = require('http-status');
const { successResponse, abortIf } = require('../utils/request/ApiResponder');
const Webhook = require('../models/webhook.model');
const catchAsync = require('../utils/request/catchAsync');
const { resendMessage } = require('../handlers/message.handler');
const { paginateOptions } = require('../utils/page');

const getWebhookLogs = catchAsync(async (req, res) => {
    const options = paginateOptions(req);
    options.where = req.query;

    const webhook = new Webhook();
    const result = await webhook.getPaginate(options, ['id']);
    return successResponse(res, result);
});

const getJob = catchAsync(async (req, res) => {
    const { job_id } = req.params;
    const webhook = new Webhook();
    const result = await webhook.getByJobIdOrRequestId(job_id, ['id']);
    abortIf(!result || !result.length, httpStatus.NOT_FOUND, '');
    return successResponse(res, result);
});

const resendJob = catchAsync(async (req, res) => {
    const { job_id } = req.params;
    const webhook = new Webhook();
    const result = await webhook.getByJobId(job_id);
    abortIf(!result, httpStatus.BAD_REQUEST, 'Invalid job_id');

    const { payload } = result;
    console.log(payload);
    const job = await resendMessage(payload);
    abortIf(!job, httpStatus.BAD_GATEWAY, 'Error processing job, please try again');

    return successResponse(res, job);
});

module.exports = { getWebhookLogs, getJob, resendJob };
