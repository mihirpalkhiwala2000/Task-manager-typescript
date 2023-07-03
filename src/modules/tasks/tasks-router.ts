import * as express from "express";
import { Request } from "express";
const taskRouter = express.Router();
const app = express();
export default taskRouter;
import auth from "../../middleware/auth";
import Task from "./task-models";
import User from "../user/user-models";
import constants from "../../constant";
const { successMsgs, errorMsgs, statusCodes } = constants;
const { success } = successMsgs;
const { badRequest, serverError, notFound } = errorMsgs;
const { createdC, badRequestC, notFoundC, serverErrorC } = statusCodes;
import { querytype } from "./types";
import {
  displayTask,
  validation,
  createTask,
  findingUser,
  displayPartiTask,
  taskUpdate,
  deleteTask,
} from "./task-controller";

taskRouter.post("", auth, (req, res) => {
  const { user } = req.body;

  try {
    const reqBody = req.body;
    const owner = user._id;

    const task = createTask(req.body, owner);

    res.status(createdC).send({ data: task, message: success });
  } catch (e) {
    res.status(badRequestC).send(badRequest);
  }
});

taskRouter.get("", auth, async (req: Request, res) => {
  const { user } = req.body;
  const query: querytype = req.query;

  const tasks = await displayTask(query, user._id);

  try {
    res.send({ data: tasks });
  } catch (e) {
    console.log("🚀 ~ file: tasks-router.ts:58 ~ taskRouter.get ~ e:", e);
    res.status(serverErrorC).send(serverError);
  }
});

taskRouter.get("/:id", auth, async (req, res) => {
  const { user } = req.body;
  const _id = req.params.id;
  try {
    const task = await displayPartiTask(_id, user);

    if (!task) {
      return res.status(notFoundC).send(notFound);
    }

    return res.send({ data: task });
  } catch (e) {}

  res.status(serverErrorC).send(serverError);
});

taskRouter.patch("/:id", auth, async (req, res) => {
  const update: string[] = Object.keys(req.body.data);

  const isValidOperation = validation(update);
  if (!isValidOperation) {
    return res.status(badRequestC).send(badRequest);
  }

  try {
    const { user } = req.body;
    const _id = req.params.id;
    const task = await findingUser(_id, user);

    if (!task) {
      return res.status(notFoundC).send(notFound);
    }

    const rettask = await taskUpdate(task._id, req.body.data);

    res.send({ data: rettask });
  } catch (e) {
    res.status(badRequestC).send(badRequest);
  }
});

taskRouter.delete("/:id", auth, async (req, res) => {
  try {
    const { user } = req.body;
    const task = await deleteTask(req.params.id, user._id);

    if (!task) {
      return res.status(notFoundC).send(notFound);
    }
    res.send({ data: task });
  } catch (e) {
    res.status(serverErrorC).send(serverError);
  }
});
