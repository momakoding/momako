/**
 * 玩法介绍 Markdown 解析 — md 是长文内容，不走 vue-i18n 消息。
 * 每种语言一个 [lang].md（与 game/ team/ hud/ 同样的组织方式），由本文件统一导出。
 * zh-CN.md 是基础内容，当前语言的 md 缺失时回退到它。
 */

// 构建期静态收集本目录下的所有语言 Markdown
const howToPlayByLocale = import.meta.glob<string>('./*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

const FALLBACK_LOCALE = 'zh-CN'

/** 玩法介绍 Markdown — [lang].md 优先，缺失时回退 zh-CN.md */
export function getHowToPlayMarkdown(locale: string): string {
  return howToPlayByLocale[`./${locale}.md`] ?? howToPlayByLocale[`./${FALLBACK_LOCALE}.md`] ?? ''
}
