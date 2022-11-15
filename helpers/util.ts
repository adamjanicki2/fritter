import { Request, Response, NextFunction } from "express";
import { responseHandler } from "express-intercept";
import axios from "axios";

export async function getTitle() {
  const title = await axios.get("https://jsonplaceholder.typicode.com/todos/1");
  return "CUSTOM TITLE ASYNC";
}

export const customMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const title = await getTitle();
  const pickSix = responseHandler().replaceString((body) =>
    body.replace("__OG_TITLE__", title)
  );
  pickSix(req, res, next);
};
