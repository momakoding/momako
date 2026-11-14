/**
 * 游戏内文案（简体中文）— HUD 标签与暂停菜单，schema 事实源，en.ts 以 `typeof zhCN` 锁定结构一致。
 * 只放数据；随游戏玩法调整的文案改这里，框架 UI 文案在 HUD 的 i18n locales（src/i18n/locales）。
 */

const zhCN = {
  /** HUD 分数标签 */
  score: '⭐ 分数:',
  /** HUD 已完成轮数标签 */
  roundsDone: '已完成轮数:',
  /** 暂停遮罩标题 */
  pauseTitle: '游戏暂停',
  /** 暂停按钮 aria-label */
  pause: '暂停',
  /** 暂停菜单 */
  resume: '继续游戏',
  restart: '重新开始',
  settings: '设置',
  exitToTitle: '返回标题页面',
}

export default zhCN
