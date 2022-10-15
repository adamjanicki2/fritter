// a lot of NLP preprocessing utils here
import { WordTokenizer, SentimentAnalyzer, PorterStemmer } from "natural";
import { removeStopwords } from "stopword";

// function to tokenize
const tokenizer = new WordTokenizer();
const analyzer = new SentimentAnalyzer("English", PorterStemmer, "afinn");

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
