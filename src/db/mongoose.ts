import * as mongoose from "mongoose";
import * as dotenv from "dotenv";
dotenv.config();
mongoose
  .connect(process.env.DB_PORT as string)
  .then(() => console.log("Connected!"));
