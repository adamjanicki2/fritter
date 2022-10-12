import type { Types } from "mongoose";
import { Schema, model } from "mongoose";
import type { User } from "../user/model";

export type Comment = {
  _id: Types.ObjectId;
  authorId: Types.ObjectId;
  parentId: Types.ObjectId;
  parentType: "freet" | "comment";
  dateCreated: Date;
  content: string;
  likes: number;
  flags: number;
};

export type PopulatedComment = {
  _id: Types.ObjectId;
  authorId: User;
  parentId: Types.ObjectId;
  parentType: "freet" | "comment";
  dateCreated: Date;
  content: string;
  likes: number;
  flags: number;
};

const CommentSchema = new Schema<Comment>({
  // The author userId
  authorId: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  // The parent _id
  parentId: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
  },
  // The date the comment was created
  dateCreated: {
    type: Date,
    required: true,
  },
  // The content of the comment
  content: {
    type: String,
    required: true,
  },
  // The number of likes
  likes: {
    type: Number,
    required: true,
  },
  // The number of flags
  flags: {
    type: Number,
    required: true,
  },
});

export default model<Comment>("Comment", CommentSchema);
