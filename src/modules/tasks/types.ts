import { ObjectId } from "mongoose";
import { ReqBodyType } from "../../utils/types";

export interface QueryType {
  completed?: string;
  sortBy?: string;
  pageNo?: string;
  limit?: string;
}

export interface DisplayQueryType {
  owner: string;
  completed?: string;
}

export interface CreateTaskReturnType {
  reqBody: ReqBodyType;
  owner: ObjectId;
}
