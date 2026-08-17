import assert from "node:assert/strict";
import test from "node:test";
import { isCorrectReading, normalizeReading } from "../lib/quiz.mjs";

test("カタカナ・空白・長音を読みの比較用に正規化する", () => {
  assert.equal(normalizeReading("  ガッコー　"), "がっこう");
});

test("複数の正解候補から読みを判定できる", () => {
  assert.equal(isCorrectReading("あす", ["あした", "あす"]), true);
  assert.equal(isCorrectReading("きのう", ["あした", "あす"]), false);
});
