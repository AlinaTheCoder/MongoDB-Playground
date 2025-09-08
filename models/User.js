import { Schema, model } from "mongoose";
import { type } from "os";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
  },
  { timestamps: true }
);

userSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    try {
      // before deleting the parent user delete all of it's task
      // now i also want to delete the refresh tokens assosiated with that particular user to be deleted
      const Token = model("refresh_tokens");
      await Token.deleteMany({ user_id: this._id });
      const Task = model("tasks");
      await Task.deleteMany({ owner: this._id });
      next();
    } catch (error) {
      next(error);
    }
  }
);

const userModel = model("users", userSchema);

export default userModel;
