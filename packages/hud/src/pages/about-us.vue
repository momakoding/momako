<template>
  <div class="about-us-page">
    <ScrollableContent>
      <div class="about-us-content">
        <header class="about-us__hero">
          <p class="about-us__eyebrow">{{ t('aboutUs.credits') }}</p>
          <h2 class="about-us__title">{{ t('aboutUs.title') }}</h2>
          <div class="about-us__line" aria-hidden="true" />
        </header>

        <div class="about-us__cards">
          <!-- 团队卡片 -->
          <section class="about-card">
            <p class="about-card__eyebrow">{{ t('aboutUs.team') }}</p>
            <h3 class="about-card__heading">{{ teamInfo.teamName }}</h3>
            <p v-if="teamInfo.description" class="about-card__text">{{ teamInfo.description }}</p>

            <ul v-if="teamInfo.members?.length" class="about-card__members">
              <li v-for="m in teamInfo.members" :key="m.name" class="member-row">
                <span class="member-row__name">{{ m.name }}</span>
                <span class="member-row__role">{{ m.role }}</span>
              </li>
            </ul>
          </section>

          <!-- 游戏卡片 -->
          <section v-if="gameMeta.showGameCard" class="about-card">
            <p class="about-card__eyebrow">{{ t('aboutUs.game') }}</p>
            <h3 class="about-card__heading">{{ gameMeta.title }}</h3>
            <p v-if="gameMeta.description" class="about-card__text">{{ gameMeta.description }}</p>
            <div v-if="gameMeta.tags?.length" class="about-card__tags">
              <span v-for="tag in gameMeta.tags" :key="tag" class="game-tag">{{ tag }}</span>
            </div>
          </section>
        </div>

        <!-- 开源技术 -->
        <section class="about-card">
          <div class="oss-header">
            <p class="about-card__eyebrow">{{ t('aboutUs.oss.title') }}</p>
            <h3 class="oss-title">{{ t('aboutUs.oss.headline') }}</h3>
            <p class="about-card__text">{{ t('aboutUs.oss.desc') }}</p>
          </div>

          <div class="oss-body">
            <MmkdStarterCredit />

            <div v-if="credits.length" class="oss-deps">
              <p class="about-card__eyebrow">{{ t('aboutUs.oss.deps') }}</p>
              <ul class="oss-list">
                <li v-for="oss in credits" :key="oss.name" class="oss-item">
                  <span class="oss-item__name">{{ oss.name }}</span>
                  <span class="oss-item__desc">{{ oss.desc }}</span>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>

      <template #footer>
        <div class="about-us__actions">
          <GameButton :label="t('common.backHome')" variant="secondary" @click="goHome" />
        </div>
      </template>
    </ScrollableContent>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import type { GameMeta, TeamInfo } from '@momako/core';
import GameButton from '../components/game-button.vue';
import MmkdStarterCredit from '../components/mmkd-starter-credit.vue';
import ScrollableContent from '../components/scrollable-content.vue';

const router = useRouter();
const { t, tm, locale } = useI18n();

const customGetCredits = inject<((loc: string) => Array<{ name: string; desc: string }>) | null>('jam:get-oss-credits', null);

const gameMeta = computed(() => (tm('meta.game') ?? {}) as GameMeta);
const teamInfo = computed(() => (tm('meta.team') ?? {}) as TeamInfo);
const credits = computed(() => (customGetCredits ? customGetCredits(locale.value) : []));

function goHome() {
  router.push({ name: 'home' });
}
</script>

<style scoped>
@reference "../styles/hud.css";

.about-us-page {
  @apply relative h-screen w-screen bg-(--color-bg-page);
}

.about-us-content {
  @apply flex flex-col items-center gap-8 px-6 py-14 max-w-3xl mx-auto;
}

.about-us__hero {
  @apply page-hero;
}

.about-us__eyebrow {
  @apply page-eyebrow;
}

.about-us__title {
  @apply page-title;
}

.about-us__line {
  @apply page-hero-line;
}

.about-us__cards {
  @apply w-full flex flex-col gap-6 md:flex-row md:items-stretch;
}

.about-us__cards > .about-card {
  @apply md:flex-1;
}

.about-card {
  @apply w-full rounded-xl border border-(--color-border-subtle)/70 bg-(--color-bg-surface)/50 p-6 flex flex-col gap-3;
}

.about-card__eyebrow {
  @apply text-xs font-bold tracking-wider uppercase text-(--color-accent);
}

.about-card__heading {
  @apply text-xl font-bold text-(--color-text-primary);
}

.about-card__text {
  @apply text-sm text-(--color-text-secondary) leading-relaxed;
}

.about-card__members {
  @apply list-none m-0 p-0 flex flex-col gap-2;
}

.member-row {
  @apply flex items-center justify-between rounded-md bg-slate-950/40 px-3 py-2;
}

.member-row__name {
  @apply text-sm font-semibold text-(--color-text-primary);
}

.member-row__role {
  @apply text-xs text-(--color-text-secondary);
}

.about-card__tags {
  @apply flex flex-wrap gap-2;
}

.game-tag {
  @apply game-tag;
}

.oss-header {
  @apply flex flex-col gap-1;
}

.oss-title {
  @apply text-lg font-bold text-(--color-text-primary);
}

.oss-body {
  @apply flex flex-col gap-5;
}

.oss-deps {
  @apply flex flex-col gap-2;
}

.oss-list {
  @apply list-none m-0 p-0 flex flex-col gap-1.5;
}

.oss-item {
  @apply flex justify-between text-xs;
}

.oss-item__name {
  @apply font-semibold text-(--color-text-primary);
}

.oss-item__desc {
  @apply text-(--color-text-muted);
}

.about-us__actions {
  @apply flex w-full justify-center border-t border-(--color-border-subtle)/70 bg-(--color-bg-page)/80 p-4 backdrop-blur;
}
</style>
