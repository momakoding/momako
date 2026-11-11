/**
 * 团队与成员信息（简体中文）— schema 事实源，en.ts 以 `typeof zhCN` 锁定结构一致。
 * 只放数据，类型定义见 ../types.ts。
 * 如需为某位成员添加详细介绍，在 team-intro/ 目录下创建同名 .md 文件。
 */

import type { TeamInfo } from '../types'

const zhCN: TeamInfo = {
  teamName: 'Momakoding',
  description: '[这里是团队介绍和项目信息的占位文本。]',
  members: [
    {
      name: 'Saša',
      role: '策划 / 程序',
      avatar: '🐱',
    },
  ],
}

export default zhCN
