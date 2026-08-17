import assert from "node:assert/strict";
import test from "node:test";
import { isCorrectReading, normalizeReading, shuffleQuestions } from "../lib/quiz.mjs";

test("カタカナ・空白・長音を読みの比較用に正規化する", () => {
  assert.equal(normalizeReading("  ガッコー　"), "がっこう");
});

test("複数の正解候補から読みを判定できる", () => {
  assert.equal(isCorrectReading("あす", ["あした", "あす"]), true);
  assert.equal(isCorrectReading("きのう", ["あした", "あす"]), false);
});

test("元の問題を変更せずランダムな順序を作る", () => {
  const original = ["一", "二", "三", "四"];
  const shuffled = shuffleQuestions(original, () => 0);

  assert.deepEqual(shuffled, ["二", "三", "四", "一"]);
  assert.deepEqual(original, ["一", "二", "三", "四"]);
  assert.notEqual(shuffled, original);
});
