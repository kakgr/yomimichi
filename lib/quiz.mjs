const KATAKANA_START = 0x30a1;
const KATAKANA_END = 0x30f6;
const HIRAGANA_OFFSET = 0x60;

function katakanaToHiragana(value) {
  return [...value]
    .map((character) => {
      const code = character.charCodeAt(0);
      return code >= KATAKANA_START && code <= KATAKANA_END
        ? String.fromCharCode(code - HIRAGANA_OFFSET)
        : character;
    })
    .join("");
}

function expandLongVowels(value) {
  const vowelFor = (character) => {
    if (/[あかがさざただなはばぱまゃやらゎわ]/.test(character)) return "あ";
    if (/[いきぎしじちぢにひびぴみり]/.test(character)) return "い";
    if (/[うくぐすずつづぬふぶぷむゅゆる]/.test(character)) return "う";
    if (/[えけげせぜてでねへべぺめれ]/.test(character)) return "え";
    if (/[おこごそぞとのほぼぽもょよろを]/.test(character)) return "う";
    return "";
  };

  return [...value].reduce((result, character) => {
    if (character !== "ー") return result + character;
    return result + vowelFor(result.at(-1) ?? "");
  }, "");
}

export function normalizeReading(value) {
  const compact = value.normalize("NFKC").replace(/\s+/g, "").toLowerCase();
  return expandLongVowels(katakanaToHiragana(compact));
}

export function isCorrectReading(answer, readings) {
  const normalizedAnswer = normalizeReading(answer);
  return normalizedAnswer.length > 0 && readings.some(
    (reading) => normalizeReading(reading) === normalizedAnswer,
  );
}

export function shuffleQuestions(values, random = Math.random) {
  const shuffled = [...values];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled;
}
