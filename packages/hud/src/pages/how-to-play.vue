<template>
  <div class="how-to-play">
    <header class="how-to-play__hero">
      <p class="how-to-play__eyebrow">{{ t('howToPlay.eyebrow') }}</p>
      <h2 class="how-to-play__title">{{ t('howToPlay.title') }}</h2>
      <div class="how-to-play__line" aria-hidden="true" />
    </header>

    <div class="how-to-play__content" v-html="contentHtml" />

    <GameButton
      :label="fromStart ? t('howToPlay.start') : t('common.backHome')"
      @click="handleAction"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, inject, ref, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { marked } from 'marked';
import GameButton from '../components/game-button.vue';

const route = useRoute();
const router = useRouter();
const { t, locale } = useI18n();

const customGetMarkdown = inject<((loc: string) => string) | null>('jam:get-how-to-play', null);

const fromStart = computed(() => route.query.from === 'start');

const contentHtml = ref('');
watchEffect(async () => {
  let raw = '';
  if (customGetMarkdown) {
    raw = customGetMarkdown(locale.value);
  } else {
    try {
      const msg = t('meta.howToPlay');
      raw = msg && msg !== 'meta.howToPlay' ? msg : defaultMarkdown();
    } catch {
      raw = defaultMarkdown();
    }
  }
  contentHtml.value = await marked.parse(raw);
});

function defaultMarkdown(): string {
  return locale.value === 'zh-CN'
    ? '### 玩法说明\n\n- 使用方向键或 **WASD** 控制角色移动与跳跃\n- 收集地图中的星星以完成关卡\n- 随时按 **ESC** 暂停游戏或调整设置'
    : '### Instructions\n\n- Use Arrow keys or **WASD** to move and jump\n- Collect all stars to complete the round\n- Press **ESC** anytime to pause and tweak settings';
}

function handleAction() {
  if (fromStart.value) {
    router.push({ name: 'game' });
  } else {
    router.push({ name: 'home' });
  }
}
</script>

<style scoped>
@reference "../styles/hud.css";

.how-to-play {
  @apply flex min-h-screen w-screen flex-col items-center justify-center gap-10 px-6 py-14 overflow-y-auto bg-(--color-bg-page);
}

.how-to-play__hero {
  @apply page-hero;
}

.how-to-play__eyebrow {
  @apply page-eyebrow;
}

.how-to-play__title {
  @apply page-title;
}

.how-to-play__line {
  @apply page-hero-line;
}

.how-to-play__content {
  @apply w-full max-w-lg text-(--color-text-secondary) leading-relaxed;
}

.how-to-play__content :deep(h1),
.how-to-play__content :deep(h2),
.how-to-play__content :deep(h3) {
  @apply text-(--color-accent-light) mt-4 mb-2 font-semibold;
}

.how-to-play__content :deep(ul) {
  @apply list-disc pl-6 mb-4;
}

.how-to-play__content :deep(strong) {
  @apply text-(--color-text-primary);
}
</style>
