import type { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import FreetCollection from "../freet/collection";

/**
 * Checks if a freet with freetId is req.params exists
 */
const isFreetExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validFormat = Types.ObjectId.isValid(req.params.freetId);
  const freet = validFormat
    ? await FreetCollection.findOne(req.params.freetId)
    : "";
  if (!freet) {
    res.status(404).json({
      error: {
        freetNotFound: `Freet with freet ID ${req.params.freetId} does not exist.`,
      },
    });
    return;
  }

  next();
};

/**
 * Checks if the current user is the author of the freet whose freetId is in req.params
 */
const isValidFreetModifier = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const freet = await FreetCollection.findOne(req.params.freetId);
  const userId = freet.authorId._id;
  if (req.session.userId !== userId.toString()) {
    res.status(403).json({
      error: "Cannot modify other users' freets.",
    });
    return;
  }

  next();
};

export { isFreetExists, isValidFreetModifier };
