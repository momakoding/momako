/**
 * 玩法介绍 Markdown 解析 — md 是长文内容，不走 vue-i18n 消息。
 * 兜底 + 覆盖模型：how-to-play.md 始终作为基础内容，
 * how-to-play/[lang].md 存在时优先于基础文件。
 */

// 构建期静态收集 Base and per-locale how-to-play markdown, gathered statically at build time
const howToPlayBase = import.meta.glob<string>('./how-to-play.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})['./how-to-play.md']

const howToPlayPerLocale = import.meta.glob<string>('./how-to-play/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

/** 玩法介绍 Markdown — how-to-play/[lang].md 优先，缺失时回退 how-to-play.md */
export function getHowToPlayMarkdown(locale: string): string {
  return howToPlayPerLocale[`./how-to-play/${locale}.md`] ?? howToPlayBase ?? ''
}
