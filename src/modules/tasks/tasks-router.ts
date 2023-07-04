import * as express from "express";
import { Request } from "express";
const taskRouter = express.Router();
export default taskRouter;
import auth from "../../middleware/auth";
import constants from "../../constant";
const { successMsgs, errorMsgs, statusCodes } = constants;
const { success } = successMsgs;
const { badRequest, serverError, notFound, noTaskError } = errorMsgs;
const { createdC, badRequestC, notFoundC, serverErrorC } = statusCodes;
import { QueryType } from "./types";
import {
  displayTask,
  validation,
  createTask,
  findingUser,
  displayPartiTask,
  taskUpdate,
  deleteTask,
} from "./task-controller";
import { Error } from "mongoose";

taskRouter.post("", auth, (req, res) => {
  const { user } = req.body;

  try {
    const reqBody = req.body;
    const owner = user._id;

    const task = createTask(req.body, owner);
    delete req.body.user;
    res.status(createdC).send({ data: task, message: success });
  } catch (e: any) {
    res.status(badRequestC).send(badRequest);
  }
});

taskRouter.get("", auth, async (req: Request, res) => {
  const { user } = req.body;
  const query: QueryType = req.query;

  const tasks = await displayTask(query, user._id);

  try {
    res.send({ data: tasks });
  } catch (e) {
    res.status(serverErrorC).send(serverError);
  }
});

taskRouter.get("/:id", auth, async (req, res) => {
  const { user } = req.body;
  const _id = req.params.id;
  try {
    const task = await displayPartiTask(_id, user);

    if (!task) {
      return res.status(notFoundC).send(noTaskError);
    }

    return res.send({ data: task });
  } catch (e) {
    res.status(badRequestC).send(badRequest);
  }
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
      return res.status(notFoundC).send(noTaskError);
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
      return res.status(notFoundC).send(noTaskError);
    }
    res.send({ data: task });
  } catch (e) {
    res.status(serverErrorC).send(serverError);
  }
});
