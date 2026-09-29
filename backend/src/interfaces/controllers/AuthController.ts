import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import {
  RegisterUseCase,
  LoginUseCase,
} from "../../application/usecases/auth/AuthUseCases.js";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const COOKIE_NAME = "megamart_token";

const cookieOptions = {
  httpOnly: true,                             // JS cannot read this cookie (XSS protection)
  secure: process.env.NODE_ENV === "production", // HTTPS only in prod
  sameSite: "strict" as const,               // CSRF protection
  maxAge: 7 * 24 * 60 * 60 * 1000,          // 7 days in ms
  path: "/",
};

export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase,
  ) {}

  register = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { name, email, password } = registerSchema.parse(req.body);
      const result = await this.registerUseCase.execute(name, email, password);

      // Set JWT as HttpOnly cookie
      res.cookie(COOKIE_NAME, result.token, cookieOptions);

      // Return user info only (no token in response body)
      res.status(201).json({ success: true, data: { user: result.user } });
    } catch (error) {
      next(error);
    }
  };

  login = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { email, password } = loginSchema.parse(req.body);
      const result = await this.loginUseCase.execute(email, password);

      // Set JWT as HttpOnly cookie
      res.cookie(COOKIE_NAME, result.token, cookieOptions);

      // Return user info only (no token in response body)
      res.json({ success: true, data: { user: result.user } });
    } catch (error) {
      next(error);
    }
  };

  logout = async (
    _req: Request,
    res: Response,
    _next: NextFunction,
  ): Promise<void> => {
    // Clear the cookie
    res.clearCookie(COOKIE_NAME, { path: "/" });
    res.json({ success: true, message: "Logged out successfully" });
  };
}
