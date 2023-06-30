import User from "../models/user-models";
import generate from "../utils/generateTokensUtils";
import findByCredentials from "../utils/findByCredentials";
import * as bcrypt from "bcryptjs";
import { Request, Response, NextFunction } from "express";

export async function postuser(reqBody: Request) {
  const user = new User(reqBody);
  const { password } = user;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(password, 8);
  }
  await user.save();

  const token = await generate(user);

  return { user, token };
}

export function userLogin(user: { _id: string }) {
  const token = generate(user);

  return token;
}

export function validateUser(updates: string[]) {
  const allowedUpdates = ["name", "email", "password", "age"];
  updates = ["name", "password"];

  const isValidOperation = updates.every((update: string) => {
    return allowedUpdates.includes(update);
  });

  return isValidOperation;
}
// interface reqBodytype extends Request {
//   name: string;
//   password: string;
//   age: number;

interface usertype {
  _id: string;
  name: string;
  email: string;
  password: string;
  age: number;
  tokens: {
    token: string;
    _id: string;
  };
}
export async function updateUser(updates: string[], user: any, reqBody: any) {
  let { password } = reqBody;

  if (password) {
    reqBody["password"] = await bcrypt.hash(password, 8);
  }

  updates.forEach((update) => {
    return (user[update] = reqBody[update]);
  });
  await user.save();

  return user;
}

export async function loginUser(email: string, password: string) {
  const user: any = await findByCredentials(email, password);
  const token: string = await userLogin(user);

  return { user, token };
}

export async function deleteUser(requser_id: string) {
  await User.findOneAndDelete({
    _id: requser_id,
  });
}
