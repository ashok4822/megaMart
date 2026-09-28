import type { IUserRepository } from "../../domain/repositories/IUserRepository.js";
import type { User, UserPublic } from "../../domain/entities/User.js";
import { UserModel } from "../database/models/UserModel.js";

export class MongoUserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const user = await UserModel.findOne({ email: email.toLowerCase() }).lean();
    if (!user) return null;
    return {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
    };
  }

  async findById(id: string): Promise<UserPublic | null> {
    const user = await UserModel.findById(id).lean();
    if (!user) return null;
    return {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }

  async create(
    data: Omit<User, "_id" | "createdAt" | "updatedAt">,
  ): Promise<UserPublic> {
    const user = await UserModel.create(data);
    return {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }

  async update(id: string, data: Partial<User>): Promise<UserPublic | null> {
    const user = await UserModel.findByIdAndUpdate(id, data, {
      new: true,
    }).lean();
    if (!user) return null;
    return {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }
}
