import type { NextFunction, Request, Response } from "express";
import express from "express";
import FollowerCollection from "./collection";
import * as userValidator from "../user/middleware";
import * as middleware from "./middleware";
import { isInfoSupplied } from "../common/middleware";

const router = express.Router();

router.get(
  "/:userId?",
  [isInfoSupplied("query", ["userId"])],
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.query.userId;
    return res
      .status(200)
      .json(FollowerCollection.getFollowerStatistics(userId as string));
  }
);

router.post(
  "/",
  [userValidator.isUserLoggedIn, middleware.doesFollow],
  async (req: Request, res: Response, next: NextFunction) => {
    const { follower, followee } = req.body;
    return res.status(201).json(FollowerCollection.addOne(follower, followee));
  }
);

router.delete(
  "/:followerId",
  [userValidator.isUserLoggedIn],
  async (req: Request, res: Response, next: NextFunction) => {
    await FollowerCollection.deleteOne(req.params.followerId);
    return res.status(200).json({
      message: "Your follower was deleted successfully.",
    });
  }
);

export { router as followerRouter };
