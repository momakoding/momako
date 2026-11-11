/** GameScene 的 init(data) 入参 */
export interface IGameSceneData {
  startScore?: number
  /** 已完成的收集轮数（scene.restart 时透传保留） */
  completedRounds?: number
}
