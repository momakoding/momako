import * as Phaser from 'phaser'
import { SCENE_KEYS, GAME_CONFIG } from './constants'
import { buildPlatformChain, maxJumpHeight } from './platform-chain'
import type { IGameSceneData } from './types'
import { EVENT_KEYS, useEventBus } from '@momako/core'

const eventBus = useEventBus()
/**
 * 主游戏场景 - 平台跳跃 + 收集星星
 *
 * 学习要点:
 * 1. Arcade 物理系统：重力、碰撞、overlap
 * 2. 键盘输入处理 (cursors)
 * 3. Group 管理同类游戏对象
 * 4. EventBus 与 Vue HUD 通信
 * 5. shutdown 事件中清理监听器
 */
export class GameScene extends Phaser.Scene {
  // ---- 类型声明 ----
  private player!: Phaser.Physics.Arcade.Sprite
  private platforms!: Phaser.Physics.Arcade.StaticGroup
  private stars!: Phaser.GameObjects.Group
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private score = 0
  private completedRounds = 0
  private gameOver = false

  // debug 开关
  private debug = false

  constructor() {
    super({ key: SCENE_KEYS.GAME })
  }

  init(data: IGameSceneData): void {
    this.score = data.startScore ?? 0
    this.completedRounds = data.completedRounds ?? 0
    this.gameOver = false
  }

  create(): void {
    // 画幅以实际画布为准（settings 分辨率决定），布局全部由此推导
    const { width: WIDTH, height: HEIGHT } = this.scale.gameSize
    const { STAR_COUNT, GRAVITY } = GAME_CONFIG

    // ---- 背景 ----
    this.cameras.main.setBackgroundColor('#1a1a2e')

    // ---- 平台 ----
    this.platforms = this.physics.add.staticGroup()

    // 地面：横跨整个画面，贴底摆放
    const ground = this.platforms.create(
      WIDTH / 2,
      HEIGHT - GAME_CONFIG.PLATFORM_TEXTURE.HEIGHT / 2,
      'platform'
    ) as Phaser.Physics.Arcade.Sprite
    ground.setScale(WIDTH / GAME_CONFIG.PLATFORM_TEXTURE.WIDTH, 1).refreshBody()

    // 浮空平台：按跳跃物理生成逐级可达的台阶链，画幅变化后重建场景自动重算
    const groundTopY = HEIGHT - GAME_CONFIG.PLATFORM_TEXTURE.HEIGHT
    buildPlatformChain(WIDTH, HEIGHT, groundTopY, GAME_CONFIG).forEach(({ x, y }) => {
      const p = this.platforms.create(x, y, 'platform') as Phaser.Physics.Arcade.Sprite
      p.setScale(GAME_CONFIG.PLATFORM_SCALE_X, 1).refreshBody()
    })

    // ---- 玩家 ----
    this.player = this.physics.add.sprite(
      WIDTH * GAME_CONFIG.PLAYER_SPAWN_X_RATIO,
      HEIGHT - GAME_CONFIG.PLAYER_SPAWN_GROUND_OFFSET,
      'player'
    )
    this.player.setCollideWorldBounds(true)
    ;(this.player.body as Phaser.Physics.Arcade.Body).setGravityY(GRAVITY)

    // ---- 星星 ----
    this.stars = this.add.group()
    this.spawnStars(STAR_COUNT)

    // ---- 碰撞 ----
    this.physics.add.collider(this.player, this.platforms)
    this.physics.add.collider(this.stars, this.platforms)
    this.physics.add.overlap(this.player, this.stars, this.collectStar, undefined, this)

    // ---- 键盘 ----
    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys()
    }

    // ---- 监听 Vue 发来的事件 ----
    eventBus.on(EVENT_KEYS.GAME_RESTART, this.handleRestart)
    eventBus.on(EVENT_KEYS.GAME_PAUSE, this.handlePause)
    eventBus.on(EVENT_KEYS.GAME_RESUME, this.handleResume)

    // ---- 场景销毁时清理 ----
    this.events.on('shutdown', () => {
      eventBus.off(EVENT_KEYS.GAME_RESTART, this.handleRestart)
      eventBus.off(EVENT_KEYS.GAME_PAUSE, this.handlePause)
      eventBus.off(EVENT_KEYS.GAME_RESUME, this.handleResume)
    })

    // ---- 初始分数 / 轮数同步给 Vue ----
    eventBus.emit(EVENT_KEYS.SCORE_UPDATE, this.score)
    eventBus.emit(EVENT_KEYS.ROUND_UPDATE, this.completedRounds)

