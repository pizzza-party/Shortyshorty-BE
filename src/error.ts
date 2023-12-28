import { APIGatewayProxyResult } from 'aws-lambda';
import { StatusCodes } from 'http-status-codes';

class CustomError {
  statusCode: number;
  body: string;

  constructor(statusCode: number, message: string, stack?: unknown) {
    this.statusCode = statusCode;
    this.body = JSON.stringify({
      message,
      stack,
    });
  }
}

const errorHandler = (error: CustomError | unknown): APIGatewayProxyResult => {
  let statusCode;
  let body;

  if (error instanceof CustomError) {
    statusCode = error.statusCode;
    body = error.body;
  } else {
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    body = JSON.stringify(error);
  }

  return {
    statusCode,
    body,
  };
};

export { CustomError, errorHandler };
