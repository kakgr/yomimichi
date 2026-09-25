import type { HyakuninPoem } from "../data/hyakunin";
import { shuffleQuestions } from "./quiz.mjs";

export function makeLowerVerseChoices(
  poems: readonly HyakuninPoem[],
  correct: HyakuninPoem,
  random: () => number = Math.random,
): HyakuninPoem[] {
  const distractors = shuffleQuestions(
    poems.filter((poem) => poem.number !== correct.number),
    random,
  ).slice(0, 3);
  return shuffleQuestions([correct, ...distractors], random);
}

export type HyakuninQuestionKind = "lower" | "wordplay" | "pillow" | "important" | "category" | "author" | "sixPoets";
export type HyakuninOption = { id: string; label: string; reading?: string };
export type HyakuninQuestion = {
  kind: HyakuninQuestionKind;
  prompt: string;
  stem?: string;
  stemReading?: string;
  term?: string;
  options: HyakuninOption[];
  correctId: string;
  correctLabel: string;
};

const SIX_POET_AUTHORS = new Set(["喜撰法師", "小野小町", "僧正遍昭", "在原業平朝臣"]);
const CATEGORY_LABELS: Record<string, string> = {
  春: "春の歌", 秋: "秋の歌", 恋: "恋の歌", 旅: "旅の歌", 離: "離別の歌", 雑: "雑歌",
};

function poemText(poem: HyakuninPoem): string {
  return `${poem.upperKanji}\n${poem.lowerKanji}`;
}

function optionsFrom(
  correct: HyakuninOption,
  others: readonly HyakuninOption[],
  random: () => number,
): HyakuninOption[] {
  const distractors = shuffleQuestions(others.filter((item) => item.id !== correct.id), random).slice(0, 3);
  if (distractors.length !== 3) throw new Error("4択を作るための選択肢が不足しています");
  return shuffleQuestions([correct, ...distractors], random);
}

/** 掛詞・枕詞・重要語句・作者を中心に、計10問出題する。 */
export function buildHyakuninQuiz(
  poems: readonly HyakuninPoem[],
  random: () => number = Math.random,
): HyakuninQuestion[] {
  const pick = <T>(items: readonly T[], count: number): T[] => {
    if (items.length < count) throw new Error("出題に必要な問題が不足しています");
    return shuffleQuestions(items, random).slice(0, count);
  };
  const allCategories = [...new Set(poems.map(({ category }) => category))];
  const allAuthors = poems.map(({ author }) => author);
  const wordplays = poems.flatMap((poem) => poem.wordplay
    .filter(({ kind }) => kind === "掛詞")
    .map((wordplay) => ({ poem, wordplay })));
  const pillows = poems.flatMap((poem) => poem.wordplay
    .filter(({ kind }) => kind === "枕詞")
    .map((wordplay) => ({ poem, wordplay })));
  const importantTerms = poems.flatMap((poem) => poem.notes.flatMap((note) => {
    const separator = note.indexOf("：");
    if (separator < 0) return [];
    const term = note.slice(0, separator).replace(/（[^）]*）/g, "");
    if (!poemText(poem).includes(term)) return [];
    return [{ poem, term, explanation: note.slice(separator + 1) }];
  }));
  const sixPoetPoems = poems.filter(({ author }) => SIX_POET_AUTHORS.has(author));
  const otherAuthors = poems.filter(({ author }) => !SIX_POET_AUTHORS.has(author));

  const lower = pick(poems, 1).map((poem): HyakuninQuestion => {
    const correctId = String(poem.number);
    return {
      kind: "lower", prompt: "この上の句に続く下の句は？",
      stem: poem.upperKanji, stemReading: poem.upperKana,
      options: makeLowerVerseChoices(poems, poem, random).map((choice) => ({
        id: String(choice.number), label: choice.lowerKanji, reading: choice.lowerKana,
      })),
      correctId, correctLabel: poem.lowerKanji,
    };
  });

  const wordplayQuestions = pick(wordplays, 2).map(({ poem, wordplay }): HyakuninQuestion => {
    const correctId = wordplay.explanation;
    const meanings = [...new Set(wordplays.map(({ wordplay: item }) => item.explanation))];
    return {
      kind: "wordplay", prompt: `この句の「${wordplay.term}」という掛詞の意味は？`,
      stem: poemText(poem), term: wordplay.term,
      options: optionsFrom(
        { id: correctId, label: correctId },
        meanings.map((meaning) => ({ id: meaning, label: meaning })), random,
      ),
      correctId, correctLabel: correctId,
    };
  });

  const pillow = pick(pillows, 1).map(({ poem, wordplay }): HyakuninQuestion => ({
    kind: "pillow", prompt: `この句の「${wordplay.term}」は、何にかかる枕詞？`,
    stem: poemText(poem), term: wordplay.term,
    options: optionsFrom(
      { id: wordplay.target, label: wordplay.target },
      ["神", "花", "風", "山"].map((item) => ({ id: item, label: item })), random,
    ),
    correctId: wordplay.target, correctLabel: wordplay.target,
  }));

  const important = pick(importantTerms, 2).map(({ poem, term, explanation }): HyakuninQuestion => ({
    kind: "important", prompt: `この句の「${term}」の意味は？`,
    stem: poemText(poem), term,
    options: optionsFrom(
      { id: explanation, label: explanation },
      importantTerms.map((item) => ({ id: item.explanation, label: item.explanation })), random,
    ),
    correctId: explanation, correctLabel: explanation,
  }));

  const category = pick(poems, 1).map((poem): HyakuninQuestion => ({
    kind: "category", prompt: "この句の種類は？", stem: poemText(poem),
    options: optionsFrom(
      { id: poem.category, label: CATEGORY_LABELS[poem.category] },
      allCategories.map((item) => ({ id: item, label: CATEGORY_LABELS[item] })), random,
    ),
    correctId: poem.category, correctLabel: CATEGORY_LABELS[poem.category],
  }));

  const author = pick(poems, 2).map((poem): HyakuninQuestion => ({
    kind: "author", prompt: "この句の作者は？", stem: poemText(poem),
    options: optionsFrom(
      { id: poem.author, label: poem.author },
      allAuthors.map((item) => ({ id: item, label: item })), random,
    ),
    correctId: poem.author, correctLabel: poem.author,
  }));

  const sixPoets = pick(sixPoetPoems, 1).map((poem): HyakuninQuestion => {
    const correctId = poem.author;
    return {
      kind: "sixPoets", prompt: "次の人物のうち、六歌仙に含まれるのは誰？",
      options: optionsFrom(
        { id: correctId, label: correctId },
        otherAuthors.map((item) => ({ id: item.author, label: item.author })), random,
      ),
      correctId, correctLabel: correctId,
    };
  });

  return shuffleQuestions([...lower, ...wordplayQuestions, ...pillow, ...important, ...category, ...author, ...sixPoets], random);
}
