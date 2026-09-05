import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { questions } from "../data/questions.ts";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("学習内容の選択画面をサーバー描画する", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  const html = await response.text();

  assert.match(html, /<html[^>]*lang="ja"/i);
  assert.match(html, /<title>学習ドリル \| よみみち<\/title>/i);
  assert.match(html, /今日は何を練習する？/);
  assert.match(html, /漢字の読み/);
  assert.match(html, /第二回漢字学習/);
  assert.match(html, /全43問からランダムに10問/);
  assert.match(html, /植物・道具の名前/);
  assert.match(html, /全256問からランダムに10問/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
});

test("学習を選ぶと漢字練習を開始し、終了後に選択画面へ戻れる", async () => {
  const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");

  assert.match(page, /type Screen = "menu" \| "practice"/);
  assert.match(page, /screen === "menu"/);
  assert.match(page, /function startKanjiPractice\(\)/);
  assert.match(page, /onClick={startKanjiPractice}/);
  assert.match(page, /学習を選び直す/);
  assert.match(page, /autoComplete="off"/);
  assert.match(page, /spellCheck={false}/);
});

test("ドリル第25回〜第30回の掲載語を収録する", () => {
  assert.equal(questions.length, 256);
  const entries = new Map(questions.map(({ kanji, readings }) => [kanji, readings]));
  assert.deepEqual(entries.get("佳作"), ["かさく"]);
  assert.deepEqual(entries.get("泌尿器"), ["ひにょうき"]);
  assert.deepEqual(entries.get("擦過傷"), ["さっかしょう"]);
  assert.deepEqual(entries.get("湖畔"), ["こはん"]);
  assert.deepEqual(entries.get("地軸"), ["ちじく"]);
});

test("問題データを専用ファイルで管理する", async () => {
  const source = await readFile(new URL("../data/questions.ts", import.meta.url), "utf8");
  assert.match(source, /export const questions/);
  assert.match(source, /readings:\s*\[/);
  assert.match(source, /漢字を追加・変更/);
});

test("答えを確認して問題を飛ばせる", async () => {
  const source = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  assert.match(source, /feedback === "revealed"/);
  assert.match(source, /答え：/);
  assert.match(source, /次の問題へ/);
});

test("正解表示とモバイル入力時の見やすさを強化する", async () => {
  const [page, css] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);

  assert.match(page, /is-correct/);
  assert.match(page, /scrollIntoView/);
  assert.match(css, /\.prompt-block\.is-correct::after/);
  assert.match(css, /\.skip-button\s*\{[^}]*min-height:\s*54px/s);
  assert.match(css, /\.input-compact/);
});

test("答えるボタンへフォーカスが移っても縮小表示を維持する", async () => {
  const [page, css] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);

  assert.match(page, /isCompactInput/);
  assert.match(page, /input-compact-shell/);
  assert.match(page, /input-compact/);
  assert.match(css, /\.input-compact-shell/);
  assert.match(css, /\.input-compact\s*\{/);
  assert.doesNotMatch(css, /:has\(input:focus\)/);
});

test("入力時と正解時にそれぞれ音を鳴らす", async () => {
  const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");

  assert.match(page, /onChange={[\s\S]*playInputSound\(\)/);
  assert.match(page, /advancingRef\.current = true;\s*playCorrectSound\(\)/);
});

test("1回の練習は全256問からランダムに選んだ10問にする", async () => {
  const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");

  assert.match(page, /SESSION_QUESTION_COUNT = 10/);
  assert.match(page, /kanjiPracticeQuestions/);
  assert.match(page, /selectRandomQuestions\(source, SESSION_QUESTION_COUNT\)/);
});

test("第二回漢字学習を第一回と分けて開始できる", async () => {
  const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");

  assert.match(page, /secondKanjiQuestions/);
  assert.match(page, /function startSecondKanjiPractice\(\)/);
  assert.match(page, /resetPractice\("kanji-second"\)/);
  assert.match(page, /onClick={startSecondKanjiPractice}/);
});

test("画像問題も46問から10問を選び、次の画像だけ先読みする", async () => {
  const [page, css] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);

  assert.match(page, /ffjQuestions/);
  assert.match(page, /startImagePractice/);
  assert.match(page, /この植物・道具の名前は？/);
  assert.match(page, /new Image\(\)/);
  assert.match(page, /loading="eager"/);
  assert.match(page, /question.kind === "kanji" \? "正解！ 次の漢字へ" : "正解！ 次の問題へ"/);
  assert.match(page, /question.kind === "kanji" \? "ぜんぶ読めました！" : "ぜんぶ答えられました！"/);
  assert.match(css, /\.question-images\s*\{[^}]*height:\s*auto/s);
  assert.match(css, /\.question-image-frame\s+img\s*\{[^}]*max-width:\s*100%[^}]*height:\s*auto/s);
  assert.doesNotMatch(css, /\.input-compact\s+\.question-images\s*\{[^}]*height:/s);
});
