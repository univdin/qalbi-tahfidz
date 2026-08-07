import { create } from "zustand";

export type MaskingMode = "full" | "first-letter" | "hidden";
export type AgePersona = "early_child" | "junior" | "teen_adult";
export type QuranScript = "uthmani" | "indopak";

interface AudioStoreState {
  isPlaying: boolean;
  isSilenceGap: boolean;
  repeatPerAyah: number;
  delayRatio: number;
  currentAyahRepeat: number;
  currentAyahIndex: number;
  playbackRate: number;
  selectedReciter: string;

  agePersona: AgePersona;
  maskingMode: MaskingMode;
  preferredScript: QuranScript;
  targetDailyVerses: number;

  setAudioState: (state: Partial<AudioStoreState>) => void;
  incrementAyahRepeat: () => void;
  resetAyahRepeat: () => void;
  nextAyah: () => void;
  setPersonalization: (
    persona: AgePersona,
    masking: MaskingMode,
    script: QuranScript,
    target: number
  ) => void;
}

export const useAudioStore = create<AudioStoreState>((set) => ({
  isPlaying: false,
  isSilenceGap: false,
  repeatPerAyah: 3,
  delayRatio: 1.2,
  currentAyahRepeat: 0,
  currentAyahIndex: 0,
  playbackRate: 1.0,
  selectedReciter: "murottal_ummi_nahawand",

  agePersona: "junior",
  maskingMode: "full",
  preferredScript: "indopak",
  targetDailyVerses: 10,

  setAudioState: (newState) => set((state) => ({ ...state, ...newState })),
  incrementAyahRepeat: () =>
    set((state) => ({ currentAyahRepeat: state.currentAyahRepeat + 1 })),
  resetAyahRepeat: () => set({ currentAyahRepeat: 0 }),
  nextAyah: () =>
    set((state) => ({
      currentAyahIndex: state.currentAyahIndex + 1,
      currentAyahRepeat: 0,
    })),
  setPersonalization: (persona, masking, script, target) =>
    set({
      agePersona: persona,
      maskingMode: masking,
      preferredScript: script,
      targetDailyVerses: target,
    }),
}));
