import type { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import CommentCollection from "./collection";

/**
 * Checks if a comment with commentId exists
 */
export const doesCommentExist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { commentId } = req.params;
  const validFormat = Types.ObjectId.isValid(commentId);
  const comment = validFormat
    ? await CommentCollection.findById(commentId)
    : "";
  if (!comment) {
    return res.status(404).json({
      error: {
        commentNotFound: `Comment with comment ID ${commentId} does not exist.`,
      },
    });
  }

  next();
};

/**
 * Checks if the current user is the author of the comment whose commentId is in req.params
 */
export const isValidCommentModifier = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const comment = await CommentCollection.findById(req.params.commentId);
  const userId = comment.authorId._id;
  if (req.session.userId !== userId.toString()) {
    res.status(403).json({
      error: "Cannot modify other users' comments.",
    });
    return;
  }

  next();
};

/**
 * Checks if valid parentType is in req.body
 */
export const isValidParentType = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { parentType } = req.body;
  if (parentType !== "comment" && parentType !== "freet") {
    return res.status(400).json({ message: "Wrong parentType" });
  }
  next();
};
