require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const httpStatus = require('http-status');
const xss = require('xss-clean');
const Joi = require('joi');
const ApiError = require('./utils/request/ApiError');
const { errorConverter, errorHandler } = require('./middlewares/error');
const { getWebhookLogs, getJob, resendJob } = require('./controllers/webhook.controller');
const { validateReq } = require('./middlewares/validate');

const app = express();

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json({ limit: '5mb' }));

// sanitize request data
app.use(xss());

// enable cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH');
    res.header('Access-Control-Allow-Headers', 'Origin, Accept, X-Requested-With, Content-Type');

    next();
});

// jwt authentication
// app.use(passport.initialize());
// passport.use('jwt', jwtStrategy);
// TODO use authKey generated here

app.get(
    '/resend/:job_id',
    validateReq({
        params: Joi.object().keys({
            job_id: Joi.string().required(),
        }),
    }),
    resendJob
);

app.get(
    '/logs',
    validateReq({
        query: Joi.object().keys({
            job_id: Joi.string(),
            retry_count: Joi.string(),
            status: Joi.string(),
            last_attempted_at: Joi.string(),
            request_id: Joi.string(),
            created_at: Joi.string(),
        }),
    }),
    getWebhookLogs
);

// Routes
app.get(
    '/:job_id',
    validateReq({
        params: Joi.object().keys({
            job_id: Joi.string().required(),
        }),
    }),
    getJob
);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = app;
