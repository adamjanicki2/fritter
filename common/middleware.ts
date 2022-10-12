import type { Request, Response, NextFunction } from "express";

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
