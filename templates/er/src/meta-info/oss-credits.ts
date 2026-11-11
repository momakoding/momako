/**
 * 开源依赖列表 — 显示在 About 页开源技术区。
 * name / url 语言无关，只维护一份；仅 desc 按 locale 提供，en 缺失时回退 zh-CN。
 */

import type { LocalizedText, OssCredit, ResolvedOssCredit } from './types'

export const OSS_CREDITS: OssCredit[] = [
  { name: 'Phaser 4',     desc: { 'zh-CN': '游戏引擎',    en: 'Game engine' },           url: 'https://phaser.io' },
  { name: 'Vue 3',        desc: { 'zh-CN': 'UI 框架',     en: 'UI framework' },          url: 'https://vuejs.org' },
  { name: 'Vite',         desc: { 'zh-CN': '构建工具',    en: 'Build tool' },            url: 'https://vitejs.dev' },
  { name: 'Tailwind CSS', desc: { 'zh-CN': '原子化 CSS',  en: 'Atomic CSS' },            url: 'https://tailwindcss.com' },
  { name: 'Pinia',        desc: { 'zh-CN': '状态管理',    en: 'State management' },      url: 'https://pinia.vuejs.org' },
  { name: 'Vue Router',   desc: { 'zh-CN': '路由',        en: 'Routing' },               url: 'https://router.vuejs.org' },
  { name: 'VueUse',       desc: { 'zh-CN': '组合式工具集', en: 'Composition utilities' }, url: 'https://vueuse.org' },
  { name: 'Lucide Icons', desc: { 'zh-CN': '图标库',      en: 'Icon library' },          url: 'https://lucide.dev' },
]

/** 取双语文案当前语言值 — en 缺失时回退 zh-CN */
function resolveText(text: LocalizedText, locale: string): string {
  return text[locale as keyof LocalizedText] ?? text['zh-CN']
}

/** 当前语言的开源依赖列表（desc 已按 locale 解析），未知 locale 回退 zh-CN */
export function getOssCredits(locale: string): ResolvedOssCredit[] {
  return OSS_CREDITS.map((credit) => ({
    ...credit,
    desc: resolveText(credit.desc, locale),
  }))
}
