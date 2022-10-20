import CommentCollection from "../comment/collection";
import type { Request, Response, NextFunction } from "express";
import FreetCollection from "../freet/collection";
import FlagCollection from "../flag/collection";
import LikeCollection from "../like/collection";
import { Types } from "mongoose";

type RequestInformation = "params" | "body" | "query";

const COLLECTIONS = {
  flag: FlagCollection.findByUserId,
  like: LikeCollection.findByUserId,
} as const;

export const doesDuplicateExist = (
  collection: "flag" | "like",
  reqInfoType: RequestInformation
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { parentId } = req[reqInfoType];
    const doesExist = await COLLECTIONS[collection](
      req.session.userId,
      parentId
    );
    if (doesExist) {
      return res
        .status(404)
        .json({ message: `There's already a ${collection} for this user!` });
    }
    next();
  };
};

/**
 * Checks if the content of the freet/comment in req.body is valid, i.e not a stream of empty
 * spaces and not more than 140 characters
 */
export const isValidContent = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { content } = req.body as { content: string };
  if (!content.trim()) {
    res.status(400).json({
      error: "Freet content must be at least one character long.",
    });
    return;
  }

  if (content.length > 140) {
    res.status(413).json({
      error: "Freet content must be no more than 140 characters.",
    });
    return;
  }

  next();
};

/**
 * Checks if valid parentType
 */
export const isValidParentType = (reqInfoType: RequestInformation) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const parentType = req[reqInfoType].parentType as string;
    if (parentType !== "comment" && parentType !== "freet") {
      return res.status(400).json({ message: "Wrong parentType" });
    }
    next();
  };
};

/**
 * Check if the appropriate params are supplied to endpoints
 *
 * @param reqInfoType either params or query or body
 * @param fields the fields to check if they exist
 * @returns a callback to use as middleware
 */
export const isInfoSupplied = (
  reqInfoType: "body" | "params" | "query",
  fields: string[]
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const information = req[reqInfoType];
    for (const field of fields) {
      if (!information[field]) {
        return res.status(400).json({
          message: `field '${field}' not supplied in req.${reqInfoType}`,
        });
      }
    }
    next();
  };
};

/**
 * Check if the appropriate params are valid mongo ids
 *
 * @param reqInfoType either params or query or body
 * @param fields the fields to check if they are valid ids
 * @returns a callback to use as middleware
 */
export const isInfoValidId = (
  reqInfoType: "body" | "params" | "query",
  fields: string[]
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const information = req[reqInfoType];
    for (const field of fields) {
      if (!Types.ObjectId.isValid(information[field])) {
        return res.status(400).json({
          message: `field '${field}' is not a valid 12-byte Mongo ID in req.${reqInfoType}`,
        });
      }
    }
    next();
  };
};

const PARENT_TO_FIND_OPERATION = {
  comment: CommentCollection.findById,
  freet: FreetCollection.findById,
} as const;

/**
 * Determine whether parent exists
 *
 * @param reqInfoType
 * @returns callback for validation
 */
export const doesParentExist = (reqInfoType: "body" | "params" | "query") => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const id = req[reqInfoType].parentId as string;
    const parentType = req[reqInfoType].parentType as "comment" | "freet";
    const item = await PARENT_TO_FIND_OPERATION[parentType](id);
    if (!item) {
      return res.status(404).json({
        message: `parentId: '${id}' does not exist with parentType: '${parentType}'`,
      });
    }
    next();
  };
};
