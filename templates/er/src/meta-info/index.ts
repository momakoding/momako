/**
 * meta-info 模块 — 玩家可见内容（游戏元信息 / 团队 / 游戏内文案 / 开源依赖 / 玩法介绍）。
 *
 * 组织方式：每个内容主题一个目录，按 locale 分文件（[lang].ts / [lang].md）；
 * en 文件以 `typeof zhCN` 锁定结构一致，漏 key 编译期报错。
 * 字符串内容经 messages.ts 装配后由应用入口（main.ts）merge 进 vue-i18n，
 * 页面用 t()/tm() 取词；how-to-play md 与 oss 列表走各自模块的 API。
 * 本文件只做 re-export（barrel），不放逻辑。
 */

export * from './types'
export * from './oss-credits'
export * from './messages'
export * from './how-to-play'
