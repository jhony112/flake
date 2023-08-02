const httpStatus = require('http-status')
const ApiError = require('./ApiError')

const ApiResponder = (res, statusCode, message, payload, extra = {}) => {
    res.status(statusCode).send({
        status: statusCode,
        success:
            statusCode === httpStatus.OK || statusCode === httpStatus.CREATED,
        message,
        data: payload,
        ...extra,
    })
}

const successResponse = (res, payload = {}, message = 'Success') => ApiResponder(res, httpStatus.OK, message, payload)

const errorResponse = (
    res,
    message = null,
    statusCode = httpStatus.INTERNAL_SERVER_ERROR,
    extra = {}
) => {
    const httpMessage = message || httpStatus[statusCode]
    return ApiResponder(res, statusCode, httpMessage, {}, extra)
}

const abort = (status, message, errors = []) => {
    throw new ApiError(status, message, errors)
}

const abortIf = (condition, status, message, errors = []) => {
    if (condition) abort(status, message, errors)
}

const abortUnless = (condition, status, message, errors = []) => {
    if (!condition) abort(status, message, errors)
}

module.exports = {
    ApiResponder,
    successResponse,
    errorResponse,
    abort,
    abortIf,
    abortUnless,
}
