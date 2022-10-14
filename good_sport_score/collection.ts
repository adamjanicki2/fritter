import type { HydratedDocument, Types } from "mongoose";
import type { GoodSportScore } from "./model";
import GoodSportScoreModel from "./model";
import { getSentimentScore } from "./util";

class GoodSportScoreCollection {
  /**
   * Add a GoodSportScore to the collection
   *
   * @param {string} userId - The id of the user
   * @return {Promise<HydratedDocument<GoodSportScore>>} - The newly created GoodSportScore
   */
  static async addOne(
    userId: Types.ObjectId | string
  ): Promise<HydratedDocument<GoodSportScore>> {
    const GoodSportScore = new GoodSportScoreModel({
      userId,
      score: 0,
    });
    await GoodSportScore.save();
    return GoodSportScore.populate("userId");
  }

  /**
   * Get good sport score for user
   *
   * @param {string} userId - the id of the user
   *
   * @return {Promise<HydratedDocument<GoodSportScore>[]>}
   */
  static async findByUserId(
    userId: Types.ObjectId | string
  ): Promise<HydratedDocument<GoodSportScore>> {
    return GoodSportScoreModel.findOne({ userId }).populate("userId");
  }

  /**
   * Delete a GoodSportScore by id
   *
   * @param {string} goodSportScoreId - The id of GoodSportScore to delete
   * @return {Promise<Boolean>} - true if the GoodSportScore has been deleted, false otherwise
   */
  static async deleteOne(
    goodSportScoreId: Types.ObjectId | string
  ): Promise<boolean> {
    const deletedGoodSportScore = await GoodSportScoreModel.deleteOne({
      _id: goodSportScoreId,
    });
    return deletedGoodSportScore !== null;
  }

  /**
   * Updates a user's good sport score
   *
   * SOURCE: https://blog.logrocket.com/sentiment-analysis-node-js/
   * a few ideas were used from the above source, which include some preprocessing on the text such as
   * removing stop words, and getting rid of contracions
   *
   * @param userId the id of the user's score to update
   * @param newItem true if the item was just posted, false if just deleted
   * @param content the content of the item
   */
  static async updateOne(
    userId: Types.ObjectId | string,
    newItem: boolean,
    content: string
  ): Promise<HydratedDocument<GoodSportScore>> {
    const textScore = getSentimentScore(content);
    const score = await GoodSportScoreModel.findOne({ userId });
    score.score = newItem ? score.score + textScore : score.score - textScore;
    await score.save();
    return score;
  }
}

export default GoodSportScoreCollection;
