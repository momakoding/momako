/**
 * 团队与成员信息（简体中文）— schema 事实源，en.ts 以 `typeof zhCN` 锁定结构一致。
 * 只放数据，类型定义见 ../types.ts。
 * 如需为某位成员添加详细介绍，在 team-intro/ 目录下创建同名 .md 文件。
 */

import type { TeamInfo } from '../types'

const zhCN: TeamInfo = {
  teamName: 'Momakoding 3D Team',
  description: '让 Game Jam 3D 原型创作像呼吸一样自然。',
  members: [
    {
      name: 'Jammer',
      role: '3D 程序员 / 策划',
    },
  ],
}

export default zhCN
