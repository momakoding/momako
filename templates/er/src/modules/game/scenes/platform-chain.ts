import * as Phaser from 'phaser'
import type { GameConfig } from './constants'

export interface ChainNode {
  x: number
  y: number
}

/** 跳跃物理推导的最大跳高：v²/(2g) */
export function maxJumpHeight(jumpV: number, gravity: number): number {
  return (jumpV * jumpV) / (2 * gravity)
}

/**
 * 生成一条自下而上的台阶链：相邻两级的垂直高差与水平间距
 * 均由跳跃物理推导并留安全余量，保证从地面出发逐级可达。
 *
 * 坐标为基于当前画幅推导的绝对像素 —— 画幅变化后场景重建即自动重算。
 */
export function buildPlatformChain(width: number, height: number, groundTopY: number, config: GameConfig): ChainNode[] {
  const jumpV = -config.PLAYER_JUMP
  const maxJumpHeightPx = maxJumpHeight(jumpV, config.GRAVITY)
  const riseMin = Math.round(maxJumpHeightPx * config.JUMP_RISE_MIN_RATIO)
  const riseMax = Math.round(maxJumpHeightPx * config.JUMP_RISE_MAX_RATIO)
  const topLimit = height * config.PLATFORM_TOP_MARGIN_RATIO
  const pad = config.PLATFORM_X_PAD
  const platformWidth = config.PLATFORM_TEXTURE.WIDTH * config.PLATFORM_SCALE_X

  const count = Phaser.Math.Clamp(
    Math.round(width / config.PLATFORM_COUNT.TARGET_SPACING),
    config.PLATFORM_COUNT.MIN,
    config.PLATFORM_COUNT.MAX
  )

  // 台阶是逐级依赖前一级位置的随机游走 → 使用普通 for 依次推导
  const nodes: ChainNode[] = []
  let prevX = Phaser.Math.Between(pad, Math.max(pad + 1, Math.round(width * 0.35)))
  let prevY = groundTopY
  let dir = 1

  for (let i = 0; i < count; i++) {
    // 高差不超过 topLimit（顶部 HUD 区），逼近顶部时允许同层横向跳跃
    const maxRise = Math.max(0, Math.round(prevY - topLimit))
    const rise = Phaser.Math.Clamp(Phaser.Math.Between(riseMin, riseMax), 0, maxRise)
    const y = prevY - rise

    // 水平间距按该高差下的滞空可达距离收缩，下限为一整块平台宽（避免同层重叠）
    const reach = airReach(jumpV, config.GRAVITY, config.PLAYER_SPEED, rise) * config.JUMP_REACH_SAFETY
    const gapMin = Math.max(platformWidth, Math.round(reach * 0.35))
    const gap = Phaser.Math.Between(gapMin, Math.max(gapMin, Math.round(reach)))

    let x = prevX + dir * gap
    if (x < pad || x > width - pad) {
      // 触壁折返，向反方向跳
      dir = -dir
      x = Phaser.Math.Clamp(prevX + dir * gap, pad, width - pad)
    }

    nodes.push({ x, y })
    prevX = x
    prevY = y
  }

  return nodes
}

/** 上升 rise 高度过程中的滞空时间对应水平距离：t = (v + √(v² - 2g·rise)) / g */
function airReach(jumpV: number, gravity: number, speed: number, rise: number): number {
  const disc = Math.max(0, jumpV * jumpV - 2 * gravity * rise)
  const t = (jumpV + Math.sqrt(disc)) / gravity
  return speed * t
}
