import type { HydratedDocument, Types } from "mongoose";
import type { Comment } from "./model";
import CommentModel from "./model";

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
    await comment.populate("parentId");
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
      .populate("authorId")
      .populate("parentId");
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
    return CommentModel.findById(commentId).populate(["authorId", "parentId"]);
  }

  /**
   * Delete a comment by id
   *
   * @param {string} commentId - The id of comment to delete
   * @return {Promise<Boolean>} - true if the comment has been deleted, false otherwise
   */
  static async deleteOne(commentId: Types.ObjectId | string): Promise<boolean> {
    const deletedComment = await CommentModel.deleteOne({ _id: commentId });
    return deletedComment !== null;
  }

  /**
   * Delete all the comments by the given author
   *
   * @param {string} authorId - The id of author of freets
   */
  static async deleteMany(authorId: Types.ObjectId | string): Promise<void> {
    await CommentModel.deleteMany({ authorId });
  }
}

export default CommentCollection;
