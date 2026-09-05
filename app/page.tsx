"use client";

import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { ffjQuestions } from "@/data/ffjQuestions";
import { questions } from "@/data/questions";
import { secondKanjiQuestions } from "@/data/questionsSecond";
import { isCorrectReading, selectRandomQuestions } from "@/lib/quiz.mjs";
import { playCorrectSound, playInputSound } from "@/lib/sounds.mjs";

type Feedback = "idle" | "correct" | "incorrect" | "revealed";
type Screen = "menu" | "practice";
type PracticeKind = "kanji" | "kanji-second" | "image";
type PracticeQuestion =
  | { kind: "kanji"; kanji: string; answers: readonly string[] }
  | { kind: "image"; id: number; name: string; answers: readonly string[]; images: readonly string[] };
const SESSION_QUESTION_COUNT = 10;

const kanjiPracticeQuestions: PracticeQuestion[] = questions.map(({ kanji, readings }) => ({
  kind: "kanji",
  kanji,
  answers: readings,
}));

const secondKanjiPracticeQuestions: PracticeQuestion[] = secondKanjiQuestions.map(({ kanji, readings }) => ({
  kind: "kanji",
  kanji,
  answers: readings,
}));

const imagePracticeQuestions: PracticeQuestion[] = ffjQuestions.map((question) => ({
  kind: "image",
  ...question,
}));

