import { Schema, model } from "mongoose";

export interface TaskSchemaType {
  description: string;
  completed: boolean;
  owner: Schema.Types.ObjectId;
  _id: Schema.Types.ObjectId;
}
const taskSchema = new Schema<TaskSchemaType>(
  {
    description: {
      type: String,
      required: true,
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Task = model("Task", taskSchema);
export default Task;
