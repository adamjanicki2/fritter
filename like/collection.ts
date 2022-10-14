import type { HydratedDocument, Types } from "mongoose";
import type { Like } from "./model";
import LikeModel from "./model";
import { PARENT_TO_INCREMENT_FUNC } from "../common/util";

class LikeCollection {
  /**
   * Add a Like to the collection
   *
   * @param {string} userId - The id of the user
   * @param {string} parentId - the id of the parent
   * @param {string} parentType - the type of parent
   * @return {Promise<HydratedDocument<Like>>} - The newly created Like
   */
  static async addOne(
    userId: Types.ObjectId | string,
    parentId: Types.ObjectId | string,
    parentType: "comment" | "freet"
  ): Promise<HydratedDocument<Like>> {
    const Like = new LikeModel({
      userId,
      parentId,
      parentType,
    });
    PARENT_TO_INCREMENT_FUNC[parentType](parentId, "likes", 1);
    await Like.save();
    return Like.populate("userId");
  }

  /**
   * determine if a user has liked an item
   *
   * @param {string} userId - the id of the user
   * @param {string} parentId - the id of the item
   *
   * @return {Promise<boolean>}
   */
  static async findByUserId(
    userId: Types.ObjectId | string,
    parentId: Types.ObjectId | string
  ): Promise<boolean> {
    return (await LikeModel.findOne({ userId, parentId })) !== null;
  }

  /**
   * Delete a Like by id
   *
   * @param {string} LikeId - The id of Like to delete
   * @return {Promise<Boolean>} - true if the Like has been deleted, false otherwise
   */
  static async deleteOne(LikeId: Types.ObjectId | string): Promise<boolean> {
    const deletedLike = await LikeModel.findOneAndDelete({
      _id: LikeId,
    });
    deletedLike !== null &&
      PARENT_TO_INCREMENT_FUNC[deletedLike.parentType](
        deletedLike.parentId,
        "likes",
        -1
      );
    return deletedLike !== null;
  }
}

export default LikeCollection;