export default function Home() {
  const [screen, setScreen] = useState<Screen>("menu");
  const [practiceKind, setPracticeKind] = useState<PracticeKind>("kanji");
  const [questionOrder, setQuestionOrder] = useState<PracticeQuestion[]>(
    () => kanjiPracticeQuestions.slice(0, SESSION_QUESTION_COUNT),
  );
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<Feedback>("idle");
  const [mistakes, setMistakes] = useState(0);
  const [skipped, setSkipped] = useState(0);
  const [finished, setFinished] = useState(false);
  const [isCompactInput, setIsCompactInput] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const studyCardRef = useRef<HTMLElement>(null);
  const advancingRef = useRef(false);
  const composingRef = useRef(false);

  const question = questionOrder[questionIndex];

  function advanceQuestion() {
    if (questionIndex === questionOrder.length - 1) {
      setFinished(true);
      setIsCompactInput(false);
    } else {
      setQuestionIndex((current) => current + 1);
    }
    setAnswer("");
    setFeedback("idle");
    advancingRef.current = false;
  }

  useEffect(() => {
    if (screen === "practice" && !finished) inputRef.current?.focus();
  }, [screen, questionIndex, feedback, finished]);

  useEffect(() => {
    if (screen !== "practice" || practiceKind !== "image") return;
    const nextQuestion = questionOrder[questionIndex + 1];
    if (!nextQuestion || nextQuestion.kind !== "image") return;

    const preload = new Image();
    preload.src = nextQuestion.images[0];
  }, [screen, practiceKind, questionIndex, questionOrder]);

  function submitAnswer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!answer.trim() || advancingRef.current || composingRef.current) return;

    if (!isCorrectReading(answer, question.answers)) {
      setFeedback("incorrect");
      setMistakes((current) => current + 1);
      return;
    }

    advancingRef.current = true;
    playCorrectSound();
    setFeedback("correct");
    window.setTimeout(advanceQuestion, 950);
  }

  function revealAnswer() {
    if (advancingRef.current) return;
    setAnswer("");
    setFeedback("revealed");
    setSkipped((current) => current + 1);
    setIsCompactInput(false);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" && (event.nativeEvent.isComposing || event.keyCode === 229)) {
      composingRef.current = true;
    }
  }

  function keepQuestionVisible() {
    if (!window.matchMedia("(max-width: 1024px)").matches) return;
    setIsCompactInput(true);
    window.setTimeout(() => {
      studyCardRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
    }, 300);
  }

  function resetPractice(kind = practiceKind) {
    const source = kind === "kanji"
      ? kanjiPracticeQuestions
      : kind === "kanji-second"
        ? secondKanjiPracticeQuestions
        : imagePracticeQuestions;
    setPracticeKind(kind);
    setQuestionOrder(selectRandomQuestions(source, SESSION_QUESTION_COUNT));
    setQuestionIndex(0);
    setAnswer("");
    setFeedback("idle");
    setMistakes(0);
    setSkipped(0);
    setFinished(false);
    setIsCompactInput(false);
  }

  function startKanjiPractice() {
    resetPractice("kanji");
    setScreen("practice");
  }

  function startImagePractice() {
    resetPractice("image");
    setScreen("practice");
  }

  function startSecondKanjiPractice() {
    resetPractice("kanji-second");
    setScreen("practice");
  }

  function restart() {
    resetPractice();
  }

  function returnToMenu() {
    setScreen("menu");
    setIsCompactInput(false);
  }

  return (
    <main className={`page-shell${isCompactInput ? " input-compact-shell" : ""}`}>
      <header className="site-header">
        <div className="brand" aria-label="よみみち">
          <span className="brand-mark" aria-hidden="true">読</span>
          <span>よみみち</span>
        </div>
        <p>毎日、ひと読み。</p>
      </header>

      {screen === "menu" ? (
        <section className="learning-menu" aria-labelledby="learning-menu-title">
          <div className="menu-intro">
            <p className="eyebrow">学習メニュー</p>
            <h1 id="learning-menu-title">今日は何を練習する？</h1>
            <p>学習したい内容を選んでください。</p>
          </div>

          <div className="learning-grid">
            <button className="learning-option" type="button" onClick={startKanjiPractice}>
              <span className="learning-mark" aria-hidden="true">読</span>
              <span className="learning-copy">
                <strong>漢字の読み</strong>
                <span>表示された熟語の読みを、ひらがなで答えます。</span>
                <small>全256問からランダムに10問</small>
              </span>
              <span className="learning-arrow" aria-hidden="true">→</span>
            </button>

            <button className="learning-option" type="button" onClick={startSecondKanjiPractice}>
              <span className="learning-mark second-learning-mark" aria-hidden="true">弐</span>
              <span className="learning-copy">
                <strong>第二回漢字学習</strong>
                <span>新しい漢字ドリルの掲載語を、第一回とは別に練習します。</span>
                <small>全43問からランダムに10問</small>
              </span>
              <span className="learning-arrow" aria-hidden="true">→</span>
            </button>

            <button className="learning-option" type="button" onClick={startImagePractice}>
              <span className="learning-mark image-learning-mark" aria-hidden="true">識</span>
              <span className="learning-copy">
                <strong>植物・道具の名前</strong>
                <span>画像を見て、植物や造園道具の名前を答えます。</span>
                <small>全46問からランダムに10問</small>
              </span>
              <span className="learning-arrow" aria-hidden="true">→</span>
            </button>
          </div>
        </section>
      ) : (
        <section
          ref={studyCardRef}
          className={`study-card${practiceKind === "image" ? " image-study-card" : ""}${isCompactInput ? " input-compact" : ""}`}
          aria-labelledby="practice-title"
        >
          {!finished ? (
            <>
              <div className="progress-row">
              <p className="eyebrow">問題 {questionIndex + 1} / {questionOrder.length}</p>
              <div className="progress-track" aria-label={`${questionOrder.length}問中${questionIndex + 1}問目`}>
                <span style={{ width: `${((questionIndex + 1) / questionOrder.length) * 100}%` }} />
              </div>
            </div>

            {question.kind === "kanji" ? (
              <div className={`prompt-block${feedback === "correct" ? " is-correct" : ""}`}>
                <p id="practice-title">この漢字、なんて読む？</p>
                <p className="kanji" lang="ja">{question.kanji}</p>
                <span className="brush-line" aria-hidden="true" />
              </div>
            ) : (
              <div className={`image-prompt${feedback === "correct" ? " is-correct" : ""}`}>
                <p id="practice-title">この植物・道具の名前は？</p>
                <div className="question-images">
                  {question.images.map((source, imageIndex) => (
                    <figure className="question-image-frame" key={source}>
                      {/* 静的書き出し後もGitHub Pagesの相対パスを保つため、素のimgを使用します。 */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={source}
                        alt={`問題の画像 ${imageIndex + 1}`}
                        loading="eager"
                        decoding="async"
                        draggable={false}
                      />
                      {question.images.length > 1 && (
                        <figcaption>{imageIndex + 1} / {question.images.length}</figcaption>
                      )}
                    </figure>
                  ))}
                </div>
                {question.images.length > 1 && <p className="swipe-hint">横にスライドして画像を確認できます</p>}
              </div>
            )}

            {feedback === "revealed" ? (
              <div className="answer-reveal" role="status" aria-live="polite">
                <p className="answer-label">答え：</p>
                <p className="reading-answer">{question.answers.join(" ／ ")}</p>
                <button type="button" onClick={advanceQuestion}>
                  次の問題へ <span aria-hidden="true">→</span>
                </button>
              </div>
            ) : (
              <>
                <form className="answer-form" onSubmit={submitAnswer} autoComplete="off">
                  <label htmlFor="reading">
                    {question.kind === "kanji" ? "読みをひらがなで入力" : "名前を入力"}
                  </label>
                  <div className="input-row">
                    <input
                      ref={inputRef}
                      id="reading"
                      value={answer}
                      onChange={(event) => {
                        playInputSound();
                        setAnswer(event.target.value);
                        if (feedback === "incorrect") setFeedback("idle");
                      }}
                      onKeyDown={handleKeyDown}
                      onFocus={keepQuestionVisible}
                      onCompositionStart={() => { composingRef.current = true; }}
                      onCompositionEnd={() => {
                        window.setTimeout(() => { composingRef.current = false; }, 0);
                      }}
                      type="text"
                      inputMode="text"
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="off"
                      spellCheck={false}
                      enterKeyHint="done"
                      aria-describedby="input-hint feedback"
                      aria-invalid={feedback === "incorrect"}
                    />
                    <button type="submit" disabled={!answer.trim() || feedback === "correct"}>
                      答える
                      <span aria-hidden="true">→</span>
                    </button>
                  </div>
                  <div className="answer-meta">
                    <p id="input-hint" className="input-hint">Enter キーでも答えられます</p>
                    <button className="skip-button" type="button" onClick={revealAnswer} disabled={feedback === "correct"}>
                      わからない
                    </button>
                  </div>
                </form>

                <div id="feedback" className={`feedback ${feedback}`} role="status" aria-live="polite">
                    {feedback === "correct" && (
                          <><span aria-hidden="true">◯</span> {question.kind === "kanji" ? "正解！ 次の漢字へ" : "正解！ 次の問題へ"}</>
                    )}
                    {feedback === "incorrect" && (
                          <><span aria-hidden="true">△</span> {question.kind === "kanji" ? "もう一度、読んでみよう" : "もう一度、考えてみよう"}</>
                    )}
                  {feedback === "idle" && <span aria-hidden="true">&nbsp;</span>}
                </div>
              </>
            )}
            </>
          ) : (
            <div className="finish-panel">
              <p className="finish-stamp" aria-hidden="true">完</p>
              <p className="eyebrow">きょうの練習</p>
              <h1>{question.kind === "kanji" ? "ぜんぶ読めました！" : "ぜんぶ答えられました！"}</h1>
              <p>{questionOrder.length}問完了・まちがい {mistakes}回・スキップ {skipped}問</p>
              <div className="finish-actions">
                <button type="button" onClick={restart}>もう一度はじめる</button>
                <button className="secondary-button" type="button" onClick={returnToMenu}>学習を選び直す</button>
              </div>
            </div>
          )}
        </section>
      )}

      <footer>
        <p><span aria-hidden="true">●</span> 少しずつ、できることを増やそう。</p>
      </footer>
    </main>
  );
}
