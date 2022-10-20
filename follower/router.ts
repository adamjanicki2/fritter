import type { NextFunction, Request, Response } from "express";
import express from "express";
import FollowerCollection from "./collection";
import * as userValidator from "../user/middleware";
import * as middleware from "./middleware";
import { isInfoSupplied, isInfoValidId } from "../common/middleware";

const router = express.Router();

router.get(
  "/:userId?",
  [isInfoSupplied("query", ["userId"]), isInfoValidId("query", ["userId"])],
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.query.userId;
    return res
      .status(200)
      .json(await FollowerCollection.getFollowerStatistics(userId as string));
  }
);

router.post(
  "/",
  [userValidator.isUserLoggedIn, middleware.doesFollow],
  async (req: Request, res: Response, next: NextFunction) => {
    const follower = req.session.userId;
    const { followee } = req.body;
    return res
      .status(201)
      .json(await FollowerCollection.addOne(follower, followee));
  }
);

router.delete(
  "/:followee",
  [
    userValidator.isUserLoggedIn,
    isInfoSupplied("params", ["followee"]),
    isInfoValidId("params", ["followee"]),
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    await FollowerCollection.deleteOne(req.params.followee);
    return res.status(200).json({
      message: "Your follower was deleted successfully.",
    });
  }
);

export { router as followerRouter };
