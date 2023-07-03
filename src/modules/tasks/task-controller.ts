import Task, { taskschematype } from "./task-models";
import { usertype, reqBodytype } from "../../utils/types";
import { createTaskReturnType, displayQueryType, querytype } from "./types";
import { ObjectId } from "mongoose";

export async function displayTask(
  { limit = "5", pageno = "1", sortBy, completed }: querytype,
  userid: string
) {
  let sort: Record<string, number> = {};
  let query: displayQueryType = { owner: userid };

  if (completed) {
    query = { ...query, completed };
  }

  var skip: number = 0;

  if (sortBy) {
    let parts: string[];
    parts = sortBy.split(":");
    sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
  }

  skip = (parseInt(pageno) - 1) * parseInt(limit);

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
export function createTask(
  reqBody: reqBodytype,
  owner: ObjectId
): createTaskReturnType {
  Task.create({ ...reqBody, owner });
  return { reqBody, owner };
}

export async function findingUser(
  _id: string,
  reqUser: usertype
): Promise<taskschematype | null> {
  const task = Task.findOne({
    _id: _id,
    owner: reqUser._id,
  });
  return task;
}
export async function taskUpdate(
  taskid: ObjectId,
  reqBody: Record<string, string>
): Promise<taskschematype | null> {
  await Task.findOneAndUpdate({ _id: taskid }, reqBody);
  const rettask = Task.findOne({ _id: taskid });
  return rettask;
}

export async function displayPartiTask(
  _id: string,
  reqUser: usertype
): Promise<taskschematype | null> {
  const task = await Task.findOne({ _id, owner: reqUser._id });
  return task;
}

export async function deleteTask(
  id: string,
  user_id: string
): Promise<taskschematype | null> {
  const task = await Task.findOneAndDelete({
    _id: id,
    owner: user_id,
  });

  return task;
}
