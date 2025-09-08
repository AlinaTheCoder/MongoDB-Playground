import { Schema, model } from "mongoose";

const refreshTokenSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "users",
  },
  refresh_token: {
    type: String,
    required: true,
  },
});

const refreshTokenModel = model("refresh_tokens", refreshTokenSchema);
export default refreshTokenModel;
