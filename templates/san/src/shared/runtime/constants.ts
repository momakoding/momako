/**
 * 3D 游戏会话的玩法调参数值 — 纯数据，无引擎依赖。
 * 视觉相关数值（颜色、几何尺寸、灯光）见 game/scenes/constants.ts。
 */

/** 单帧时间步长上限（秒），防止切页后巨大 delta 造成穿透 */
export const MAX_DELTA_TIME = 0.1

/** 玩家水平移动速度（单位/秒） */
export const MOVE_SPEED = 8

/** 重力加速度（单位/秒²，向下为负） */
export const GRAVITY = -20

/** 跳跃初速度（单位/秒） */
export const JUMP_SPEED = 8

/** 玩家站立时的 Y 坐标（立方体中心高度） */
export const PLAYER_GROUND_Y = 0.5

/** 玩家水平移动的边界（±） */
export const PLAYER_BOUNDS = 25

/** 玩家出生点 */
export const PLAYER_SPAWN = { x: 0, y: PLAYER_GROUND_Y, z: 0 } as const

/** 第一轮星星数量 */
export const STAR_INITIAL_COUNT = 8

/** 每完成一轮，下一轮增加的星星数 = 已完成轮数 × 该值 */
export const STAR_COUNT_PER_ROUND = 2

/** 星星分布的最小半径 */
export const STAR_RADIUS_MIN = 5

/** 星星分布半径的随机跨度（实际半径 = MIN + random × SPREAD） */
export const STAR_RADIUS_SPREAD = 8

/** 星星最低高度 */
export const STAR_HEIGHT_MIN = 0.8

/** 星星高度的随机跨度 */
export const STAR_HEIGHT_SPREAD = 0.5

/** 星星自转速度（弧度/秒） */
export const STAR_SPIN_SPEED = 2

/** 玩家与星星的拾取距离 */
export const STAR_PICKUP_DISTANCE = 1.1

/** 每颗星星的得分 */
export const STAR_SCORE = 10

/** 相机初始位置 */
export const CAMERA_START = { x: 0, y: 7, z: 10 } as const

/** 相机相对玩家的目标偏移 */
export const CAMERA_OFFSET = { x: 0, y: 6, z: 9 } as const

/** 相机跟随平滑系数（每秒） */
export const CAMERA_LERP = 5

/** 相机注视点相对玩家的 Y 偏移 */
export const CAMERA_LOOK_AT_OFFSET_Y = 0.5

/** 跳跃键 */
export const JUMP_KEYS = ['Space', 'KeyK'] as const

/** 方向输入键（按 key.code） */
export const MOVE_KEYS = {
  forward: ['KeyW', 'ArrowUp'],
  backward: ['KeyS', 'ArrowDown'],
  left: ['KeyA', 'ArrowLeft'],
  right: ['KeyD', 'ArrowRight'],
} as const
