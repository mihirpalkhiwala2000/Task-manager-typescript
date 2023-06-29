import User from "../models/user-models";
import generate from "../utils/generateTokensUtils";
import findByCredentials from "../utils/findByCredentials";
import * as bcrypt from "bcryptjs";

export async function postuser(reqBody) {
  const user = new User(reqBody);
  const { password } = user;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(password, 8);
  }
  await user.save();

  const token = await generate(user);

  return { user, token };
}

export function userLogin(user) {
  const token = generate(user);

  return token;
}

export function validateUser(updates) {
  const allowedUpdates = ["name", "email", "password", "age"];
  updates = ["name", "password"];

  const isValidOperation = updates.every((update: string) => {
    return allowedUpdates.includes(update);
  });

  return isValidOperation;
}

export async function updateUser(updates, user, reqBody) {
  console.log("🚀 ~ file: user-controller.ts:47 ~ updateUser ~ user:", user);
  updates.forEach((update) => (user[update] = reqBody[update]));

  await user.save();

  return user;
}

export async function loginUser(email, password) {
  const user = await findByCredentials(email, password);
  const token = await userLogin(user);

  return { user, token };
}

export async function deleteUser(requser_id) {
  await User.findOneAndDelete({
    _id: requser_id,
  });
}
