import { ObjectId } from "mongoose";
import { reqBodytype } from "../../utils/types";
export interface reqQuerytype {
  completed: string;
  sortBy: string;
  limit: string;
  skip: string;
  pageno: string;
}

export interface tasktype {
  description?: string;
  completed?: boolean;
  owner?: ObjectId;
  _id?: ObjectId;
  createdAt?: NativeDate;
  updatedAt?: NativeDate;
}

export interface querytype {
  completed?: string;
  sortBy?: string;
  pageno?: string;
  limit?: string;
}

export interface displayQueryType {
  owner: string;
  completed?: string;
}

export interface createTaskReturnType {
  reqBody: reqBodytype;
  owner: ObjectId;
}
