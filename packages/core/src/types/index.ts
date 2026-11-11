/**
 * @momako-jam/core - Types & Definitions
 */

export type EventCallback = (...args: unknown[]) => void;

/* ── 多语言文本 ── */
export interface LocalizedText {
  'zh-CN': string;
  en?: string;
}

/* ── 游戏元信息与团队信息 ── */
export interface OssCredit {
  /** 项目名称（语言无关） */
  name: string;
  /** 用途描述（双语文案） */
  desc: LocalizedText;
  /** 项目主页（可选） */
  url?: string;
}

export interface ResolvedOssCredit extends Omit<OssCredit, 'desc'> {
  desc: string;
}

export interface GameMeta {
  /** 游戏名称 */
  title: string;
  /** 副标题（可选） */
  subtitle?: string;
  /** 游戏简介（可选） */
  description?: string;
  /** 游戏标签列表（可选），如 ['动作', '解谜', 'Game Jam'] */
  tags?: string[];
  /** 是否在 About 页显示游戏信息卡片（默认 false，填好内容后改为 true） */
  showGameCard?: boolean;
}

export interface TeamMember {
  /** 成员姓名 */
  name: string;
  /** 职责角色，如"策划 / 程序" */
  role: string;
  /** 个人主页或社交链接（可选） */
  url?: string;
}

export interface TeamInfo {
  /** 团队名称 */
  name: string;
  /** 成员列表 */
  members: TeamMember[];
  /** 团队介绍（可选） */
  description?: string;
}

/* ── 设置体系 ── */
export type Language = 'zh-CN' | 'en';
export type ResolutionSetting = 'auto' | '800x600' | '1280x720' | '1920x1080';
export const RESOLUTION_PRESETS = ['800x600', '1280x720', '1920x1080'] as const;

export interface GameResolution {
  width: number;
  height: number;
}

export interface SettingsState {
  bgmVolume: number;
  sfxVolume: number;
  muted: boolean;
  language: Language;
  resolution: ResolutionSetting;
}

/* ── 引擎抽象 ── */
export interface IGameEngineShell {
  resize(width: number, height: number): void;
  destroy(): void;
}
