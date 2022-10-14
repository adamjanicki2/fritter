import CommentCollection from "comment/collection";
import FreetCollection from "freet/collection";
import moment from "moment";

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
export const formatDate = (date: Date): string =>
  moment(date).format("MMMM Do YYYY, h:mm:ss a");

export const PARENT_TO_INCREMENT_FUNC = {
  comment: CommentCollection.incrementStats,
  freet: FreetCollection.incrementStats,
} as const;
