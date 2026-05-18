import { Document, Schema, Types, model } from "mongoose";
import { ILead } from "../types";

export interface LeadDocument extends Omit<ILead, "_id">, Document<Types.ObjectId> {
  _id: Types.ObjectId;
}

const leadSchema = new Schema<LeadDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["New", "Contacted", "Qualified", "Lost"],
      default: "New",
    },
    source: {
      type: String,
      enum: ["Website", "Instagram", "Referral"],
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Lead = model<LeadDocument>("Lead", leadSchema);
