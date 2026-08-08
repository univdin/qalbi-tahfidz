export type Verdict = "lancar" | "cukup" | "perlu_ulang";

export interface ScoreResult {
  score: number;
  verdict: Verdict;
}

const DIACRITICS = /[\u064B-\u065F\u0670\u06D6-\u06ED\u0640]/g;

export function stripTashkeel(text: string): string {
  return text
    .replace(DIACRITICS, "")
    .replace(/[^\u0621-\u063A\u0641-\u064A\u0609\u060A\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function wordOverlapScore(transcribed: string, expected: string): number {
  const transcribedWords = stripTashkeel(transcribed).split(" ");
  const expectedWords = stripTashkeel(expected).split(" ");

  if (expectedWords.length === 0) return 0;
  if (transcribedWords.length === 0) return 0;

  const expectedSet = new Set(expectedWords);
  let matched = 0;
  for (const word of transcribedWords) {
    if (word && expectedSet.has(word)) matched += 1;
  }

  const precision = matched / transcribedWords.length;
  const recall = matched / expectedWords.length;
  if (precision + recall === 0) return 0;
  return Math.round((2 * ((precision * recall) / (precision + recall))) * 100);
}

export function scoreRecitation(transcribed: string, expected: string): ScoreResult {
  const score = wordOverlapScore(transcribed, expected);
  const verdict: Verdict = score >= 80 ? "lancar" : score >= 60 ? "cukup" : "perlu_ulang";
  return { score, verdict };
}
