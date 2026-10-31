export type Question = {
  kanji: string;
  readings: readonly string[];
};

/**
 * 漢字を追加・変更するときは、この配列だけを編集してください。
 * 同じ言葉に複数の正しい読みがある場合は readings に並べます。
 * 現在は IMG_3441.HEIC・IMG_3442.HEIC の各番号にある2語を収録しています。
 */
export const questions: readonly Question[] = [
  // 1〜11
  { kanji: "師匠", readings: ["ししょう"] },
  { kanji: "意匠", readings: ["いしょう"] },
  { kanji: "匿名", readings: ["とくめい"] },
  { kanji: "隠匿", readings: ["いんとく"] },
  { kanji: "衝突", readings: ["しょうとつ"] },
  { kanji: "折衝", readings: ["せっしょう"] },
  { kanji: "閲覧", readings: ["えつらん"] },
  { kanji: "校閲", readings: ["こうえつ"] },
  { kanji: "欠乏", readings: ["けつぼう"] },
  { kanji: "貧乏", readings: ["びんぼう"] },
  { kanji: "甲乙", readings: ["こうおつ"] },
  { kanji: "乙種", readings: ["おっしゅ"] },
  { kanji: "了解", readings: ["りょうかい"] },
  { kanji: "完了", readings: ["かんりょう"] },
  { kanji: "企画", readings: ["きかく"] },
  { kanji: "企業", readings: ["きぎょう"] },
  { kanji: "募集", readings: ["ぼしゅう"] },
  { kanji: "応募", readings: ["おうぼ"] },
  { kanji: "卓越", readings: ["たくえつ"] },
  { kanji: "円卓", readings: ["えんたく"] },
  { kanji: "卑近", readings: ["ひきん"] },
  { kanji: "卑屈", readings: ["ひくつ"] },
  // 12〜22（13番の「又貸し」「又の日」も含む）
  { kanji: "無双", readings: ["むそう"] },
  { kanji: "双方", readings: ["そうほう"] },
  { kanji: "又貸し", readings: ["またがし"] },
  { kanji: "又の日", readings: ["またのひ"] },
  { kanji: "哀願", readings: ["あいがん"] },
  { kanji: "悲哀", readings: ["ひあい"] },
  { kanji: "吉日", readings: ["きちじつ"] },
  { kanji: "吉報", readings: ["きっぽう"] },
  { kanji: "啓発", readings: ["けいはつ"] },
  { kanji: "啓示", readings: ["けいじ"] },
  { kanji: "哲学", readings: ["てつがく"] },
  { kanji: "先哲", readings: ["せんてつ"] },
  { kanji: "官吏", readings: ["かんり"] },
  { kanji: "能吏", readings: ["のうり"] },
  { kanji: "墾田", readings: ["こんでん"] },
  { kanji: "開墾", readings: ["かいこん"] },
  { kanji: "墜落", readings: ["ついらく"] },
  { kanji: "失墜", readings: ["しっつい"] },
  { kanji: "塗料", readings: ["とりょう"] },
  { kanji: "塗装", readings: ["とそう"] },
  { kanji: "白墨", readings: ["はくぼく"] },
  { kanji: "墨守", readings: ["ぼくしゅ"] },
];
