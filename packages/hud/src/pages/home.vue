<template>
  <div class="home-page">
    <h1 class="home-page__title">{{ t('meta.game.title') }}</h1>
    <p v-if="subtitleVisible" class="home-page__subtitle">
      {{ t('meta.game.subtitle') }}
    </p>

    <nav class="home-page__nav">
      <GameButton
        v-for="item in menuItems"
        :key="item.label"
        :label="t(item.label)"
        :variant="item.variant"
        @click="item.onClick"
      />
    </nav>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import GameButton from '../components/game-button.vue';

const router = useRouter();
const { t } = useI18n();

const menuItems = [
  {
    label: 'home.startGame',
    variant: 'primary' as const,
    onClick: () => router.push({ name: 'how-to-play', query: { from: 'start' } }),
  },
  {
    label: 'home.howToPlay',
    variant: 'secondary' as const,
    onClick: () => router.push({ name: 'how-to-play', query: { from: 'menu' } }),
  },
  {
    label: 'home.settings',
    variant: 'secondary' as const,
    onClick: () => router.push({ name: 'settings' }),
  },
  {
    label: 'home.aboutUs',
    variant: 'secondary' as const,
    onClick: () => router.push({ name: 'about-us' }),
  },
  {
    label: 'home.exitGame',
    variant: 'secondary' as const,
    onClick: () => {
      window.close();
      window.location.href = 'about:blank';
    },
  },
] as const;

const subtitleVisible = computed(() => {
  try {
    return t('meta.game.subtitle') !== 'meta.game.subtitle' && t('meta.game.subtitle') !== '';
  } catch {
    return false;
  }
});
</script>

<style scoped>
@reference "../styles/hud.css";

.home-page {
  @apply flex h-screen w-screen flex-col items-center justify-center gap-12 bg-(--color-bg-page) select-none;
}

.home-page__title {
  @apply text-5xl font-extrabold tracking-widest text-(--color-accent-light) text-center;
}

.home-page__subtitle {
  @apply text-lg text-(--color-text-secondary) -mt-8 text-center;
}

.home-page__nav {
  @apply flex flex-col items-center gap-4;
}
</style>
