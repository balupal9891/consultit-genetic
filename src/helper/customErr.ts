export class AppError extends Error {
  statusCode: number;
  status: number;
  isOperational: boolean;
  errors: string[] | null;

  constructor(message: string | string[], statusCode: number) {
    const formattedMessage = Array.isArray(message) ? message.join(", ") : message;
    super(formattedMessage);

    this.statusCode = statusCode;
    this.status = 0; // Always 0 for errors
    this.isOperational = true;
    this.errors = Array.isArray(message) ? message : null; // Store the array of messages if provided

    Error.captureStackTrace(this, this.constructor);
  }
}