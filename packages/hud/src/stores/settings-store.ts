import { defineStore } from 'pinia';
import {
  RESOLUTION_PRESETS,
  type Language,
  type ResolutionSetting,
  type SettingsState,
  type GameResolution,
} from '@momako/core';

export { RESOLUTION_PRESETS, type Language, type ResolutionSetting, type SettingsState, type GameResolution };

/** 解析 'WxH' 预设字符串为画幅尺寸 */
function parsePreset(preset: (typeof RESOLUTION_PRESETS)[number]): GameResolution {
  const [width, height] = preset.split('x').map(Number);
  return { width: width ?? 800, height: height ?? 600 };
}

/** auto 模式：取能在当前窗口内完整容纳的最大预设；兜底 800x600 */
function resolveAuto(): GameResolution {
  if (typeof window === 'undefined') return { width: 800, height: 600 };
  const margin = 32;
  const availW = window.innerWidth - margin;
  const availH = window.innerHeight - margin;
  const fitting = RESOLUTION_PRESETS
    .map(parsePreset)
    .filter(({ width, height }) => width <= availW && height <= availH);
  return fitting.length > 0 ? fitting[fitting.length - 1]! : { width: 800, height: 600 };
}

function detectBrowserLanguage(): Language {
  if (typeof navigator === 'undefined') return 'zh-CN';
  const preferred = navigator.language?.toLowerCase() ?? '';
  return preferred.startsWith('zh') ? 'zh-CN' : 'en';
}

export const useSettingsStore = defineStore('game-settings', {
  state: (): SettingsState => ({
    bgmVolume: 80,
    sfxVolume: 100,
    muted: false,
    language: detectBrowserLanguage(),
    resolution: 'auto',
  }),

  getters: {
    gameResolution(state): GameResolution {
      if (state.resolution === 'auto') {
        return resolveAuto();
      }
      return parsePreset(state.resolution);
    },
  },

  persist: {
    key: 'game-settings',
    pick: ['bgmVolume', 'sfxVolume', 'muted', 'language', 'resolution'],
  },
});
