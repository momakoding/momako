import { defineStore } from 'pinia';

export interface SaveState {
  highScore: number;
  totalPlayTime: number;
  unlockedLevels: number;
  customData: Record<string, unknown>;
}

export const useSaveStore = defineStore('game-save', {
  state: (): SaveState => ({
    highScore: 0,
    totalPlayTime: 0,
    unlockedLevels: 1,
    customData: {},
  }),

  actions: {
    updateHighScore(score: number) {
      if (score > this.highScore) {
        this.highScore = score;
      }
    },
    resetSave() {
      this.highScore = 0;
      this.totalPlayTime = 0;
      this.unlockedLevels = 1;
      this.customData = {};
    },
  },

  persist: {
    key: 'game-save',
  },
});
