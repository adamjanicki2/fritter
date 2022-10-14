import type { Request, Response, NextFunction } from "express";

type RequestInformation = "params" | "body" | "query";

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
