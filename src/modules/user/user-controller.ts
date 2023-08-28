import User, { UserSchemaType } from "./user-models";
import Task from "../tasks/task-models";
import generate from "../../utils/generateTokensUtils";
import findByCredentials from "../../utils/findByCredentials";
import * as bcrypt from "bcryptjs";
import { Request } from "express";
import { UserType, ReqBodyType, PostUserReturnType } from "../../utils/types";
import { redisClient } from "../../db/redis";

export async function postUser(reqBody: Request): Promise<PostUserReturnType> {
  const user = new User(reqBody);
  const { password } = user;
  const keyName = "user1";

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(password, 8);
  }

  await User.create(user);
  redisClient.LPUSH(keyName, JSON.stringify(user));
  const data = await redisClient.LRANGE(keyName, 0, -1);
  console.log("🚀 ~ file: user-controller.ts:16 ~ postUser ~ data:", data);

  const token = await generate(user);

  return { user, token };
}

export async function userLogin(user: UserType): Promise<string> {
  const token = await generate(user);

  return token;
}

export function validateUser(updates: string[]): Boolean {
  const allowedUpdates = ["name", "email", "password", "age"];

  const isValidOperation = updates.every((update: string) => {
    return allowedUpdates.includes(update);
  });

  return isValidOperation;
}

export async function updateUser(
  user: UserType,
  reqBody: ReqBodyType
): Promise<UserSchemaType | null> {
  let { password } = reqBody;

  if (password) {
    reqBody["password"] = await bcrypt.hash(password, 8);
  }

  await User.findOneAndUpdate({ email: user.email }, reqBody);
  const retuser = User.findOne({ email: user.email });
  return retuser;
}

export async function loginUser(
  email: string,
  password: string
): Promise<PostUserReturnType> {
  const user: UserSchemaType = await findByCredentials(email, password);
  const token: string = await userLogin(user);

  return { user, token };
}

export async function deleteUser(reqUser_id: string): Promise<undefined> {
  await User.findOneAndDelete({
    _id: reqUser_id,
  });
  await Task.deleteMany({ owner: reqUser_id });
}
