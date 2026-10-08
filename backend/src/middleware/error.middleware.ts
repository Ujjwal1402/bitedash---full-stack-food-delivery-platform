import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  public statusCode: number;
  public details?: any;

  constructor(message: string, statusCode = 400, details?: any) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export function errorHandler(
  err: Error | AppError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void {
  const statusCode = (err as AppError).statusCode || 500;
  const message = err.message || 'Internal Server Error';

  console.error(`[API Error] ${req.method} ${req.url} - Status ${statusCode}:`, message);

  res.status(statusCode).json({
    success: false,
    error: message,
    details: (err as AppError).details || undefined,
  });
}
