import type { User, UserPublic } from "../entities/User.js";

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<UserPublic | null>;
  create(
    user: Omit<User, "id" | "createdAt" | "updatedAt">,
  ): Promise<UserPublic>;
  update(id: string, date: Partial<User>): Promise<UserPublic | null>;
}
