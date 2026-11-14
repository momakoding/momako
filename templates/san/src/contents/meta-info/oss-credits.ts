/**
 * 开源依赖列表 — 显示在 About 页开源技术区。
 * name / url 语言无关，只维护一份；仅 desc 按 locale 提供，en 缺失时回退 zh-CN。
 */

import type { LocalizedText, OssCredit, ResolvedOssCredit } from './types'

export const OSS_CREDITS: OssCredit[] = [
  { name: '@tresjs/core',   desc: { 'zh-CN': 'Vue 3 声明式 Three.js',       en: 'Declarative Three.js for Vue 3' } },
  { name: '@tresjs/cientos', desc: { 'zh-CN': 'TresJS 实用组件与工具集',     en: 'Useful helpers and components for TresJS' } },
  { name: 'three',          desc: { 'zh-CN': 'JavaScript 3D 库',            en: 'JavaScript 3D Library' } },
  { name: 'pinia',          desc: { 'zh-CN': '直观的 Vue 状态管理',         en: 'Intuitive state management for Vue' } },
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
