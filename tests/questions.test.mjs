import assert from "node:assert/strict";
import test from "node:test";
import { questions } from "../data/questions.ts";
import { selectRandomQuestions } from "../lib/quiz.mjs";

test("新しい漢字ドリルの22組・44語だけを収録する", () => {
  const expected = [
    ["師匠", "ししょう"], ["意匠", "いしょう"],
    ["匿名", "とくめい"], ["隠匿", "いんとく"],
    ["衝突", "しょうとつ"], ["折衝", "せっしょう"],
    ["閲覧", "えつらん"], ["校閲", "こうえつ"],
    ["欠乏", "けつぼう"], ["貧乏", "びんぼう"],
    ["甲乙", "こうおつ"], ["乙種", "おっしゅ"],
    ["了解", "りょうかい"], ["完了", "かんりょう"],
    ["企画", "きかく"], ["企業", "きぎょう"],
    ["募集", "ぼしゅう"], ["応募", "おうぼ"],
    ["卓越", "たくえつ"], ["円卓", "えんたく"],
    ["卑近", "ひきん"], ["卑屈", "ひくつ"],
    ["無双", "むそう"], ["双方", "そうほう"],
    ["又貸し", "またがし"], ["又の日", "またのひ"],
    ["哀願", "あいがん"], ["悲哀", "ひあい"],
    ["吉日", "きちじつ"], ["吉報", "きっぽう"],
    ["啓発", "けいはつ"], ["啓示", "けいじ"],
    ["哲学", "てつがく"], ["先哲", "せんてつ"],
    ["官吏", "かんり"], ["能吏", "のうり"],
    ["墾田", "こんでん"], ["開墾", "かいこん"],
    ["墜落", "ついらく"], ["失墜", "しっつい"],
    ["塗料", "とりょう"], ["塗装", "とそう"],
    ["白墨", "はくぼく"], ["墨守", "ぼくしゅ"],
  ];
  assert.equal(questions.length, 44);
  assert.deepEqual(questions.map(({ kanji, readings }) => [kanji, readings[0]]), expected);
  assert.equal(new Set(questions.map(({ kanji }) => kanji)).size, 44);
  assert.ok(questions.every(({ readings }) => readings.length > 0 && readings.every(Boolean)));
});

test("全44語から10問を重複なくランダム抽選する", () => {
  const first = selectRandomQuestions(questions, 10, () => 0);
  const second = selectRandomQuestions(questions, 10, () => 0.5);
  assert.equal(first.length, 10);
  assert.equal(new Set(first.map(({ kanji }) => kanji)).size, 10);
  assert.notDeepEqual(first, second);
});
