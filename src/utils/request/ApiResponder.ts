import httpStatus from "http-status";
import ApiError from "./ApiError";
import { Response } from "express";

const ApiResponder = (
  res: Response,
  statusCode: number,
  message: string,
  payload: object,
  extra = {}
) => {
  res.status(statusCode).send({
    status: statusCode,
    success: statusCode === httpStatus.OK || statusCode === httpStatus.CREATED,
    message,
    data: payload,
    ...extra,
  });
};

const successResponse = (res: Response, payload = {}, message = "Success") => {
  return ApiResponder(res, httpStatus.OK, message, payload);
};

const errorResponse = (
  res: Response,
  message = null,
  statusCode = httpStatus.INTERNAL_SERVER_ERROR,
  extra = {}
) => {
  const httpMessage = message || httpStatus[statusCode];
  return ApiResponder(res, statusCode, httpMessage, {}, extra);
};

const abort = (status: number, message: string) => {
  throw new ApiError(status, message);
};

const abortIf = (condition: boolean, status: number, message: string) => {
  if (condition) abort(status, message);
};

const abortUnless = (condition: boolean, status: number, message: string) => {
  if (!condition) abort(status, message);
};

export { ApiResponder, successResponse, errorResponse, abort, abortIf, abortUnless };
