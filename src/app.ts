import * as express from "express";
import("./db/mongoose");
const app = express();
import userRouter from "./modules/user/users-router";
import taskRouter from "./modules/tasks/tasks-router";

app.use(express.json());
app.use("/users", userRouter);
app.use("/tasks", taskRouter);

export default app;
