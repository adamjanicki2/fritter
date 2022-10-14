import { PARENT_TO_INCREMENT_FUNC } from "../common/util";
import type { HydratedDocument, Types } from "mongoose";
import type { Flag } from "./model";
import FlagModel from "./model";

class FlagCollection {
  /**
   * Add a Flag to the collection
   *
   * @param {string} userId - The id of the user
   * @param {string} parentId - the id of the parent
   * @param {string} parentType - the type of parent
   * @return {Promise<HydratedDocument<Flag>>} - The newly created Flag
   */
  static async addOne(
    userId: Types.ObjectId | string,
    parentId: Types.ObjectId | string,
    parentType: "comment" | "freet"
  ): Promise<HydratedDocument<Flag>> {
    const flag = new FlagModel({
      userId,
      parentId,
      parentType,
    });
    PARENT_TO_INCREMENT_FUNC[parentType](parentId, "flags", 1);
    await flag.save();
    return flag.populate("userId");
  }

  /**
   * determine if a user has Flagged an item
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
    return (await FlagModel.findOne({ userId, parentId })) !== null;
  }

  /**
   * Delete a Flag by id
   *
   * @param {string} flagId - The id of Flag to delete
   * @return {Promise<Boolean>} - true if the Flag has been deleted, false otherwise
   */
  static async deleteOne(flagId: Types.ObjectId | string): Promise<boolean> {
    const deletedFlag = await FlagModel.findOneAndDelete({
      _id: flagId,
    });
    deletedFlag !== null &&
      PARENT_TO_INCREMENT_FUNC[deletedFlag.parentType](
        deletedFlag.parentId,
        "flags",
        -1
      );
    return deletedFlag !== null;
  }
}

export default FlagCollection;
