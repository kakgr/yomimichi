import assert from "node:assert/strict";
import { stat } from "node:fs/promises";
import test from "node:test";
import { ffjQuestions } from "../data/ffjQuestions.ts";

test("更新版の名称と画像がそろった61問を収録する", async () => {
  assert.equal(ffjQuestions.length, 61);
  assert.deepEqual(
    ffjQuestions.map(({ id }) => id),
    Array.from({ length: 64 }, (_, index) => index + 1).filter((id) => ![34, 44, 45].includes(id)),
  );

  for (const question of ffjQuestions) {
    assert.ok(question.name.length > 0, `問題${question.id}の名前がありません`);
    assert.ok(question.images.length > 0, `問題${question.id}の画像がありません`);
    assert.ok(question.answers.includes(question.name));
    for (const image of question.images) {
      assert.match(image, /^\.\/questions\/ffj\/[a-z0-9-]+\.webp$/);
      const imageStat = await stat(new URL(`../public/${image}`, import.meta.url));
      assert.ok(imageStat.size <= 200_000, `${image}が200KBを超えています`);
    }
  }
});

test("Web用画像全体を5MB以下に抑える", async () => {
  const uniqueImages = new Set(ffjQuestions.flatMap(({ images }) => images));
  const sizes = await Promise.all(
    [...uniqueImages].map(async (image) => (await stat(new URL(`../public/${image}`, import.meta.url))).size),
  );

  assert.equal(uniqueImages.size, 62);
  assert.ok(sizes.reduce((total, size) => total + size, 0) <= 5_000_000);
});

test("更新版で追加された植物・道具を収録する", () => {
  const byName = new Map(ffjQuestions.map((question) => [question.name, question]));
  const additions = [
    "ムクゲ",
    "レンギョウ",
    "アベリア",
    "ラクウショウ",
    "クロマツ",
    "ユリノキ",
    "マサキ",
    "クチナシ",
    "ヒマラヤスギ",
    "イヌマキ",
    "ローズマリー",
    "シラカシ",
    "インターロッキングブロック",
    "耐火レンガ",
    "普通レンガ",
  ];

  for (const name of additions) assert.ok(byName.has(name), `${name}がありません`);
  assert.equal(byName.get("キンモクセイ").images.length, 2);
});
