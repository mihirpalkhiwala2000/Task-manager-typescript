import * as mongoose from "mongoose";
import * as dotenv from "dotenv";
dotenv.config();
mongoose.connect(process.env.DB_PORT).then(() => console.log("Connected!"));
