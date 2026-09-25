import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { hyakuninPoems } from "../data/hyakunin.ts";
import { makeLowerVerseChoices, buildHyakuninQuiz } from "../lib/hyakuninQuiz.ts";

test("百人一首の第8〜18番に上の句・下の句と学習情報がそろう", () => {
  assert.deepEqual(hyakuninPoems.map(({ number }) => number), Array.from({ length: 11 }, (_, index) => index + 8));
  for (const poem of hyakuninPoems) {
    assert.ok(poem.upperKanji && poem.lowerKanji && poem.upperKana && poem.lowerKana);
    assert.ok(poem.author && poem.authorReading && poem.translation);
    assert.ok(poem.notes.length > 0);
  }
  assert.equal(hyakuninPoems[0].lowerKanji, "世をうぢ山と　人はいふなり");
  assert.equal(hyakuninPoems.at(-1).lowerKanji, "夢の通ひ路　人目よくらむ");
});

test("4択は正解1首と重複しない誤答3首で作る", () => {
  for (const poem of hyakuninPoems) {
    const options = makeLowerVerseChoices(hyakuninPoems, poem, () => 0.42);
    assert.equal(options.length, 4);
    assert.equal(new Set(options.map(({ number }) => number)).size, 4);
    assert.equal(options.filter(({ number }) => number === poem.number).length, 1);
  }
});

test("掛詞・枕詞・重要語句・作者を中心に10問出し、選択肢は重複しない4択", () => {
  const questions = buildHyakuninQuiz(hyakuninPoems, () => 0.42);
  assert.equal(questions.length, 10);
  const expectedCounts = { lower: 1, wordplay: 2, pillow: 1, important: 2, category: 1, author: 2, sixPoets: 1 };
  for (const [kind, count] of Object.entries(expectedCounts)) {
    assert.equal(questions.filter((question) => question.kind === kind).length, count);
  }
  for (const question of questions) {
    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options.map(({ id }) => id)).size, 4);
    assert.equal(question.options.filter(({ id }) => id === question.correctId).length, 1);
    assert.ok(question.prompt && question.correctLabel);
  }
});

test("掛詞と枕詞を区別し、重要語句は句にある語を問う", () => {
  const questions = buildHyakuninQuiz(hyakuninPoems, () => 0.23);
  for (const question of questions.filter(({ kind }) => kind === "wordplay")) {
    assert.ok(question.term);
    assert.match(question.correctLabel, /／/);
    assert.doesNotMatch(question.term, /ちはやぶる/);
  }
  const pillow = questions.find(({ kind }) => kind === "pillow");
  assert.match(pillow.prompt, /ちはやぶる/);
  assert.equal(pillow.correctLabel, "神");
  for (const question of questions.filter(({ kind }) => kind === "important")) {
    assert.ok(question.stem.includes(question.term));
    assert.ok(question.correctLabel);
  }
});

test("六歌仙の設問は人物を選び、正解は一人だけ", () => {
  const sixPoets = new Set(["喜撰法師", "小野小町", "僧正遍昭", "在原業平朝臣"]);
  const question = buildHyakuninQuiz(hyakuninPoems, () => 0.23).find(({ kind }) => kind === "sixPoets");
  assert.match(question.prompt, /人物/);
  assert.equal(question.options.filter(({ id }) => sixPoets.has(id)).length, 1);
  assert.ok(sixPoets.has(question.correctId));
});

test("出題を繰り返しても4択の正解は常に一つ", () => {
  for (let seed = 1; seed <= 50; seed += 1) {
    let state = seed;
    const random = () => {
      state = (state * 16807) % 2147483647;
      return state / 2147483647;
    };
    for (const question of buildHyakuninQuiz(hyakuninPoems, random)) {
      assert.equal(new Set(question.options.map(({ id }) => id)).size, 4);
      assert.equal(question.options.filter(({ id }) => id === question.correctId).length, 1);
    }
  }
});

test("クイズの問題文は大きく、句と読みは濃い中位の文字で表示する", async () => {
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  assert.match(css, /\.quiz-verse > p:first-child\s*\{[^}]*font-size:\s*clamp\(22px, 4vw, 26px\)/s);
  assert.match(css, /\.quiz-verse \.poem-kanji\s*\{[^}]*color:\s*var\(--ink\)[^}]*font:\s*600 clamp\(18px, 3vw, 20px\)/s);
  assert.match(css, /\.quiz-verse \.poem-kana\s*\{[^}]*color:\s*var\(--ink\)/s);
});
