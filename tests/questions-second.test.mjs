import assert from "node:assert/strict";
import test from "node:test";
import { secondKanjiQuestions } from "../data/questionsSecond.ts";
import { selectRandomQuestions } from "../lib/quiz.mjs";

test("第二回漢字学習に従来の44語と新しい二字熟語40語を収録する", () => {
  assert.equal(secondKanjiQuestions.length, 84);
  assert.deepEqual(secondKanjiQuestions[0], { kanji: "放免", readings: ["ほうめん"] });
  assert.deepEqual(secondKanjiQuestions[43], { kanji: "冠詞", readings: ["かんし"] });

  const entries = new Map(secondKanjiQuestions.map(({ kanji, readings }) => [kanji, readings]));
  assert.equal(entries.has("一騎"), false);
  assert.equal(entries.has("顧問"), false);
  assert.deepEqual(entries.get("霊長類"), ["れいちょうるい"]);
  assert.deepEqual(entries.get("苗代"), ["なわしろ"]);
  assert.deepEqual(entries.get("栄華"), ["えいが"]);
  assert.deepEqual(entries.get("冗長"), ["じょうちょう"]);
});

test("2枚の画像から確認された二字熟語40語と読みをすべて収録する", () => {
  const expected = new Map([
    ["酵母", "こうぼ"], ["酵素", "こうそ"], ["陶酔", "とうすい"], ["心酔", "しんすい"],
    ["錯誤", "さくご"], ["交錯", "こうさく"], ["半鐘", "はんしょう"], ["警鐘", "けいしょう"],
    ["錠剤", "じょうざい"], ["施錠", "せじょう"], ["鍛錬", "たんれん"], ["鋳造", "ちゅうぞう"],
    ["鋳物", "いもの"], ["鎮静", "ちんせい"], ["重鎮", "じゅうちん"], ["精錬", "せいれん"],
    ["餓死", "がし"], ["餓鬼", "がき"], ["飽和", "ほうわ"], ["飽食", "ほうしょく"],
    ["詠嘆", "えいたん"], ["朗詠", "ろうえい"], ["該当", "がいとう"], ["該博", "がいはく"],
    ["諮問", "しもん"], ["譲渡", "じょうと"], ["譲歩", "じょうほ"], ["請求", "せいきゅう"],
    ["申請", "しんせい"], ["委託", "いたく"], ["承諾", "しょうだく"], ["諾否", "だくひ"],
    ["訂正", "ていせい"], ["改訂", "かいてい"], ["謀略", "ぼうりゃく"], ["無謀", "むぼう"],
    ["誘惑", "ゆうわく"], ["勧誘", "かんゆう"], ["盗賊", "とうぞく"], ["賊軍", "ぞくぐん"],
  ]);
  assert.equal(expected.size, 40);
  assert.deepEqual(
    new Map(secondKanjiQuestions.slice(44).map(({ kanji, readings }) => [kanji, readings[0]])),
    expected,
  );
  assert.ok(secondKanjiQuestions.slice(44).every(({ kanji }) => [...kanji].length === 2));
});

test("第二回の掲載語に重複や空欄がない", () => {
  assert.equal(new Set(secondKanjiQuestions.map(({ kanji }) => kanji)).size, 84);
  for (const question of secondKanjiQuestions) {
    assert.ok(question.kanji.length > 0);
    assert.ok(question.readings.length > 0);
    assert.ok(question.readings.every((reading) => reading.length > 0));
  }
});

test("第二回の全84語から10問を重複なくランダム抽選する", () => {
  const first = selectRandomQuestions(secondKanjiQuestions, 10, () => 0);
  const second = selectRandomQuestions(secondKanjiQuestions, 10, () => 0.5);
  assert.equal(first.length, 10);
  assert.equal(new Set(first.map(({ kanji }) => kanji)).size, 10);
  assert.notDeepEqual(first, second);
  assert.ok(first.some(({ kanji }) => secondKanjiQuestions.slice(0, 44).some((entry) => entry.kanji === kanji)));
  assert.ok(second.some(({ kanji }) => secondKanjiQuestions.slice(44).some((entry) => entry.kanji === kanji)));
});
