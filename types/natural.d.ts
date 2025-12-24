declare module 'natural' {
  export const TfIdf: any;
  export function tokenizeAndStem(text: string): string[];
  export const PorterStemmer: any;
  export const WordTokenizer: any;
  export const SentimentAnalyzer: any;
  export const stem: any;
  export const tokenize: any;
  export const removeStopwords: any;
  export const getNGrams: any;
  export const getBigrams: any;
  export const getTrigrams: any;
  export const JaroWinklerDistance: any;
  export const LevenshteinDistance: any;
  export const DiceCoefficient: any;
}