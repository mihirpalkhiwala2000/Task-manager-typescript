import { Schema, model } from "mongoose";
import validator from "validator";
import constants from "../../constant";
import { ObjectId } from "mongoose";
const { errorMsgs } = constants;
const { emailError, passError, ageError } = errorMsgs;

export interface userschematype {
  name: string;
  email: string;
  password: string;
  age: number;
  tokens: any;
  _id: ObjectId;
  createdAt: NativeDate;
  updatedAt: NativeDate;
}

const userSchema = new Schema<userschematype>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
      validate(value: string) {
        if (!validator.isEmail(value)) {
          throw new Error(emailError);
        }
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 7,
      trim: true,
      validate(value: string) {
        if (value.toLowerCase().includes("password")) {
          throw new Error(passError);
        }
      },
    },
    age: {
      type: Number,
      default: 0,
      validate(value: number) {
        if (value < 0) {
          throw new Error(ageError);
        }
      },
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;
  return userObject;
};

const User = model("User", userSchema);
export default User;
