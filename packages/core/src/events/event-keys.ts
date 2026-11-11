/**
 * 游戏事件键名（Game Engine <-> Vue UI 跨层通信标准）。
 */
export const EVENT_KEYS = {
  SCORE_UPDATE: 'score:update',
  ROUND_UPDATE: 'round:update',
  GAME_OVER: 'game:over',
  GAME_RESTART: 'game:restart',
  GAME_PAUSE: 'game:pause',
  GAME_RESUME: 'game:resume',
  GAME_RESIZE: 'game:resize',
} as const;

export type EventKey = (typeof EVENT_KEYS)[keyof typeof EVENT_KEYS];
