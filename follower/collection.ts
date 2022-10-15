import type { HydratedDocument, Types } from "mongoose";
import type { Follower } from "./model";
import FollowerModel from "./model";

type FollowStatistics = {
  followers: number;
  followees: number;
};
class FollowerCollection {
  /**
   * Add a Follower to the collection
   *
   * @param {string} followee - the id of the followee
   * @return {Promise<HydratedDocument<Follower>>} - The newly created Follower
   */
  static async addOne(
    follower: Types.ObjectId | string,
    followee: Types.ObjectId | string
  ): Promise<HydratedDocument<Follower>> {
    const Follower = new FollowerModel({
      follower,
      followee,
    });
    await Follower.save();
    return (await Follower.populate("follower")).populate("followee");
  }
  /**
   * Get following statistics for a users
   *
   * @param {string} userId - the id of the user
   *
   * @return {Promise<FollowStatistics>}
   */
  static async getFollowerStatistics(
    userId: Types.ObjectId | string
  ): Promise<FollowStatistics> {
    const followers = await FollowerModel.find({ follower: userId }).count();
    const followees = await FollowerModel.find({ followee: userId }).count();
    return { followers, followees };
  }

  /**
   * Check if follower already follows followee
   *
   * @param {string} follower - the id of the follower
   * @param {string} followee - the id of the followee
   *
   * @return {Promise<boolean>}
   */
  static async doesFollow(
    follower: Types.ObjectId | string,
    followee: Types.ObjectId | string
  ): Promise<boolean> {
    return (await FollowerModel.findOne({ follower, followee })) !== null;
  }

  /**
   * Delete a Follower by id
   *
   * @param {string} followee - The id of followee to unfollow
   * @return {Promise<Boolean>} - true if the Follower has been deleted, false otherwise
   */
  static async deleteOne(followee: Types.ObjectId | string): Promise<boolean> {
    const deletedFollower = await FollowerModel.deleteOne({
      followee,
    });
    return deletedFollower !== null;
  }

  /**
   * Delete entries for user
   *
   * @param userId the id of the user to delete entries for
   * @returns true if success else false
   */
  static async deleteMany(userId: Types.ObjectId | string): Promise<boolean> {
    const deleted = await FollowerModel.deleteMany({ follower: userId });
    return deleted !== null;
  }
}

export default FollowerCollection;
