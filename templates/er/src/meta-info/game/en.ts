/**
 * Game meta (English) — typed as `typeof zhCN` so structure stays in sync with zh-CN.ts.
 * 新增 key 时先改 zh-CN.ts，再在此文件补齐，否则类型检查会报错。
 */

import type zhCN from './zh-CN'

const en: typeof zhCN = {
  title: 'Picking Stars',
  description: 'Jump across platforms and collect every star you can see.',
  tags: ['[Genre]', '[Theme]', 'Game Jam'],
  showGameCard: true,
}

export default en
