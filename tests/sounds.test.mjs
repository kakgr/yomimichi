import assert from "node:assert/strict";
import test from "node:test";
import { createSoundPlayer } from "../lib/sounds.mjs";

class FakeAudioParam {
  events = [];

  setValueAtTime(value, time) {
    this.events.push(["set", value, time]);
  }

  exponentialRampToValueAtTime(value, time) {
    this.events.push(["ramp", value, time]);
  }
}

class FakeAudioContext {
  currentTime = 10;
  destination = {};
  state = "running";
  oscillators = [];

  createOscillator() {
    const oscillator = {
      frequency: new FakeAudioParam(),
      type: "sine",
      connect() {},
      start: (time) => { oscillator.startedAt = time; },
      stop: (time) => { oscillator.stoppedAt = time; },
    };
    this.oscillators.push(oscillator);
    return oscillator;
  }

  createGain() {
    return { gain: new FakeAudioParam(), connect() {} };
  }

  resume() {}
}

test("入力音は短い音を1回だけ鳴らす", () => {
  const context = new FakeAudioContext();
  const sounds = createSoundPlayer(() => context);

  sounds.playInputSound();

  assert.equal(context.oscillators.length, 1);
  assert.equal(context.oscillators[0].frequency.events[0][1], 520);
  assert.ok(context.oscillators[0].stoppedAt - context.oscillators[0].startedAt <= 0.05);
});

test("正解音は高さの違う2音を順番に鳴らす", () => {
  const context = new FakeAudioContext();
  const sounds = createSoundPlayer(() => context);

  sounds.playCorrectSound();

  assert.equal(context.oscillators.length, 2);
  assert.deepEqual(
    context.oscillators.map((oscillator) => oscillator.frequency.events[0][1]),
    [523.25, 659.25],
  );
  assert.ok(context.oscillators[1].startedAt > context.oscillators[0].startedAt);
});
