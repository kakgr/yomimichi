import assert from "node:assert/strict";
import { stat } from "node:fs/promises";
import test from "node:test";
import { ffjQuestions } from "../data/ffjQuestions.ts";

test("名称と画像がそろった46問を収録する", async () => {
  assert.equal(ffjQuestions.length, 46);
  assert.deepEqual(
    ffjQuestions.map(({ id }) => id),
    Array.from({ length: 49 }, (_, index) => index + 1).filter((id) => ![34, 44, 45].includes(id)),
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

test("Web用画像全体を4MB以下に抑える", async () => {
  const uniqueImages = new Set(ffjQuestions.flatMap(({ images }) => images));
  const sizes = await Promise.all(
    [...uniqueImages].map(async (image) => (await stat(new URL(`../public/${image}`, import.meta.url))).size),
  );

  assert.equal(uniqueImages.size, 46);
  assert.ok(sizes.reduce((total, size) => total + size, 0) <= 4_000_000);
});
