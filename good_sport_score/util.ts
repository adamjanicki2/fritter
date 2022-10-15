// a lot of NLP preprocessing utils here
import { HydratedDocument, Types } from "mongoose";
import { WordTokenizer, SentimentAnalyzer, PorterStemmer } from "natural";
import { removeStopwords } from "stopword";
import { GoodSportScore, PopulatedGoodSportScore } from "./model";

// function to tokenize
const tokenizer = new WordTokenizer();
const analyzer = new SentimentAnalyzer("English", PorterStemmer, "afinn");

type ScoreResponse = {
  score: number;
  userId: Types.ObjectId | string;
};

/**
 * Get the score response
 *
 * @param score score document
 * @returns the formatted score
 */
export const formatScoreResponse = (
  score: HydratedDocument<GoodSportScore>
): ScoreResponse => {
  const { _id: userId } = score.userId;
  return {
    userId,
    score: score.score,
  };
};

/**
 * Calculate sentiment score for a piece of text
 *
 * @param text to calculate sentiment score for
 * @returns sentiment score
 */
export const getSentimentScore = (text: string): number => {
  const textWithOnlyLetters = removeSpecialChars(text.toLowerCase());
  const tokens = tokenizer.tokenize(textWithOnlyLetters);
  const tokensWithoutStopwords = removeStopwords(tokens);
  return analyzer.getSentiment(tokensWithoutStopwords);
};

/**
 * Remove numbers and special characters
 *
 * @param text text to remove from
 * @returns text with no numbers or special characters
 */
const removeSpecialChars = (text: string): string =>
  text.replace(/[^a-zA-Z\s]+/g, "");
