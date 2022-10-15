import type { HydratedDocument } from "mongoose";
import type { Comment, PopulatedComment } from "./model";
import { formatDate } from "../common/util";

type CommentResponse = {
  _id: string;
  author: string;
  dateCreated: string;
  content: string;
  likes: number;
  flags: number;
};

/**
 * Transform a raw comment object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Comment>} comment - A comment
 * @returns {CommentResponse} - The comment object formatted for the frontend
 */
const constructCommentResponse = (
  comment: HydratedDocument<Comment>
): CommentResponse => {
  const commentCopy: PopulatedComment = {
    ...comment.toObject({
      versionKey: false,
    }),
  };
  const { username } = commentCopy.authorId;
  return {
    ...commentCopy,
    _id: commentCopy._id.toString(),
    author: username,
    dateCreated: formatDate(commentCopy.dateCreated),
  };
};

export { constructCommentResponse };
