const httpStatus = require('http-status');
const config = require('../config/index');
const logger = require('../config/logger');
const ApiError = require('../utils/request/ApiError');
const { errorResponse } = require('../utils/request/ApiResponder');

const errorConverter = (err, req, res, next) => {
    let error = err;
    if (!(error instanceof ApiError)) {
        const statusCode = error.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
        const message = error.message || httpStatus[statusCode];
        error = new ApiError(statusCode, message, false, err.stack);
    }
    next(error);
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
    let { statusCode, message } = err;
    statusCode = statusCode || httpStatus.INTERNAL_SERVER_ERROR;
    console.log('[ERROR]', err);
    if (statusCode === httpStatus.INTERNAL_SERVER_ERROR) {
        // message = message || httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
        message = 'Oh sugar! we have a problem, please check back later';
    }

    res.locals.errorMessage = err.message;
    if (statusCode === httpStatus.INTERNAL_SERVER_ERROR || config.env === 'test') {
        logger.error(err);
    }

    return errorResponse(res, message, statusCode, config.env === 'development' && { stack: err.stack });
};

module.exports = {
    errorConverter,
    errorHandler,
};
