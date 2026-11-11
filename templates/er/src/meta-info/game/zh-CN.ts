/**
 * 游戏元信息（简体中文）— schema 事实源，en.ts 以 `typeof zhCN` 锁定结构一致。
 * 只放数据，类型定义见 ../types.ts。
 *
 * ── 修改指引 ──────────────────────────────────────────
 *  title       游戏名称，显示在主页标题和 About 页游戏卡片
 *  subtitle    副标题（可选），显示在主页标题下方
 *  description 游戏简介（可选），显示在 About 页游戏卡片
 *  tags        游戏标签列表（可选），如 ['动作', '解谜', 'Game Jam']
 * ─────────────────────────────────────────────────────
 */

import type { GameMeta } from '../types'

const zhCN: GameMeta = {
  title: '摘星星',
  subtitle: 'Picking Stars',
  description: '跳跃，借助平台摘取你能看到的所有星星。',
  tags: ['[类型]', '[主题]', 'Game Jam'],
  showGameCard: true, // 填好游戏信息后改为 true，About 页会显示游戏卡片
}

export default zhCN
