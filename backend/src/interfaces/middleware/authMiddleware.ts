import type { Request, Response, NextFunction } from "express";
import type { ParamsDictionary } from "express-serve-static-core";
import jwt from "jsonwebtoken";
import { AppError } from "../../shared/errors/AppError.js";

export interface AuthenticatedRequest<
  P extends ParamsDictionary = ParamsDictionary,
> extends Request<P> {
  user?: {
    userId: string;
    role: string;
  };
}

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

export function authenticate(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction,
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new AppError("Authentication required", 401));
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      role: string;
    };
    req.user = { userId: decoded.userId, role: decoded.role };
    next();
  } catch {
    next(new AppError("Invalid or expired token", 401));
  }
}

export function requireAdmin(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction,
): void {
  if (req.user?.role !== "admin") {
    return next(new AppError("Admin access required", 403));
  }
  next();
}
