import { cp, mkdir, rm, writeFile } from "node:fs/promises";

const projectRoot = new URL("../", import.meta.url);
const clientRoot = new URL("../dist/client/", import.meta.url);
const pagesRoot = new URL("../dist/pages/", import.meta.url);
const workerUrl = new URL("../dist/server/index.js", import.meta.url);

await rm(pagesRoot, { recursive: true, force: true });
await mkdir(pagesRoot, { recursive: true });
await cp(clientRoot, pagesRoot, { recursive: true });

const { default: worker } = await import(workerUrl.href);
const response = await worker.fetch(
  new Request("http://localhost/", { headers: { accept: "text/html" } }),
  { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
  { waitUntil() {}, passThroughOnException() {} },
);

if (!response.ok) {
  throw new Error(`ページ生成に失敗しました: ${response.status}`);
}

const html = (await response.text())
  .replaceAll("/_next/", "./_next/")
  .replaceAll("/favicon.svg", "./favicon.svg");

await Promise.all([
  writeFile(new URL("index.html", pagesRoot), html),
  writeFile(new URL(".nojekyll", pagesRoot), ""),
]);

console.log(`GitHub Pages 用ファイルを生成しました: ${new URL("dist/pages/", projectRoot).pathname}`);
