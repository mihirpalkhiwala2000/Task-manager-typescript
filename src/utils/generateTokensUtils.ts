import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();

async function generate(user: any) {
  const token = jwt.sign(
    { _id: user._id.toString() },
    process.env.JWT_CODE as string
  );

  user.tokens = user.tokens.concat({ token });
  await user.save();

  return token;
}

export default generate;
