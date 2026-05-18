// Mongoose user model.
import { Document, Schema, Types, model } from "mongoose";
import { USER_ROLES } from "../constants/domain";
import { IUser } from "../types";

export interface UserDocument extends Omit<IUser, "_id">, Document<Types.ObjectId> {
  _id: Types.ObjectId;
}

const userSchema = new Schema<UserDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: USER_ROLES,
      default: "sales",
    },
  },
  {
    timestamps: true,
  }
);

export const User = model<UserDocument>("User", userSchema);
