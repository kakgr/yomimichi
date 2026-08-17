function createBrowserAudioContext() {
  const AudioContextClass = globalThis.AudioContext ?? globalThis.webkitAudioContext;
  return AudioContextClass ? new AudioContextClass() : null;
}

export function createSoundPlayer(createContext = createBrowserAudioContext) {
  let context;

  function getContext() {
    if (context !== undefined) return context;

    try {
      context = createContext();
    } catch {
      context = null;
    }

    return context;
  }

  function playTone(frequency, duration, volume, delay = 0) {
    const audioContext = getContext();
    if (!audioContext) return;

    if (audioContext.state === "suspended") void audioContext.resume();

    const startsAt = audioContext.currentTime + delay;
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(frequency, startsAt);
    gain.gain.setValueAtTime(volume, startsAt);
    gain.gain.exponentialRampToValueAtTime(0.0001, startsAt + duration);
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start(startsAt);
    oscillator.stop(startsAt + duration);
  }

  return {
    playInputSound() {
      playTone(520, 0.04, 0.025);
    },
    playCorrectSound() {
      playTone(523.25, 0.16, 0.07);
      playTone(659.25, 0.2, 0.075, 0.11);
    },
  };
}

export const { playInputSound, playCorrectSound } = createSoundPlayer();
