import * as express from "express";
import("./db/mongoose");
const app = express();
const port = process.env.PORT || 3000;
import userRouter from "./routers/users-router";
import taskRouter from "./routers/tasks-router";

app.use(express.json());
app.use("/users", userRouter);
app.use("/tasks", taskRouter);

app.listen(port, () => {
  console.log("Server is up on port " + port);
});
