import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();
import User, { UserSchemaType } from "../modules/user/user-models";

async function generate(user: UserSchemaType): Promise<string> {
  const token = jwt.sign(
    { _id: user._id.toString() },
    process.env.JWT_CODE as string
  );

  user.tokens = user.tokens.concat({ token });
  await User.create(user);

  return token;
}

export default generate;
