import * as jwt from "jsonwebtoken";
import User from "../models/user-models";
import * as dotenv from "dotenv";
dotenv.config();
import constants from "../constant";
const { errorMsgs, statusCodes } = constants;
const { unauthorized } = errorMsgs;
const { unauthorizedC } = statusCodes;
dotenv.config();

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");

    const decoded = jwt.verify(token, process.env.JWT_CODE) as jwt.JwtPayload;

    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });

    if (!user) {
      throw new Error();
    }
    req.body.token = token;
    req.body.user = user;
    next();
  } catch (e) {
    res.status(unauthorizedC).send(unauthorized);
  }
};

export default auth;
