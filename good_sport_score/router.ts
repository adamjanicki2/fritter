import type { NextFunction, Request, Response } from "express";
import express from "express";
// import GoodSportScoreCollection from "./collection";
import * as userValidator from "../user/middleware";
// import * as util from "./util";
import * as middleware from "../common/middleware";
// import * as GoodSportScoreValidator from "./middleware";

const router = express.Router();

export { router as goodSportScoreRouter };
