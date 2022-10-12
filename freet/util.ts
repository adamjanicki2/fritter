import type { HydratedDocument } from "mongoose";
import type { Freet, PopulatedFreet } from "../freet/model";
import { formatDate } from "../common/util";

// Update this if you add a property to the Freet type!
type FreetResponse = {
  _id: string;
  author: string;
  dateCreated: string;
  content: string;
  dateModified: string;
  likes: number;
  comments: number;
  flags: number;
};

/**
 * Transform a raw Freet object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Freet>} freet - A freet
 * @returns {FreetResponse} - The freet object formatted for the frontend
 */
const constructFreetResponse = (
  freet: HydratedDocument<Freet>
): FreetResponse => {
  const freetCopy: PopulatedFreet = {
    ...freet.toObject({
      versionKey: false, // Cosmetics; prevents returning of __v property
    }),
  };
  const { username } = freetCopy.authorId;
  delete freetCopy.authorId;
  return {
    ...freetCopy,
    _id: freetCopy._id.toString(),
    author: username,
    dateCreated: formatDate(freet.dateCreated),
    dateModified: formatDate(freet.dateModified),
  };
};

export { constructFreetResponse };
