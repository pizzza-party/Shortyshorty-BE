import { ValidationError } from 'class-validator';

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

export { CustomError };