    // ---- Debug 可视化 ----
    if (this.debug) {
      this.physics.world.createDebugGraphic()
    }
  }

  update(): void {
    if (this.gameOver) return

    const { PLAYER_SPEED, PLAYER_JUMP } = GAME_CONFIG
    const body = this.player.body as Phaser.Physics.Arcade.Body

    // 左右移动
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-PLAYER_SPEED)
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(PLAYER_SPEED)
    } else {
      this.player.setVelocityX(0)
    }

    // 跳跃（仅在地面时）
    if (this.cursors.up.isDown && body.touching.down) {
      this.player.setVelocityY(PLAYER_JUMP)
    }
  }

  // ---- 私有方法 ----

  private spawnStars(count: number): void {
    const { STAR_GLYPH, STAR_FONT_SIZE, STAR_BOUNCE } = GAME_CONFIG
    const anchors = this.platforms.getChildren()
    Array.from({ length: count }).forEach(() => {
      const pos = this.pickStarSpawn(anchors)
      const star = this.add
        .text(pos.x, pos.y, STAR_GLYPH, { fontSize: `${STAR_FONT_SIZE}px` })
        .setOrigin(0.5, 0.5)
      this.physics.add.existing(star)
      ;(star.body as Phaser.Physics.Arcade.Body).setBounceY(Phaser.Math.FloatBetween(STAR_BOUNCE.MIN, STAR_BOUNCE.MAX))
      this.stars.add(star)
    })
  }

  /**
   * 挑选星星生成点 —— 锚定式：世界重力为 0，星星会悬浮在原地，
   * 因此以某个平台（含地面）为锚点，在其"一跳可达"的上方空域内取点：
   * 垂直不超过最大跳高 × 余量系数，水平漂移限制在滞空可达的一半以内。
   * 与任何平台矩形（外扩间距）重叠则重试。
   */
  private pickStarSpawn(anchors: Phaser.GameObjects.GameObject[]): { x: number; y: number } {
    const { width: WIDTH, height: HEIGHT } = this.scale.gameSize
    const {
      STAR_SPAWN_MARGIN,
      STAR_SPAWN_MAX_ATTEMPTS,
      STAR_FONT_SIZE,
      STAR_RISE_MIN,
      STAR_RISE_MAX_RATIO,
      STAR_DRIFT_X,
      STAR_TOP_LIMIT_RATIO,
      PLAYER_JUMP,
      GRAVITY,
    } = GAME_CONFIG
    const half = STAR_FONT_SIZE / 2 + STAR_SPAWN_MARGIN
    const riseMax = Math.round(maxJumpHeight(-PLAYER_JUMP, GRAVITY) * STAR_RISE_MAX_RATIO)
    const topLimit = Math.round(HEIGHT * STAR_TOP_LIMIT_RATIO)

    // 需要提前跳出重试循环，使用普通 for
    for (let attempt = 0; attempt < STAR_SPAWN_MAX_ATTEMPTS; attempt++) {
      const anchor = anchors[Phaser.Math.Between(0, anchors.length - 1)]
      if (!anchor) break
      const bounds = (anchor as Phaser.GameObjects.Sprite).getBounds()
      // 横跨全屏的地面作为锚点时，水平方向放开到全画幅（地面上到处可达）
      const driftX = bounds.width >= WIDTH * 0.9 ? WIDTH / 2 - half - 4 : STAR_DRIFT_X
      const x = Phaser.Math.Clamp(
        bounds.centerX + Phaser.Math.Between(-driftX, driftX),
        half + 4,
        WIDTH - half - 4
      )
      const yMax = Math.round(bounds.top - STAR_RISE_MIN)
      const yMin = Math.max(Math.round(bounds.top - riseMax), topLimit)
      const y = Phaser.Math.Between(Math.min(yMin, yMax), yMax)
      if (!this.overlapsAnyPlatform(x, y, half)) {
        return { x, y }
      }
    }
    // 兜底：地面（首个创建的平台）正上方，必然可达
    const ground = anchors[0] as Phaser.GameObjects.Sprite | undefined
    return { x: WIDTH / 2, y: (ground?.getBounds().top ?? HEIGHT) - STAR_RISE_MIN }
  }

  /** 判断以 (x, y) 为中心、半径 half 的方块是否与任一平台重叠 */
  private overlapsAnyPlatform(x: number, y: number, half: number): boolean {
    const rect = new Phaser.Geom.Rectangle(x - half, y - half, half * 2, half * 2)
    return this.platforms
      .getChildren()
      .some((p) => Phaser.Geom.Intersects.RectangleToRectangle(rect, (p as Phaser.GameObjects.Sprite).getBounds()))
  }

  private collectStar: Phaser.Types.Physics.Arcade.ArcadePhysicsCallback = (_player, star) => {
    const s = star as Phaser.GameObjects.Text
    ;(s.body as Phaser.Physics.Arcade.Body).enable = false
    s.setActive(false).setVisible(false)

    this.score += 10
    eventBus.emit(EVENT_KEYS.SCORE_UPDATE, this.score)

    // 所有星星收集完毕 → 记一轮，重启场景重新生成整张地图
    if (this.stars.countActive(true) === 0) {
      this.completedRounds += 1
      eventBus.emit(EVENT_KEYS.ROUND_UPDATE, this.completedRounds)
      this.time.delayedCall(GAME_CONFIG.STAR_RESPAWN_DELAY, () => {
        this.scene.restart({ startScore: this.score, completedRounds: this.completedRounds })
      })
    }
  }

  private handlePause = (): void => {
    this.scene.pause()
  }

  private handleResume = (): void => {
    this.scene.resume()
  }

  private handleRestart = (): void => {
    this.score = 0
    this.completedRounds = 0
    this.gameOver = false
    this.scene.restart({ startScore: 0, completedRounds: 0 })
  }
}
