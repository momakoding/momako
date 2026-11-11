import { reactive, ref } from 'vue'
import { EVENT_KEYS, useEventBus } from '@momako/core'
import {
  CAMERA_LERP,
  CAMERA_OFFSET,
  CAMERA_START,
  GRAVITY,
  JUMP_KEYS,
  JUMP_SPEED,
  MAX_DELTA_TIME,
  MOVE_KEYS,
  MOVE_SPEED,
  PLAYER_BOUNDS,
  PLAYER_GROUND_Y,
  PLAYER_SPAWN,
  STAR_COUNT_PER_ROUND,
  STAR_HEIGHT_MIN,
  STAR_HEIGHT_SPREAD,
  STAR_INITIAL_COUNT,
  STAR_PICKUP_DISTANCE,
  STAR_RADIUS_MIN,
  STAR_RADIUS_SPREAD,
  STAR_SCORE,
  STAR_SPIN_SPEED,
} from './constants'
import type { StarItem, Vec3 } from './types'

const eventBus = useEventBus()

/* ── 会话状态（模块级单例） ── */

const score = ref(0)
const completedRounds = ref(0)
const isPaused = ref(false)
const playerPos = reactive<Vec3>({ ...PLAYER_SPAWN })
const playerVelY = ref(0)
const isGrounded = ref(true)
const camPos = reactive<Vec3>({ ...CAMERA_START })
const stars = ref<StarItem[]>([])
const starRot = ref(0)

let starIdCounter = 0
let running = false
const pressedKeys = new Set<string>()

/** 生成一轮星星，围绕原点环形分布 */
function spawnStars(count: number): void {
  stars.value = Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2
    const radius = STAR_RADIUS_MIN + Math.random() * STAR_RADIUS_SPREAD
    return {
      id: ++starIdCounter,
      x: Math.cos(angle) * radius,
      y: STAR_HEIGHT_MIN + Math.random() * STAR_HEIGHT_SPREAD,
      z: Math.sin(angle) * radius,
    }
  })
}

/** 向事件总线广播当前分数与轮数 */
function emitProgress(): void {
  eventBus.emit(EVENT_KEYS.SCORE_UPDATE, score.value)
  eventBus.emit(EVENT_KEYS.ROUND_UPDATE, completedRounds.value)
}

/** 重置玩家、相机、分数与星星到开局状态（不广播） */
function resetSession(): void {
  score.value = 0
  completedRounds.value = 0
  Object.assign(playerPos, PLAYER_SPAWN)
  playerVelY.value = 0
  isGrounded.value = true
  Object.assign(camPos, CAMERA_START)
  starRot.value = 0
  spawnStars(STAR_INITIAL_COUNT)
}

/** 任一给定按键被按下 */
function anyPressed(codes: readonly string[]): boolean {
  return codes.some((code) => pressedKeys.has(code))
}

/** 读取键盘得到的水平移动方向（未归一化） */
function readMoveInput(): { mx: number; mz: number } {
  return {
    mx: Number(anyPressed(MOVE_KEYS.right)) - Number(anyPressed(MOVE_KEYS.left)),
    mz: Number(anyPressed(MOVE_KEYS.backward)) - Number(anyPressed(MOVE_KEYS.forward)),
  }
}

/** 应用键盘位移 */
function applyMovement(dt: number): void {
  const { mx, mz } = readMoveInput()
  if (mx === 0 && mz === 0) return
  const len = Math.hypot(mx, mz)
  playerPos.x += (mx / len) * MOVE_SPEED * dt
  playerPos.z += (mz / len) * MOVE_SPEED * dt
}

/** 应用跳跃与重力 */
function applyVerticalMotion(dt: number): void {
  if (anyPressed(JUMP_KEYS) && isGrounded.value) {
    playerVelY.value = JUMP_SPEED
    isGrounded.value = false
  }

  playerVelY.value += GRAVITY * dt
  playerPos.y += playerVelY.value * dt

  if (playerPos.y <= PLAYER_GROUND_Y) {
    playerPos.y = PLAYER_GROUND_Y
    playerVelY.value = 0
    isGrounded.value = true
  }
}

/** 将玩家水平位置限制在边界内 */
function clampToBounds(): void {
  playerPos.x = Math.max(-PLAYER_BOUNDS, Math.min(PLAYER_BOUNDS, playerPos.x))
  playerPos.z = Math.max(-PLAYER_BOUNDS, Math.min(PLAYER_BOUNDS, playerPos.z))
}

