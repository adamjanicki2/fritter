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
    return res
      .status(200)
      .json(
        util.formatScoreResponse(
          await GoodSportScoreCollection.findByUserId(userId)
        )
      );
  }
);

export { router as goodSportScoreRouter };
