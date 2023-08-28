import Task, { TaskSchemaType } from "./task-models";
import { UserType, ReqBodyType } from "../../utils/types";
import { DisplayQueryType, QueryType } from "./types";
import { ObjectId } from "mongoose";
import * as cron from "node-cron";

export async function displayTask(
  { limit = "5", pageNo = "1", sortBy, completed }: QueryType,
  userId: string
) {
  let sort: Record<string, number> = {};
  let query: DisplayQueryType = { owner: userId };

  if (completed) {
    query = { ...query, completed };
  }

  var skip: number = 0;

  if (sortBy) {
    let parts: string[];
    parts = sortBy.split(":");
    sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
  }

  skip = (parseInt(pageNo) - 1) * parseInt(limit);

  const tasks = await Task.find(query, null, {
    limit: parseInt(limit),
    skip: skip,
    sort: sort,
  }).exec();

  return tasks;
}

export function validation(updates: string[]): boolean {
  const allowedUpdates = ["description", "completed"];
  const isValidOperation = updates.every((update) => {
    return allowedUpdates.includes(update);
  });

  return isValidOperation;
}
export async function createTask(reqBody: ReqBodyType, owner: ObjectId) {
  const createdTask = await Task.create({ ...reqBody, owner });
  if (!createdTask.completed) {
    const { _id } = createdTask;
    const task = cron.schedule("*/1 * * * *", async () => {
      console.log("task completed");
      await Task.findByIdAndUpdate(_id, { completed: true });
      task.stop();
    });
  }
  return { createdTask, owner };
}

export async function findingUser(
  _id: string,
  reqUser: UserType
): Promise<TaskSchemaType | null> {
  const task = Task.findOne({
    _id: _id,
    owner: reqUser._id,
  });
  return task;
}
export async function taskUpdate(
  taskId: ObjectId,
  reqBody: Record<string, string>
): Promise<TaskSchemaType | null> {
  await Task.findOneAndUpdate({ _id: taskId }, reqBody);
  const rettask = Task.findOne({ _id: taskId });
  return rettask;
}

export async function displayPartiTask(
  _id: string,
  reqUser: UserType
): Promise<TaskSchemaType | null> {
  const task = await Task.findOne({ _id, owner: reqUser._id });
  return task;
}

export async function deleteTask(
  id: string,
  user_Id: string
): Promise<TaskSchemaType | null> {
  const task = await Task.findOneAndDelete({
    _id: id,
    owner: user_Id,
  });

  return task;
}
