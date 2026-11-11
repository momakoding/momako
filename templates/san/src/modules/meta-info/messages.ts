/**
 * vue-i18n 消息片段装配 — 把各语言数据文件组装成统一的 META_MESSAGES，
 * 由应用入口（main.ts）merge 进 i18n 实例；页面一律以 'meta.' 前缀用 t()/tm() 取词。
 * 注意：内容会经过 vue-i18n 消息编译器，文案中的 @ | {} 需按其语法转义。
 */

import gameZhCN from './game/zh-CN'
import gameEn from './game/en'
import teamZhCN from './team/zh-CN'
import teamEn from './team/en'
import hudZhCN from './hud/zh-CN'
import hudEn from './hud/en'

export const META_MESSAGES = {
  'zh-CN': {
    meta: {
      game: gameZhCN,
      team: teamZhCN,
      hud: hudZhCN,
    },
  },
  en: {
    meta: {
      game: gameEn,
      team: teamEn,
      hud: hudEn,
    },
  },
}
