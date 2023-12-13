class CustomError {
  statusCode: number;
  message?: string;
  error?: unknown;

  constructor(statusCode: number, message: string) {
    this.statusCode = statusCode;
    this.message = message;
  }
}

export { CustomError };
