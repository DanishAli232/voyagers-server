import mongoose, { Schema, model } from "mongoose";
import hashPassword from "../utils/hashPassword.js";

const UserSchema = new Schema({
  username: { type: Schema.Types.String, required: true },
  email: { type: Schema.Types.String, required: true, select: false },
  password: { type: Schema.Types.String, required: true, select: false },
  accountId: { type: Schema.Types.String, select: false },
  isCompleted: { type: Schema.Types.Boolean },
  role: { type: Schema.Types.String, enum: ["user", "seller"], default: "user" },
});

// Hash the user's password before saving it
UserSchema.pre("save", hashPassword);

export default model("User", UserSchema);
