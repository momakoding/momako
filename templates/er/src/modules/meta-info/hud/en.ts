/**
 * In-game strings (English) — typed as `typeof zhCN` so structure stays in sync with zh-CN.ts.
 * 新增 key 时先改 zh-CN.ts，再在此文件补齐，否则类型检查会报错。
 */

import type zhCN from './zh-CN'

const en: typeof zhCN = {
  score: '⭐ Score:',
  roundsDone: 'Rounds done:',
  pauseTitle: 'Game Paused',
  pause: 'Pause',
  resume: 'Resume',
  restart: 'Restart',
  settings: 'Settings',
  exitToTitle: 'Back to Title',
}

export default en