/** 检测星星拾取，清空后进入下一轮 */
function collectStars(): void {
  for (let i = stars.value.length - 1; i >= 0; i--) {
    const s = stars.value[i]!
    const dist = Math.hypot(playerPos.x - s.x, playerPos.y - s.y, playerPos.z - s.z)
    if (dist >= STAR_PICKUP_DISTANCE) continue

    stars.value.splice(i, 1)
    score.value += STAR_SCORE
    eventBus.emit(EVENT_KEYS.SCORE_UPDATE, score.value)

    if (stars.value.length === 0) {
      completedRounds.value += 1
      eventBus.emit(EVENT_KEYS.ROUND_UPDATE, completedRounds.value)
      spawnStars(STAR_INITIAL_COUNT + completedRounds.value * STAR_COUNT_PER_ROUND)
    }
  }
}

/** 平滑相机跟随 */
function followCamera(dt: number): void {
  camPos.x += (playerPos.x + CAMERA_OFFSET.x - camPos.x) * CAMERA_LERP * dt
  camPos.y += (playerPos.y + CAMERA_OFFSET.y - camPos.y) * CAMERA_LERP * dt
  camPos.z += (playerPos.z + CAMERA_OFFSET.z - camPos.z) * CAMERA_LERP * dt
}

/**
 * 推进一帧游戏逻辑。暂停时直接返回；delta 会被限制在 MAX_DELTA_TIME 内。
 * @param delta 距上一帧的秒数（由引擎渲染循环提供）
 */
function step(delta: number): void {
  if (!running || isPaused.value) return

  const dt = Math.min(delta, MAX_DELTA_TIME)
  applyMovement(dt)
  applyVerticalMotion(dt)
  clampToBounds()
  starRot.value += STAR_SPIN_SPEED * dt
  collectStars()
  followCamera(dt)
}

/** 重新开始：清零分数/轮数，玩家回到出生点并重新生成第一轮星星，再广播进度（相机与星星自转保持连续） */
function restart(): void {
  score.value = 0
  completedRounds.value = 0
  Object.assign(playerPos, PLAYER_SPAWN)
  playerVelY.value = 0
  spawnStars(STAR_INITIAL_COUNT)
  emitProgress()
}

/** 暂停 */
function pause(): void {
  isPaused.value = true
}

/** 继续 */
function resume(): void {
  isPaused.value = false
}

/** 记录按下的按键 */
function onKeyDown(e: KeyboardEvent): void {
  pressedKeys.add(e.code)
}

/** 记录松开的按键 */
function onKeyUp(e: KeyboardEvent): void {
  pressedKeys.delete(e.code)
}

/** 开始一局：重置状态、注册键盘与事件总线监听并广播初始进度。重复调用无效。 */
function start(): void {
  if (running) return
  running = true

  isPaused.value = false
  pressedKeys.clear()
  resetSession()

  window.addEventListener('keydown', onKeyDown)
  window.addEventListener('keyup', onKeyUp)
  eventBus.on(EVENT_KEYS.GAME_PAUSE, pause)
  eventBus.on(EVENT_KEYS.GAME_RESUME, resume)
  eventBus.on(EVENT_KEYS.GAME_RESTART, restart)

  emitProgress()
}

/** 结束一局：注销所有监听。 */
function stop(): void {
  if (!running) return
  running = false

  window.removeEventListener('keydown', onKeyDown)
  window.removeEventListener('keyup', onKeyUp)
  eventBus.off(EVENT_KEYS.GAME_PAUSE, pause)
  eventBus.off(EVENT_KEYS.GAME_RESUME, resume)
  eventBus.off(EVENT_KEYS.GAME_RESTART, restart)
  pressedKeys.clear()
}

/**
 * 3D 游戏会话（模块级单例）。纯逻辑，不依赖任何渲染引擎，可被 TresJS 之外的场景复用。
 * @returns 响应式状态与 start/stop/step/restart 等控制函数
 */
export function useGame() {
  return {
    score,
    completedRounds,
    isPaused,
    playerPos,
    playerVelY,
    isGrounded,
    camPos,
    stars,
    starRot,
    start,
    stop,
    step,
    restart,
    pause,
    resume,
  }
}
