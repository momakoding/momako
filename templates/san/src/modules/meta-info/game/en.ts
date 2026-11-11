/**
 * Game meta (English) — typed as `typeof zhCN` so structure stays in sync with zh-CN.ts.
 * 新增 key 时先改 zh-CN.ts，再在此文件补齐，否则类型检查会报错。
 */

import type zhCN from './zh-CN'

const en: typeof zhCN = {
  title: 'Picking Stars 3D',
  subtitle: 'TresJS Powered Declarative 3D Rapid Prototype',
  description: 'A 3D Game Jam starter built on Vue 3 + TresJS.',
  tags: ['3D', 'TresJS', 'Vue 3', 'Game Jam'],
  showGameCard: true,
}

export default en
