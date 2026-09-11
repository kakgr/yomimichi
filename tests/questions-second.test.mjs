import assert from "node:assert/strict";
import test from "node:test";
import { secondKanjiQuestions } from "../data/questionsSecond.ts";

test("第二回漢字学習に今回追加した44語だけを収録する", () => {
  assert.equal(secondKanjiQuestions.length, 44);
  assert.deepEqual(secondKanjiQuestions[0], { kanji: "放免", readings: ["ほうめん"] });
  assert.deepEqual(secondKanjiQuestions.at(-1), { kanji: "冠詞", readings: ["かんし"] });

  const entries = new Map(secondKanjiQuestions.map(({ kanji, readings }) => [kanji, readings]));
  assert.equal(entries.has("一騎"), false);
  assert.equal(entries.has("顧問"), false);
  assert.deepEqual(entries.get("霊長類"), ["れいちょうるい"]);
  assert.deepEqual(entries.get("苗代"), ["なわしろ"]);
  assert.deepEqual(entries.get("栄華"), ["えいが"]);
  assert.deepEqual(entries.get("冗長"), ["じょうちょう"]);
});

test("第二回の掲載語に重複や空欄がない", () => {
  assert.equal(new Set(secondKanjiQuestions.map(({ kanji }) => kanji)).size, 44);
  for (const question of secondKanjiQuestions) {
    assert.ok(question.kanji.length > 0);
    assert.ok(question.readings.length > 0);
    assert.ok(question.readings.every((reading) => reading.length > 0));
  }
});
