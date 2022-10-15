import type { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import FollowerCollection from "./collection";

export const doesFollow = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { followee } = req.body;
  const follower = req.session.userId;
  const validFormat =
    Types.ObjectId.isValid(follower) && Types.ObjectId.isValid(followee);
  const exists =
    !validFormat || (await FollowerCollection.doesFollow(follower, followee));
  if (exists) {
    return res.status(404).json({
      error: {
        followerExists: `${follower} already follows ${followee}`,
      },
    });
  }

  next();
};
