/**
 * 场景视觉相关常量（颜色、几何尺寸、灯光）。玩法数值见 @/shared/runtime 的 constants。
 */

/** 画布清屏颜色 */
export const CLEAR_COLOR = '#0f172a'

/** 环境光强度 */
export const AMBIENT_LIGHT_INTENSITY = 0.8

/** 平行光位置 */
export const DIRECTIONAL_LIGHT_POSITION = [10, 20, 15] as const

/** 平行光强度 */
export const DIRECTIONAL_LIGHT_INTENSITY = 1.5

/** 地面边长 */
export const GROUND_SIZE = 60

/** 地面颜色 */
export const GROUND_COLOR = '#1e293b'

/** 地面粗糙度 */
export const GROUND_ROUGHNESS = 0.8

/** 网格分段数 */
export const GRID_DIVISIONS = 30

/** 网格中心线颜色 */
export const GRID_CENTER_COLOR = '#f59e0b'

/** 网格普通线颜色 */
export const GRID_LINE_COLOR = '#334155'

/** 网格抬高量，避免与地面 z-fighting */
export const GRID_LIFT = 0.01

/** 玩家立方体边长 */
export const PLAYER_SIZE = 1

/** 玩家材质 */
export const PLAYER_MATERIAL = {
  color: '#38bdf8',
  roughness: 0.3,
  metalness: 0.2,
  emissive: '#0284c7',
  emissiveIntensity: 0.3,
} as const

/** 星星（八面体）半径 */
export const STAR_SIZE = 0.5

/** 星星绕 Y 轴旋转相对 X 轴的倍率 */
export const STAR_SPIN_Y_FACTOR = 2

/** 星星材质 */
export const STAR_MATERIAL = {
  color: '#fbbf24',
  emissive: '#f59e0b',
  emissiveIntensity: 0.7,
  roughness: 0.2,
  metalness: 0.8,
} as const
