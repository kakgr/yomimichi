import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

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

test("漢字の読み練習画面をサーバー描画する", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  const html = await response.text();

  assert.match(html, /<html[^>]*lang="ja"/i);
  assert.match(html, /<title>漢字の読み練習 \| よみみち<\/title>/i);
  assert.match(html, /この漢字、なんて読む？/);
  assert.match(html, /読みをひらがなで入力/);
  assert.match(html, /問題\s*(?:<!-- -->)?1(?:<!-- -->)?\s*\/\s*(?:<!-- -->)?8/);
  assert.match(html, /autocomplete="off"/i);
  assert.match(html, /spellcheck="false"/i);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
});

test("問題データを専用ファイルで管理する", async () => {
  const source = await readFile(new URL("../data/questions.ts", import.meta.url), "utf8");
  assert.match(source, /export const questions/);
  assert.match(source, /readings:\s*\[/);
  assert.match(source, /漢字を追加・変更/);
});
