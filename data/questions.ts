export type Question = {
  kanji: string;
  readings: readonly string[];
};

/**
 * 漢字を追加・変更するときは、この配列だけを編集してください。
 * 同じ漢字に複数の正しい読みがある場合は readings に並べます。
 */
export const questions: readonly Question[] = [
  { kanji: "朝", readings: ["あさ"] },
  { kanji: "緑", readings: ["みどり"] },
  { kanji: "湖", readings: ["みずうみ"] },
  { kanji: "星", readings: ["ほし"] },
  { kanji: "暖", readings: ["あたたかい", "あたたか"] },
  { kanji: "景色", readings: ["けしき"] },
  { kanji: "明日", readings: ["あした", "あす"] },
  { kanji: "木漏れ日", readings: ["こもれび"] },
];
