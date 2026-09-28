import type { IUserRepository } from "../../../domain/repositories/IUserRepository.js";
import type { AuthTokens, UserPublic } from "../../../domain/entities/User.js";
import { AppError } from "../../../shared/errors/AppError.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

export class RegisterUseCase {
  constructor(private readonly userRepo: IUserRepository) {}

  async execute(
    name: string,
    email: string,
    password: string,
  ): Promise<AuthTokens> {
    const existing = await this.userRepo.findByEmail(email);
    if (existing) {
      throw new AppError("Email already registered", 409);
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await this.userRepo.create({
      name,
      email,
      password: hashedPassword,
      role: "user",
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN as any,
    });

    return { token, user };
  }
}

export class LoginUseCase {
  constructor(private readonly userRepo: IUserRepository) {}

  async execute(email: string, password: string): Promise<AuthTokens> {
    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw new AppError("Invalid credentials", 401);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new AppError("Invalid credentials", 401);
    }

    const publicUser: UserPublic = {
      _id: user._id!,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN as any,
    });

    return { token, user: publicUser };
  }
}
