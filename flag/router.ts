import type { NextFunction, Request, Response } from "express";
import express from "express";
// import FlagCollection from "./collection";
import * as userValidator from "../user/middleware";
// import * as util from "./util";
import * as middleware from "../common/middleware";
// import * as flagValidator from "./middleware";

const router = express.Router();

/**
 * Get flags by parent
 *
 * @name GET /api/flags?parentId=id
 *
 * @return {FlagResponse[]} - An array of comments created under parentId
 * @throws {400} - If parentId is not given
 *
 */
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  // Check if authorId query parameter was supplied
  if (!req.query.parentId) {
    return res.status(400).json({ message: "No parentId supplied!" });
  }
});

/**
 * Create a new flag
 *
 * @name POST /api/flags
 *
 * @param {string} parentId - the id of the parent
 * @return {FlagResponse} - The created comment
 * @throws {403} - If the user is not logged in
 */
router.post(
  "/",
  [userValidator.isUserLoggedIn, middleware.isValidParentType],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ""; // Will not be an empty string since its validated in isUserLoggedIn
    const { parentId, parentType } = req.body;
  }
);

/**
 * Delete a flag
 *
 * @name DELETE /api/flags/:id
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the author of
 *                 the flag
 * @throws {404} - If the flagId is not valid
 */
router.delete(
  "/:flagId?",
  [
    userValidator.isUserLoggedIn,
    // flagValidator.doesFlagExist,
    // flagValidator.isValidFlagModifier,
  ],
  async (req: Request, res: Response) => {
    // await FlagCollection.deleteOne(req.params.commentId);
    // res.status(200).json({
    //   message: "Your flag was deleted successfully.",
    // });
  }
);

export { router as flagRouter };
