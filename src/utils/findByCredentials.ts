import User, { userschematype } from "../modules/user/user-models";
import * as bcrypt from "bcryptjs";
import constant from "../constant";
const { errorMsgs } = constant;
const { passError, emailError } = errorMsgs;
let findByCredentials = async (
  email: string,
  password: string
): Promise<userschematype> => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error(passError);
  }
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error(emailError);
  }
  return user;
};

export default findByCredentials;
