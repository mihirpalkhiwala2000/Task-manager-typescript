import Task from "../models/task-models";
export function displayTask(reqQuery: {
  completed: string;
  sortBy: string;
  limit: string;
  skip: string;
}) {
  let parts: string[];
  let sort: any;
  let match: { completed?: boolean } = {};

  if (reqQuery.completed) {
    match.completed = reqQuery.completed === "true";
  }

  if (reqQuery.sortBy) {
    parts = reqQuery.sortBy.split(":");
    sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
  }

  const limit = parseInt(reqQuery.limit);
  const skip = parseInt(reqQuery.skip);

  return { match, sort, limit, skip };
}

export function validation(updates: string[]) {
  const allowedUpdates = ["description", "completed"];
  const isValidOperation = updates.every((update) => {
    return allowedUpdates.includes(update);
  });

  return isValidOperation;
}
export function createTask(task: any) {
  task.save();
}
interface usertype {
  _id: string;
  name: string;
  email: string;
  password: string;
  age: number;
  tokens: {
    token: string;
  };
}
interface reqBodytype extends Request {
  name: string;
  password: string;
  age: number;
}
export async function findTask(_id: string, reqUser: usertype) {
  const task = await Task.findOne({ _id, owner: reqUser._id });
  return task;
}
export async function findingUser(_id: string, reqUser: usertype) {
  const task = Task.findOne({
    _id: _id,
    owner: reqUser._id,
  });
  return task;
}
export async function taskUpdate(task: any, updates: string[], reqBody: any) {
  updates.forEach((update) => (task[update] = reqBody[update]));
  await task.save();

  return task;
}

export function displayPartiTask(_id: string, reqUser: usertype) {
  return findTask(_id, reqUser);
}

export async function deleteTask(id: string, user_id: string) {
  const task = await Task.findOneAndDelete({
    _id: id,
    owner: user_id,
  });

  return task;
}
