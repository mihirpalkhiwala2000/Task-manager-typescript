import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();
async function generate(user) {
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_CODE);

  user.tokens = user.tokens.concat({ token });
  await user.save();

  return token;
}

export default generate;
