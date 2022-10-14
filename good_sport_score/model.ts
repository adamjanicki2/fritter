import type { Types } from "mongoose";
import { Schema, model } from "mongoose";
import type { User } from "../user/model";

export type GoodSportScore = {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  score: number;
};

export type PopulatedGoodSportScore = {
  _id: Types.ObjectId;
  userId: User;
  score: number;
};

const GoodSportScoreSchema = new Schema<GoodSportScore>({
  userId: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  // The score
  score: {
    type: Number,
    required: true,
  },
});

export default model<GoodSportScore>("GoodSportScore", GoodSportScoreSchema);
