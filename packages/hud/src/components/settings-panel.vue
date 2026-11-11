<template>
  <div class="settings-panel">
    <!-- Audio -->
    <section class="settings-panel__section">
      <h3 class="settings-panel__section-title">{{ t('settings.audio.title') }}</h3>

      <div class="settings-panel__row">
        <label class="settings-panel__label">{{ t('settings.audio.muted') }}</label>
        <button
          class="settings-panel__toggle"
          :class="{ 'settings-panel__toggle-on': settings.muted }"
          @click="settings.muted = !settings.muted"
        >
          <span class="settings-panel__toggle-knob" />
        </button>
      </div>

      <div class="settings-panel__row" :class="{ 'settings-panel__row-disabled': settings.muted }">
        <label class="settings-panel__label">{{ t('settings.audio.bgm') }}</label>
        <div class="settings-panel__slider-wrap">
          <input
            v-model.number="settings.bgmVolume"
            type="range"
            min="0"
            max="100"
            step="1"
            class="settings-panel__slider"
            :disabled="settings.muted"
          />
          <span class="settings-panel__slider-value">{{ settings.bgmVolume }}</span>
        </div>
      </div>

      <div class="settings-panel__row" :class="{ 'settings-panel__row-disabled': settings.muted }">
        <label class="settings-panel__label">{{ t('settings.audio.sfx') }}</label>
        <div class="settings-panel__slider-wrap">
          <input
            v-model.number="settings.sfxVolume"
            type="range"
            min="0"
            max="100"
            step="1"
            class="settings-panel__slider"
            :disabled="settings.muted"
          />
          <span class="settings-panel__slider-value">{{ settings.sfxVolume }}</span>
        </div>
      </div>
    </section>

    <!-- Resolution -->
    <section class="settings-panel__section">
      <h3 class="settings-panel__section-title">{{ t('settings.resolution.title') }}</h3>
      <div class="settings-panel__row">
        <label class="settings-panel__label">{{ t('settings.resolution.label') }}</label>
        <div class="settings-panel__option-group">
          <button
            v-for="res in resolutions"
            :key="res.value"
            class="settings-panel__option-btn"
            :class="{ 'settings-panel__option-btn-active': settings.resolution === res.value }"
            @click="settings.resolution = res.value"
          >
            {{ res.label }}
          </button>
        </div>
      </div>
      <p class="settings-panel__hint">{{ t('settings.resolution.autoDesc') }}</p>
    </section>

    <!-- Language -->
    <section class="settings-panel__section">
      <h3 class="settings-panel__section-title">{{ t('settings.language.title') }}</h3>
      <div class="settings-panel__row">
        <label class="settings-panel__label">{{ t('settings.language.label') }}</label>
        <div class="settings-panel__option-group">
          <button
            v-for="lang in languages"
            :key="lang.value"
            class="settings-panel__option-btn"
            :class="{ 'settings-panel__option-btn-active': settings.language === lang.value }"
            @click="setLanguage(lang.value)"
          >
            {{ lang.label }}
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import {
  useSettingsStore,
  RESOLUTION_PRESETS,
  type Language,
  type ResolutionSetting,
} from '../stores/settings-store';

const { t, locale } = useI18n();
const settings = useSettingsStore();

const setLanguage = (lang: Language) => {
  settings.language = lang;
  locale.value = lang;
};

const resolutions = computed<{ value: ResolutionSetting; label: string }[]>(() => [
  { value: 'auto', label: t('settings.resolution.auto') },
  ...RESOLUTION_PRESETS.map((p) => ({ value: p as ResolutionSetting, label: t(`settings.resolution.${p}`) })),
]);

const languages: { value: Language; label: string }[] = [
  { value: 'zh-CN', label: '简体中文' },
  { value: 'en', label: 'English' },
];
</script>

<style scoped>
@reference "../styles/hud.css";

.settings-panel {
  @apply flex flex-col gap-6;
}

.settings-panel__section {
  @apply flex flex-col gap-3 rounded-xl border border-slate-700/70 bg-slate-800/40 p-5;
}

.settings-panel__section-title {
  @apply text-xs font-bold tracking-wider uppercase text-amber-400;
}

.settings-panel__row {
  @apply flex items-center justify-between gap-4;
}

.settings-panel__row-disabled {
  @apply opacity-40 pointer-events-none;
}

.settings-panel__label {
  @apply text-sm text-slate-300;
}

.settings-panel__toggle {
  @apply relative h-6 w-11 cursor-pointer rounded-full bg-slate-600 transition-colors duration-200 border-none;
}

.settings-panel__toggle-on {
  @apply bg-amber-600;
}

.settings-panel__toggle-knob {
  @apply absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform duration-200;
}

.settings-panel__toggle-on .settings-panel__toggle-knob {
  @apply translate-x-5;
}

.settings-panel__slider-wrap {
  @apply flex items-center gap-3;
}

.settings-panel__slider {
  @apply h-1.5 w-32 cursor-pointer accent-amber-500;
}

.settings-panel__slider-value {
  @apply w-8 text-right font-mono text-sm text-slate-400;
}

.settings-panel__option-group {
  @apply flex flex-wrap gap-1.5;
}

.settings-panel__option-btn {
  @apply cursor-pointer rounded-md border border-slate-600/70 bg-slate-900/50 px-2.5 py-1 text-xs text-slate-400 transition-all hover:border-slate-400 hover:text-slate-100;
}

.settings-panel__option-btn-active {
  @apply border-amber-500 bg-amber-500/15 text-amber-400;
}

.settings-panel__hint {
  @apply text-xs text-slate-500;
}
</style>
