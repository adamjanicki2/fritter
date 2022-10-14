// a lot of NLP preprocessing utils here
import { WordTokenizer, SentimentAnalyzer, PorterStemmer } from "natural";
import { removeStopwords } from "stopword";

// function to tokenize
const tokenize = new WordTokenizer().tokenize;
const calculateSentiment = new SentimentAnalyzer(
  "English",
  PorterStemmer,
  "afinn"
).getSentiment;

/**
 * Calculate sentiment score for a piece of text
 *
 * @param text to calculate sentiment score for
 * @returns sentiment score
 */
export const getSentimentScore = (text: string): number => {
  const textWithOnlyLetters = removeSpecialChars(text.toLowerCase());
  const tokens = tokenize(textWithOnlyLetters);
  const tokensWithoutStopwords = removeStopwords(tokens);
  return calculateSentiment(tokensWithoutStopwords);
};

/**
 * Remove numbers and special characters
 *
 * @param text text to remove from
 * @returns text with no numbers or special characters
 */
const removeSpecialChars = (text: string): string =>
  text.replace(/[^a-zA-Z\s]+/g, "");
