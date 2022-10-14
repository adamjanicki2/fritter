import type { NextFunction, Request, Response } from "express";
import express from "express";
import * as userValidator from "../user/middleware";
import LikeCollection from "./collection";
import * as middleware from "../common/middleware";

const router = express.Router();

/**
 * Check if user has liked an item
 *
 * @name GET /api/likes?parentId=id
 * @param {string} parentId the id of the item
 *
 * @return {boolean} - whether the user has liked an item
 * @throws {400} - If parentId is not given
 * @throws {403} if user is not logged in
 * @throws {404} if parent does not exist
 *
 */
router.get(
  "/:parentId?",
  [
    userValidator.isUserLoggedIn,
    middleware.isInfoSupplied("query", ["parentId"]),
    middleware.doesParentExist("query"),
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.session.userId as string;
    const exists = LikeCollection.findByUserId(
      userId,
      req.query.parentId as string
    );
    res.status(200).json({ exists });
  }
);

/**
 * Create a new like.
 *
 * @name POST /api/likes
 *
 * @param {string} parentId - the id of the parent
 * @param {"comment" | "freet"} parentType - the type of the parent
 * @return {HydratedDocument<Like>} - The created like
 * @throws {403} - If the user is not logged in
 * @throws {400} if invalid parent type
 * @throws {404} if parent does not exist
 */
router.post(
  "/",
  [
    userValidator.isUserLoggedIn,
    middleware.isValidParentType("body"),
    middleware.doesParentExist("body"),
  ],
  async (req: Request, res: Response) => {
    const userId = req.session.userId as string;
    const { parentId, parentType } = req.body;
    const like = await LikeCollection.addOne(userId, parentId, parentType);
    res.status(201).json({
      message: "You liked the item successfully.",
      like,
    });
  }
);

/**
 * Delete a like
 *
 * @name DELETE /api/likes/:id
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the liker
 * @throws {400} - if the like id is not supplied
 */
router.delete(
  "/:likeId?",
  [
    userValidator.isUserLoggedIn,
    middleware.isInfoSupplied("params", ["likeId"]),
  ],
  async (req: Request, res: Response) => {
    const likeId = req.params.likeId;
    const userId = req.session.userId as string;
    await LikeCollection.deleteOne(likeId);
    res.status(200).json({
      message: "Your like was deleted successfully.",
    });
  }
);

export { router as likeRouter };
