<template>
  <div class="settings-page">
    <header class="settings-page__hero">
      <p class="settings-page__eyebrow">{{ t('settings.eyebrow') }}</p>
      <h2 class="settings-page__title">{{ t('settings.title') }}</h2>
      <div class="settings-page__line" aria-hidden="true" />
    </header>

    <div class="settings-page__panel">
      <SettingsPanel />
    </div>

    <GameButton :label="t('common.backHome')" variant="secondary" @click="router.push({ name: 'home' })" />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import GameButton from '../components/game-button.vue';
import SettingsPanel from '../components/settings-panel.vue';

const router = useRouter();
const { t } = useI18n();
</script>

<style scoped>
@reference "../styles/hud.css";

.settings-page {
  @apply flex min-h-screen w-screen flex-col items-center justify-center gap-10 px-6 py-14 overflow-y-auto bg-(--color-bg-page);
}

.settings-page__hero {
  @apply page-hero;
}

.settings-page__eyebrow {
  @apply page-eyebrow;
}

.settings-page__title {
  @apply page-title;
}

.settings-page__line {
  @apply page-hero-line;
}

.settings-page__panel {
  @apply w-full max-w-md;
}
</style>
