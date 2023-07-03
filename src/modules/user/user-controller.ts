import User, { userschematype } from "./user-models";
import generate from "../../utils/generateTokensUtils";
import findByCredentials from "../../utils/findByCredentials";
import * as bcrypt from "bcryptjs";
import { Request } from "express";
import { usertype, reqBodytype, postuserreturntype } from "../../utils/types";

export async function postuser(reqBody: Request): Promise<postuserreturntype> {
  const user = new User(reqBody);
  const { password } = user;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(password, 8);
  }
  await User.create(user);

  const token = await generate(user);

  return { user, token };
}

export async function userLogin(user: usertype): Promise<string> {
  const token = await generate(user);

  return token;
}

export function validateUser(updates: string[]): Boolean {
  const allowedUpdates = ["name", "email", "password", "age"];
  updates = ["name", "password"];

  const isValidOperation = updates.every((update: string) => {
    return allowedUpdates.includes(update);
  });

  return isValidOperation;
}

export async function updateUser(
  user: usertype,
  reqBody: reqBodytype
): Promise<userschematype | null> {
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
): Promise<postuserreturntype> {
  const user: userschematype = await findByCredentials(email, password);
  const token: string = await userLogin(user);

  return { user, token };
}

export async function deleteUser(requser_id: string): Promise<undefined> {
  await User.findOneAndDelete({
    _id: requser_id,
  });
}
