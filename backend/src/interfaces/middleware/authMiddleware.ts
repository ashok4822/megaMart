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
  // 1. Prefer HttpOnly cookie
  let token: string | undefined = req.cookies?.megamart_token;

  // 2. Fallback: Authorization: Bearer <token> header (for mobile / API clients)
  if (!token) {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }
  }

  if (!token) {
    return next(new AppError("Authentication required", 401));
  }

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
