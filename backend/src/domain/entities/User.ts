export interface User {
  _id?: string;
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserPublic {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
}

export interface AuthTokens {
  token: string;
  user: UserPublic;
}
