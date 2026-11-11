<template>
  <GameShellLayout :score="score" :round="completedRounds">
    <template #game>
      <div ref="gameContainer" class="phaser-canvas-container" />
    </template>
  </GameShellLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { BootScene, GameScene, SCENE_KEYS } from '@/scenes';
import { EVENT_KEYS, useEventBus } from '@momako-jam/core';
import { GameShellLayout, useSettingsStore } from '@momako-jam/hud';
import { useGame } from '@/runtime/game';

const gameContainer = ref<HTMLDivElement>();
const score = ref(0);
const completedRounds = ref(0);
const eventBus = useEventBus();
const game = useGame();
const settings = useSettingsStore();

const onScoreUpdate = (newScore: unknown) => {
  score.value = newScore as number;
};

const onRoundUpdate = (newRound: unknown) => {
  completedRounds.value = newRound as number;
};

onMounted(() => {
  if (!gameContainer.value) return;

  eventBus.on(EVENT_KEYS.SCORE_UPDATE, onScoreUpdate);
  eventBus.on(EVENT_KEYS.ROUND_UPDATE, onRoundUpdate);

  game.initGame(gameContainer.value, BootScene);
  game.addScene(GameScene);

  game.resizeGame(settings.gameResolution.width, settings.gameResolution.height);
});

watch(
  () => settings.resolution,
  () => {
    game.resizeGame(settings.gameResolution.width, settings.gameResolution.height);
    game.restartScene(SCENE_KEYS.GAME, { startScore: 0 });
  }
);

onUnmounted(() => {
  eventBus.off(EVENT_KEYS.SCORE_UPDATE, onScoreUpdate);
  eventBus.off(EVENT_KEYS.ROUND_UPDATE, onRoundUpdate);
  game.destroyGame(true);
});
</script>

<style scoped>
@reference "@/style.css";

.phaser-canvas-container {
  @apply relative h-full w-full overflow-hidden flex items-center justify-center;
}

.phaser-canvas-container :deep(canvas) {
  @apply block mx-auto;
}
</style>
