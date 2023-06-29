import mongoose from "mongoose";
import validator from "validator";
import constants from "../constant";
const { errorMsgs } = constants;
const { emailError, passError, ageError } = errorMsgs;

const userSchema = new mongoose.Schema(
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
      validate(value) {
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
      validate(value) {
        if (value.toLowerCase().includes("password")) {
          throw new Error(passError);
        }
      },
    },
    age: {
      type: Number,
      default: 0,
      validate(value) {
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

userSchema.virtual("tasks", {
  ref: "Task",
  localField: "_id",
  foreignField: "owner",
});

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;
  return userObject;
};

// userSchema.statics.findByCredentials = async (email, password) => {
//   const user = await User.findOne({ email });

//   if (!user) {
//     throw new Error("Unable to login");
//   }
//   const isMatch = await bcrypt.compare(password, user.password);

//   if (!isMatch) {
//     throw new Error("Unable to login");
//   }
//   return user;
// };

// Hash the password before saving
// userSchema.pre("save", async function (next) {
//   const user = this;

//   if (user.isModified("password")) {
//     user.password = await bcrypt.hash(user.password, 8);
//   }

//   next();
// });

// Delete user task when user is removed
// userSchema.pre("findOneAndDelete", async function (next) {
//   const user = this;

//   await Task.deleteMany({ owner: user._conditions._id });

//   next();
// });

const User = mongoose.model("User", userSchema);
export default User;
