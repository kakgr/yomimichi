import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

test("GitHub Pages用の静的ファイルを生成する", async () => {
  const html = await readFile(new URL("../dist/pages/index.html", import.meta.url), "utf8");
  assert.match(html, /href="\.\/_next\/static\/css\//);
  assert.match(html, /src="\.\/_next\/static\/chunks\//);
  assert.doesNotMatch(html, /(?:href|src)="\/_next\//);
  await access(new URL("../dist/pages/.nojekyll", import.meta.url));
});
