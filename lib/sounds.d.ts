export interface SoundPlayer {
  playInputSound(): void;
  playCorrectSound(): void;
}

export function createSoundPlayer(createContext?: () => AudioContext | null): SoundPlayer;
export const playInputSound: SoundPlayer["playInputSound"];
export const playCorrectSound: SoundPlayer["playCorrectSound"];
