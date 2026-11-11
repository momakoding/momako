<template>
  <GameShellLayout :score="score" :round="completedRounds">
    <template #game>
      <div class="game-page__canvas">
        <TresCanvas window-size :clear-color="CLEAR_COLOR" shadows>
          <MainScene />
        </TresCanvas>
      </div>
    </template>
  </GameShellLayout>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { TresCanvas } from '@tresjs/core';
import { GameShellLayout } from '@momako/hud';
import { useGame } from '@/shared/runtime';
import { CLEAR_COLOR, MainScene } from '../scenes';

const { score, completedRounds, start, stop } = useGame();

onMounted(start);
onUnmounted(stop);
</script>

<style scoped>
@reference "@/style.css";

.game-page__canvas {
  @apply relative h-full w-full overflow-hidden;
}
</style>
