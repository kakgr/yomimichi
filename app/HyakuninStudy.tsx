"use client";

import { useState } from "react";
import { hyakuninPoems } from "@/data/hyakunin";
import { buildHyakuninQuiz, type HyakuninQuestion } from "@/lib/hyakuninQuiz";
import { playCorrectSound } from "@/lib/sounds.mjs";

type Mode = "study" | "quiz";
export function HyakuninStudy({ onBack }: { onBack: () => void }) {
  const [mode, setMode] = useState<Mode>("study");
  const [studyIndex, setStudyIndex] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);
  const [showWords, setShowWords] = useState(false);
  const [questions, setQuestions] = useState<HyakuninQuestion[]>([]);
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const studyPoem = hyakuninPoems[studyIndex];
  const question = questions[quizIndex];

  function goToStudy(index: number) {
    setStudyIndex(index);
    setShowTranslation(false);
    setShowWords(false);
    setMode("study");
  }

  function startQuiz() {
    setQuestions(buildHyakuninQuiz(hyakuninPoems));
    setQuizIndex(0);
    setSelectedId(null);
    setCorrectCount(0);
    setQuizFinished(false);
    setMode("quiz");
  }

  function chooseAnswer(id: string) {
    if (selectedId !== null) return;
    setSelectedId(id);
    if (id === question.correctId) {
      setCorrectCount((count) => count + 1);
      playCorrectSound();
    }
  }

  function nextQuestion() {
    if (quizIndex === questions.length - 1) {
      setQuizFinished(true);
      return;
    }
    const nextIndex = quizIndex + 1;
    setQuizIndex(nextIndex);
    setSelectedId(null);
  }

  return (
    <section className="hyakunin-card" aria-labelledby="hyakunin-title">
      <div className="hyakunin-heading">
        <div>
          <p className="eyebrow">百人一首・第8〜18番</p>
          <h1 id="hyakunin-title">百人一首学習</h1>
        </div>
        <button className="hyakunin-back" type="button" onClick={onBack}>学習メニューへ</button>
      </div>

      <div className="hyakunin-tabs" role="group" aria-label="学習方法">
        <button type="button" className={mode === "study" ? "active" : ""} aria-pressed={mode === "study"} onClick={() => goToStudy(studyIndex)}>覚える</button>
        <button type="button" className={mode === "quiz" ? "active" : ""} aria-pressed={mode === "quiz"} onClick={startQuiz}>4択クイズ</button>
      </div>

      {mode === "study" ? (
        <div className="hyakunin-content">
          <p className="hyakunin-count">{studyIndex + 1} / {hyakuninPoems.length}首目 <span>百人一首 第{studyPoem.number}番・{studyPoem.category}</span></p>
          <article className="poem-card">
            <p className="poem-kanji" lang="ja">{studyPoem.upperKanji}<br />{studyPoem.lowerKanji}</p>
            <p className="poem-kana" lang="ja">{studyPoem.upperKana}<br />{studyPoem.lowerKana}</p>
            <p className="poem-author">{studyPoem.author}<span>{studyPoem.authorReading}</span></p>
          </article>

          <div className="poem-details">
            <button type="button" aria-expanded={showTranslation} onClick={() => setShowTranslation(!showTranslation)}>
              現代語訳 {showTranslation ? "を閉じる" : "を見る"}
            </button>
            {showTranslation && <p className="poem-explanation">{studyPoem.translation}</p>}
            <button type="button" aria-expanded={showWords} onClick={() => setShowWords(!showWords)}>
              重要語句 {showWords ? "を閉じる" : "を見る"}
            </button>
            {showWords && (
              <div className="poem-explanation">
                {studyPoem.wordplay.length > 0 && (
                  <div><h2>掛詞・枕詞</h2><ul>{studyPoem.wordplay.map((item) => <li key={item.term}>{item.term}：{item.explanation}</li>)}</ul></div>
                )}
                <div><h2>その他の重要語句</h2><ul>{studyPoem.notes.map((item) => <li key={item}>{item}</li>)}</ul></div>
              </div>
            )}
          </div>

          <div className="hyakunin-actions">
            <button type="button" disabled={studyIndex === 0} onClick={() => goToStudy(studyIndex - 1)}>前の歌</button>
            <button type="button" disabled={studyIndex === hyakuninPoems.length - 1} onClick={() => goToStudy(studyIndex + 1)}>次の歌</button>
          </div>
          <button className="hyakunin-start" type="button" onClick={startQuiz}>4択クイズに挑戦</button>
        </div>
      ) : quizFinished ? (
        <div className="hyakunin-result" role="status">
          <p className="eyebrow">10問終了</p>
          <h2>{correctCount} / {questions.length}問 正解</h2>
          <div className="hyakunin-actions">
            <button type="button" onClick={startQuiz}>もう一度</button>
            <button type="button" onClick={() => goToStudy(0)}>歌を見直す</button>
          </div>
        </div>
      ) : question && (
        <div className="hyakunin-content">
          <p className="hyakunin-count">問題 {quizIndex + 1} / {questions.length}</p>
          <div className="quiz-verse">
            <p>{question.prompt}</p>
            {question.stem && <p className="poem-kanji" lang="ja">{question.stem}</p>}
            {question.stemReading && <p className="poem-kana" lang="ja">{question.stemReading}</p>}
          </div>
          <div className="verse-choices" role="group" aria-label="4択の選択肢">
            {question.options.map((choice, index) => {
              const isCorrect = selectedId !== null && choice.id === question.correctId;
              const isWrong = selectedId === choice.id && choice.id !== question.correctId;
              return (
                <button
                  key={choice.id}
                  type="button"
                  className={`${isCorrect ? "correct" : ""}${isWrong ? " wrong" : ""}`}
                  aria-pressed={selectedId === choice.id}
                  disabled={selectedId !== null}
                  onClick={() => chooseAnswer(choice.id)}
                >
                  <span className="choice-letter" aria-hidden="true">{String.fromCharCode(65 + index)}</span>
                  <span><span className="choice-kanji">{choice.label}</span>{choice.reading && <span className="choice-kana">{choice.reading}</span>}</span>
                </button>
              );
            })}
          </div>
          {selectedId !== null && (
            <div className="quiz-feedback" role="status" aria-live="polite">
              <p>{selectedId === question.correctId ? "正解！" : `正解は「${question.correctLabel}」`}</p>
              <button type="button" onClick={nextQuestion}>{quizIndex === questions.length - 1 ? "結果を見る" : "次の問題へ"}</button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
