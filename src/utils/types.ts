import { ObjectId } from "mongoose";
import { userschematype } from "../modules/user/user-models";

export interface usertype {
  _id: ObjectId;
  name: string;
  email: string;
  password: string;
  age: number;
  tokens: {
    token: string;
    _id: ObjectId;
  };
  createdAt: NativeDate;
  updatedAt: NativeDate;
}

export interface reqBodytype {
  name: string;
  password: string;
}

export interface tokentype {
  token: string;
  _id: ObjectId;
}

export interface postuserreturntype {
  user: userschematype;
  token: string;
}
