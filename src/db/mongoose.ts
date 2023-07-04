import * as mongoose from "mongoose";
import * as dotenv from "dotenv";
import constants from "../constant";
const { successMsgs } = constants;
const { connected } = successMsgs;
dotenv.config();
mongoose
  .connect(process.env.DB_PORT as string)
  .then(() => console.log(connected));
