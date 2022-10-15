import type { NextFunction, Request, Response } from "express";
import express from "express";
import CommentCollection from "./collection";
import FreetCollection from "../freet/collection";
import * as userValidator from "../user/middleware";
import * as util from "./util";
import * as middleware from "../common/middleware";
import * as commentValidator from "./middleware";
import FlagCollection from "../flag/collection";
import LikeCollection from "../like/collection";

const router = express.Router();

/**
 * Get comments by parent
 *
 * @name GET /api/comments?parentId=id
 *
 * @return {CommentResponse[]} - An array of comments created under parentId
 * @throws {400} - If parentId is not given
 *
 */
router.get(
  "/",
  [middleware.isInfoSupplied("query", ["parentId"])],
  async (req: Request, res: Response, next: NextFunction) => {
    const comments = await CommentCollection.findByParentId(
      req.query.parentId as string
    );
    const response = comments.map(util.constructCommentResponse);
    return res.status(200).json(response);
  }
);

/**
 * Create a new comment.
 *
 * @name POST /api/comments
 *
 * @param {string} content - The content of the comment
 * @param {string} parentId - the id of the parent
 * @param {"comment" | "freet"} parentType - the type of the parent
 * @return {CommentResponse} - The created comment
 * @throws {403} - If the user is not logged in
 * @throws {404} if the parent does not exist
 * @throws {400} - If the comment content is empty or a stream of empty spaces or if the parentType is wrong
 * @throws {413} - If the comment content is more than 140 characters long
 */
router.post(
  "/",
  [
    userValidator.isUserLoggedIn,
    middleware.isValidContent,
    middleware.isValidParentType("body"),
    middleware.doesParentExist("body"),
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ""; // Will not be an empty string since its validated in isUserLoggedIn
    const { parentId, parentType, content } = req.body;
    const comment = await CommentCollection.addOne(
      userId,
      parentId,
      parentType,
      content
    );

    res.status(201).json({
      message: "Your comment was created successfully.",
      comment: util.constructCommentResponse(comment),
    });
  }
);

/**
 * Delete a comment
 *
 * @name DELETE /api/comments/:id
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the author of
 *                 the comment
 * @throws {404} - If the commentId is not valid
 */
router.delete(
  "/:commentId?",
  [
    userValidator.isUserLoggedIn,
    commentValidator.doesCommentExist,
    commentValidator.isValidCommentModifier,
  ],
  async (req: Request, res: Response) => {
    const { commentId } = req.params;
    await CommentCollection.deleteOne(req.params.commentId);
    const filter = { parentId: commentId };
    await CommentCollection.deleteMany(filter);
    await FlagCollection.deleteMany(filter);
    await LikeCollection.deleteMany(filter);
    res.status(200).json({
      message: "Your comment was deleted successfully.",
    });
  }
);

export { router as commentRouter };
