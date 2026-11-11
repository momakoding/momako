/**
 * Team info (English) — typed as `typeof zhCN` so structure stays in sync with zh-CN.ts.
 * 新增 key 时先改 zh-CN.ts，再在此文件补齐，否则类型检查会报错。
 */

import type zhCN from './zh-CN'

const en: typeof zhCN = {
  teamName: 'Momakoding 3D Team',
  description: 'Empowering 3D Game Jam creators to prototype with speed.',
  members: [
    {
      name: 'Jammer',
      role: '3D Dev / Designer',
    },
  ],
}

export default en
