/**
 * 游戏模块私有常量 —— 本模块唯一源。
 *
 * 归属原则：
 *   - UI 无关、仅本游戏世界使用的数值/标识（场景 key、玩法调参）。
 *   - engine/ 不应 import 本文件（engine 若需要 fallback，走自己的 SHELL_DEFAULTS）。
 *   - Vue <-> Phaser 跨界事件契约（EVENT_KEYS）在 @/shared/runtime/event-keys，不在本文件。
 */

// ---- 场景 Key ----
export const SCENE_KEYS = {
  BOOT: 'BootScene',
  GAME: 'GameScene',
} as const

// ---- 游戏配置 ----
// 画幅不在此处：实际尺寸由 settings-store 的分辨率设置决定，
// 场景内一律读 this.scale.gameSize.width/height，地图按跳跃物理推导生成。
export const GAME_CONFIG = {
  STAR_COUNT: 12,
  STAR_RESPAWN_DELAY: 1500,
  /** 星星显示字符（Text 对象，非纹理） */
  STAR_GLYPH: '⭐',
  STAR_FONT_SIZE: 24,
  /** 星星落地弹跳系数范围 */
  STAR_BOUNCE: { MIN: 0.2, MAX: 0.5 } as const,
  /**
   * 星星生成 —— 锚定式：每颗星以一个平台（含地面）为锚点，
   * 悬浮在其"一跳可达"的上方空域内（世界重力为 0，星星不会下落）。
   */
  /** 悬浮于锚点平台顶上方的最小高度（px） */
  STAR_RISE_MIN: 40,
  /** 悬浮最大高度（相对最大跳高的比例，留操作余量） */
  STAR_RISE_MAX_RATIO: 0.8,
  /** 相对锚点平台中心的水平漂移半径（px，同层滞空可达 ~450px 的一半） */
  STAR_DRIFT_X: 150,
  /** 星星顶部边界：画幅高度比例（避开 Vue HUD 区域） */
  STAR_TOP_LIMIT_RATIO: 0.12,
  /** 星星生成：与平台保持的最小间距（px，单侧） */
  STAR_SPAWN_MARGIN: 8,
  /** 星星生成：重叠时的重试次数上限 */
  STAR_SPAWN_MAX_ATTEMPTS: 40,

  /** 占位平台纹理尺寸（boot-scene 用它生成纹理，场景用它推导地面/边距） */
  PLATFORM_TEXTURE: { WIDTH: 64, HEIGHT: 16 } as const,
  /** 浮空平台横向缩放 */
  PLATFORM_SCALE_X: 2,
  /** 平台顶边距画幅顶部的比例（避开 Vue HUD 区域） */
  PLATFORM_TOP_MARGIN_RATIO: 0.15,
  /** 平台距左右画幅边缘的最小边距（平台半宽 64 + 余量 32） */
  PLATFORM_X_PAD: 96,

  /**
   * 台阶链生成 —— 保证每一级都在跳跃可达范围内。
   * 跳跃物理：跳高 = v²/(2g)，此处 v=600、g=800 → 最大跳高 225px；
   * 滞空时间 t = (v + √(v² - 2g·rise)) / g，水平可达 = 速度 × t。
   */
  /** 平台数量：按画幅宽度推导（宽/TARGET_SPACING），并夹在 MIN~MAX */
  PLATFORM_COUNT: { MIN: 4, MAX: 6, TARGET_SPACING: 340 } as const,
  /** 相邻台阶的垂直高差范围（相对最大跳高的比例） */
  JUMP_RISE_MIN_RATIO: 0.25,
  JUMP_RISE_MAX_RATIO: 0.6,
  /** 水平可达距离的安全系数（留起跳位置误差余量） */
  JUMP_REACH_SAFETY: 0.65,

  /** 玩家出生点：x 按画幅宽度比例，y 距地面偏移（px） */
  PLAYER_SPAWN_X_RATIO: 0.12,
  PLAYER_SPAWN_GROUND_OFFSET: 60,
  PLAYER_SPEED: 300,
  PLAYER_JUMP: -600,
  GRAVITY: 800,
} as const

export type GameConfig = typeof GAME_CONFIG
