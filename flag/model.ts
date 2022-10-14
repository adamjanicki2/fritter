import type { Types } from "mongoose";
import { Schema, model } from "mongoose";
import type { User } from "../user/model";

export type Flag = {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  parentId: Types.ObjectId;
  parentType: "comment" | "freet";
};

export type PopulatedFlag = {
  _id: Types.ObjectId;
  userId: User;
  parentId: Types.ObjectId;
  parentType: "comment" | "freet";
};

const FlagSchema = new Schema<Flag>({
  userId: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  parentId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  parentType: {
    type: String,
    required: true,
  },
});

export default model<Flag>("Flag", FlagSchema);
