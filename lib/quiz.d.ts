export function normalizeReading(value: string): string;
export function isCorrectReading(answer: string, readings: readonly string[]): boolean;
export function shuffleQuestions<T>(values: readonly T[], random?: () => number): T[];
