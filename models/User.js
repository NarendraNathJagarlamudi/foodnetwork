import mongoose, { model, Schema, models } from "mongoose";

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  shop_name: { type: String, required: true },
  location: { type: String, required: true },
  governmentID: { type: String, required: true, unique: true },
  description: { type: String, required: true },
});

export const User = models?.User || model("User", userSchema);
