"use client";

import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { questions } from "@/data/questions";
import { isCorrectReading } from "@/lib/quiz.mjs";

type Feedback = "idle" | "correct" | "incorrect" | "revealed";

export default function Home() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<Feedback>("idle");
  const [mistakes, setMistakes] = useState(0);
  const [skipped, setSkipped] = useState(0);
  const [finished, setFinished] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const advancingRef = useRef(false);
  const composingRef = useRef(false);

  const question = questions[questionIndex];

  function advanceQuestion() {
    if (questionIndex === questions.length - 1) {
      setFinished(true);
    } else {
      setQuestionIndex((current) => current + 1);
    }
    setAnswer("");
    setFeedback("idle");
    advancingRef.current = false;
  }

  useEffect(() => {
    inputRef.current?.focus();
  }, [questionIndex, feedback]);

  function submitAnswer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!answer.trim() || advancingRef.current || composingRef.current) return;

    if (!isCorrectReading(answer, question.readings)) {
      setFeedback("incorrect");
      setMistakes((current) => current + 1);
      return;
    }

    advancingRef.current = true;
    setFeedback("correct");
    window.setTimeout(advanceQuestion, 550);
  }

  function revealAnswer() {
    if (advancingRef.current) return;
    setAnswer("");
    setFeedback("revealed");
    setSkipped((current) => current + 1);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" && (event.nativeEvent.isComposing || event.keyCode === 229)) {
      composingRef.current = true;
    }
  }

  function restart() {
    setQuestionIndex(0);
    setAnswer("");
    setFeedback("idle");
    setMistakes(0);
    setSkipped(0);
    setFinished(false);
  }

  return (
    <main className="page-shell">
      <header className="site-header">
        <div className="brand" aria-label="よみみち">
          <span className="brand-mark" aria-hidden="true">読</span>
          <span>よみみち</span>
        </div>
        <p>毎日、ひと読み。</p>
      </header>

      <section className="study-card" aria-labelledby="practice-title">
        {!finished ? (
          <>
            <div className="progress-row">
              <p className="eyebrow">問題 {questionIndex + 1} / {questions.length}</p>
              <div className="progress-track" aria-label={`${questions.length}問中${questionIndex + 1}問目`}>
                <span style={{ width: `${((questionIndex + 1) / questions.length) * 100}%` }} />
              </div>
            </div>

            <div className="prompt-block">
              <p id="practice-title">この漢字、なんて読む？</p>
              <p className="kanji" lang="ja">{question.kanji}</p>
              <span className="brush-line" aria-hidden="true" />
            </div>

            {feedback === "revealed" ? (
              <div className="answer-reveal" role="status" aria-live="polite">
                <p className="answer-label">答え：</p>
                <p className="reading-answer">{question.readings.join(" ／ ")}</p>
                <button type="button" onClick={advanceQuestion}>
                  次の漢字へ <span aria-hidden="true">→</span>
                </button>
              </div>
            ) : (
              <>
                <form className="answer-form" onSubmit={submitAnswer} autoComplete="off">
                  <label htmlFor="reading">読みをひらがなで入力</label>
                  <div className="input-row">
                    <input
                      ref={inputRef}
                      id="reading"
                      value={answer}
                      onChange={(event) => {
                        setAnswer(event.target.value);
                        if (feedback === "incorrect") setFeedback("idle");
                      }}
                      onKeyDown={handleKeyDown}
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
                  {feedback === "correct" && <><span aria-hidden="true">◯</span> 正解！ 次の漢字へ</>}
                  {feedback === "incorrect" && <><span aria-hidden="true">△</span> もう一度、読んでみよう</>}
                  {feedback === "idle" && <span aria-hidden="true">&nbsp;</span>}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="finish-panel">
            <p className="finish-stamp" aria-hidden="true">完</p>
            <p className="eyebrow">きょうの練習</p>
            <h1>ぜんぶ読めました！</h1>
            <p>{questions.length}問完了・まちがい {mistakes}回・スキップ {skipped}問</p>
            <button type="button" onClick={restart}>もう一度はじめる</button>
          </div>
        )}
      </section>

      <footer>
        <p><span aria-hidden="true">●</span> 少しずつ、読める漢字を増やそう。</p>
      </footer>
    </main>
  );
}
