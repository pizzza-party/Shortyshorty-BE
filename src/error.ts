import { ValidationError } from 'class-validator';

class CustomError {
  statusCode: number;
  message?: string | ValidationError[];
  error?: unknown;

  constructor(
    statusCode: number,
    message: string | ValidationError[],
    error?: unknown
  ) {
    this.statusCode = statusCode;
    this.message = message;
  }
}

export { CustomError };
