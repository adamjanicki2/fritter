import type { NextFunction, Request, Response } from "express";
import express from "express";
import GoodSportScoreCollection from "./collection";
import * as userValidator from "../user/middleware";
import * as util from "./util";

const router = express.Router();

// NOTE: there's only one endpoint her because the other collection operations are synced with posting freets and comments!

router.get(
  "/",
  [userValidator.isUserLoggedIn],
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.session.userId as string;
    return res.status(200).json(GoodSportScoreCollection.findByUserId(userId));
  }
);

router.get(
  "/tempy/:content?",
  async (req: Request, res: Response, next: NextFunction) => {
    const content = req.query.content;
    return res
      .status(200)
      .json({ content, score: util.getSentimentScore(content as string) });
  }
);
export { router as goodSportScoreRouter };
