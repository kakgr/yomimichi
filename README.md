# よみみち

出題された漢字の読みを入力して練習する、シンプルな学習サイトです。

## 漢字を変更する

出題内容は [`data/questions.ts`](data/questions.ts) だけで管理しています。

```ts
{ kanji: "明日", readings: ["あした", "あす"] },
```

- `kanji`: 画面に表示する漢字
- `readings`: 正解として受け付ける読み（複数指定できます）

配列の行を追加・削除・並べ替えてから `main` ブランチへ反映すると、GitHub Pages も自動で更新されます。

## ローカルで確認する

```bash
npm install
npm run dev
```

表示された URL をブラウザで開いてください。

## GitHub Pages で公開する

1. GitHub のリポジトリ画面で **Settings → Pages** を開く
2. **Source** を **GitHub Actions** にする
3. `main` ブランチへ push する

`.github/workflows/deploy-pages.yml` がテスト、静的ファイル生成、公開を自動で行います。
