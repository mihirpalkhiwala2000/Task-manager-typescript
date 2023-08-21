import * as mongoose from "mongoose";
import constants from "../constant";
const { successMsgs } = constants;
const { connected } = successMsgs;
mongoose
  .connect(process.env.DB_PORT as string)
  .then(() => console.log(connected));
