import { createI18n } from 'vue-i18n';
import zhCN from './locales/zh-CN';
import en from './locales/en';

export interface JamI18nOptions {
  locale?: string;
  fallbackLocale?: string;
  messages?: {
    'zh-CN'?: Record<string, unknown>;
    en?: Record<string, unknown>;
  };
}

export function createJamI18n(options: JamI18nOptions = {}) {
  const i18n = createI18n({
    legacy: false,
    locale: options.locale ?? 'zh-CN',
    fallbackLocale: options.fallbackLocale ?? 'zh-CN',
    messages: {
      'zh-CN': {
        ...zhCN,
        ...(options.messages?.['zh-CN'] ?? {}),
      },
      en: {
        ...en,
        ...(options.messages?.en ?? {}),
      },
    },
  });

  return i18n;
}

export { zhCN, en };
