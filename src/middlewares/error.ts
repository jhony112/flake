import sequelize from "sequelize";
import httpStatus from "http-status";
import config from "../config/config";
import logger from "../config/logger";
import ApiError from "../utils/request/ApiError";
import { errorResponse } from "../utils/request/ApiResponder";

const errorConverter = (err, req, res, next) => {
  let error = err;
  if (!(error instanceof ApiError || error instanceof sequelize.Error)) {
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
  if (statusCode === httpStatus.INTERNAL_SERVER_ERROR) {
    // message = message || httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
    message = "Oh sugar! we have a problem, please check back later";
  }

  res.locals.errorMessage = err.message;
  if (statusCode === httpStatus.INTERNAL_SERVER_ERROR || config.env === "test") {
    logger.error(err);
    if (err instanceof sequelize.Error) {
      logger.error((err as any)?.parent);
    }
  }

  return errorResponse(
    res,
    message,
    statusCode,
    config.env === "development" && { stack: err.stack }
  );
};

export { errorConverter, errorHandler };
