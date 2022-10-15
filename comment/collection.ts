import FreetCollection from "../freet/collection";
import GoodSportScoreCollection from "../good_sport_score/collection";
import type { HydratedDocument, Types } from "mongoose";
import type { Comment } from "./model";
import CommentModel from "./model";
import type { DeleteFilter } from "../common/util";

class CommentCollection {
  /**
   * Add a comment to the collection
   *
   * @param {string} authorId - The id of the author of the comment
   * @param {string} parentId - the id of the parent content
   * @param {"comment" | "freet"} parentType - the type of parent content
   * @param {string} content - The id of the content of the comment
   * @return {Promise<HydratedDocument<Comment>>} - The newly created comment
   */
  static async addOne(
    authorId: Types.ObjectId | string,
    parentId: Types.ObjectId | string,
    parentType: "freet" | "comment",
    content: string
  ): Promise<HydratedDocument<Comment>> {
    const comment = new CommentModel({
      authorId,
      parentId,
      parentType,
      dateCreated: new Date(),
      content,
      likes: 0,
      flags: 0,
    });
    await comment.save();
    if (parentType === "freet") {
      FreetCollection.incrementStats(parentId, "comments", 1);
    }
    await GoodSportScoreCollection.updateOne(authorId, true, content);
    return comment.populate("authorId");
  }

  /**
   * Get all the comments for a parent
   *
   * @param {string} parentId - the id of the parent to fetch for
   *
   * @return {Promise<HydratedDocument<Comment>[]>} - An array of all of the comments
   */
  static async findByParentId(
    parentId: Types.ObjectId | string
  ): Promise<Array<HydratedDocument<Comment>>> {
    // Retrieves comments and sorts them from most to least recent
    return CommentModel.find({ parentId })
      .sort({ dateCreated: -1 })
      .populate("authorId");
  }

  /**
   * Get all the comments for a parent
   *
   * @param {string} commentId - the id of the comment to fetch for
   *
   * @return {Promise<HydratedDocument<Comment>> | null} - An array of all of the comments
   */
  static async findById(
    commentId: Types.ObjectId | string
  ): Promise<HydratedDocument<Comment>> {
    return CommentModel.findById(commentId).populate("authorId");
  }

  /**
   * Delete a comment by id
   *
   * @param {string} commentId - The id of comment to delete
   * @return {Promise<Boolean>} - true if the comment has been deleted, false otherwise
   */
  static async deleteOne(commentId: Types.ObjectId | string): Promise<boolean> {
    const deletedComment = await CommentModel.findOneAndDelete({
      _id: commentId,
    });
    const parentType = deletedComment?.parentType;
    if (parentType === "freet") {
      FreetCollection.incrementStats(deletedComment.parentId, "comments", -1);
    }
    deletedComment &&
      (await GoodSportScoreCollection.updateOne(
        deletedComment.authorId,
        false,
        deletedComment.content
      ));
    return deletedComment !== null;
  }

  /**
   * Delete all the comments by the given author
   *
   * @param {DeleteFilter} filter - filter to find by
   */
  static async deleteMany(filter: DeleteFilter): Promise<void> {
    await CommentModel.deleteMany(filter);
  }

  /**
   * Update comment stats
   *
   * @param commentId id of the comment
   * @param stat to increment
   * @param inc 1 or -1
   */
  static async incrementStats(
    commentId: Types.ObjectId | string,
    stat: "likes" | "flags",
    inc: 1 | -1
  ): Promise<void> {
    const comment = await CommentModel.findById(commentId);
    comment[stat] += inc;
    await comment.save();
  }
}

export default CommentCollection;
