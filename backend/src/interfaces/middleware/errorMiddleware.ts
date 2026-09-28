import type { Request, Response, NextFunction } from "express";
import { AppError } from "../../shared/errors/AppError.js";
import { ZodError } from "zod";

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  // Zod validation errors
  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: "Validation error",
      errors: err.issues.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      })),
    });
    return;
  }

  // Operational errors (AppError)
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
    return;
  }

  // Mongoose duplicate key error
  if (
    (err as NodeJS.ErrnoException).name === "MongoServerError" &&
    (err as { code?: number }).code === 11000
  ) {
    res.status(409).json({
      success: false,
      message: "Duplicate entry - resource already exists",
    });
    return;
  }

  // Unknown errors (programming errors) - don't leak details
  console.error("Unhandled error:", err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
}

export function notFound(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404));
}
