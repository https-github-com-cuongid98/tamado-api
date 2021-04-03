import { HttpError, HttpErrorController } from "$helpers/response";
import { NextFunction, Request, Response } from "express";
import log from "$helpers/log";
import { ErrorCode } from "$enums";

export const handleError = async (
  error: HttpError | HttpErrorController,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { statusCode, errorCode, errorKey, errorMessage } = error;
  console.log(error);
  loggingError(req, error);
  const responseData = {
    success: false,
    errorCode,
    errorKey,
    errorMessage,
    data: null,
  };

  return res.status(statusCode).send(responseData);
};

function loggingError(req: Request, error) {
  const method = req.method;
  const fullPath = req.originalUrl;
  const body = req.body || [];
  const logger = error.logger ? error.logger : log("INFO");
  delete error.logger;

  switch (error.errorCode) {
    case ErrorCode.Unknown_Error:
      const err = error["rawError"] || error;
      logger.error(err);
      break;

    case ErrorCode.Invalid_Input:
      logger.error(error.errorMessage);
      break;

    default:
      logger.error(
        `${error.errorKey}${
          error.errorMessage ? `\nReason: ${error.errorMessage}` : ""
        }`
      );
      break;
  }
  logger.error(
    `Method: ${method} | FullPath: ${fullPath} | Body: ${JSON.stringify(
      body
    )}\n`
  );
}
