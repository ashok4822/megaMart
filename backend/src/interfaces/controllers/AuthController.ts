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
      res.status(201).json({ success: true, data: result });
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
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };
}
