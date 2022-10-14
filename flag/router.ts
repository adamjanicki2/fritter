import type { NextFunction, Request, Response } from "express";
import express from "express";
import * as userValidator from "../user/middleware";
import FlagCollection from "./collection";
import * as middleware from "../common/middleware";

const router = express.Router();

/**
 * Check if user has flagged an item
 *
 * @name GET /api/flags?parentId=id
 * @param {string} parentId the id of the item
 *
 * @return {boolean} - whether the user has flaggedd an item
 * @throws {400} - If parentId is not given
 * @throws {403} if user is not logged in
 *
 */
router.get(
  "/:parentId?",
  [
    userValidator.isUserLoggedIn,
    middleware.isInfoSupplied("query", ["parentId"]),
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.session.userId as string;
    const exists = FlagCollection.findByUserId(
      userId,
      req.query.parentId as string
    );
    res.status(200).json({ exists });
  }
);

/**
 * Create a new flag.
 *
 * @name POST /api/flags
 *
 * @param {string} parentId - the id of the parent
 * @param {"comment" | "freet"} parentType - the type of the parent
 * @return {HydratedDocument<Flag>} - The created flag
 * @throws {403} - If the user is not logged in
 * @throws {400} if wrong parentType supplied
 */
router.post(
  "/",
  [userValidator.isUserLoggedIn, middleware.isValidParentType("body")],
  async (req: Request, res: Response) => {
    const userId = req.session.userId as string;
    const { parentId, parentType } = req.body;
    const flag = await FlagCollection.addOne(userId, parentId, parentType);
    res.status(201).json({
      message: "You flaggedd the item successfully.",
      flag,
    });
  }
);

/**
 * Delete a flag
 *
 * @name DELETE /api/flags/:id
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the flagger
 * @throws {400} - if the flag id is not supplied
 */
router.delete(
  "/:flagId?",
  [
    userValidator.isUserLoggedIn,
    middleware.isInfoSupplied("params", ["flagId"]),
  ],
  async (req: Request, res: Response) => {
    const flagId = req.params.flagId;
    const userId = req.session.userId as string;
    await FlagCollection.deleteOne(flagId);
    res.status(200).json({
      message: "Your flag was deleted successfully.",
    });
  }
);

export { router as flagRouter };
