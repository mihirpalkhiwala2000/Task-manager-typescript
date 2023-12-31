import * as express from "express";
import("./db/mongoose");
const app = express();
const port = process.env.PORT || 3000;
import userRouter from "./modules/user/users-router";
import taskRouter from "./modules/tasks/tasks-router";

app.use(express.json());
app.use("/users", userRouter);
app.use("/tasks", taskRouter);

app.listen(port, () => {
  console.log("Server is up on port " + port);
});
