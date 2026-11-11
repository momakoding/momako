<template>
  <div class="game-shell-layout">
    <!-- 游戏画布挂载槽位 -->
    <div class="game-shell-layout__viewport">
      <slot name="game" />

      <!-- HUD 状态条 -->
      <div class="game-shell-layout__hud">
        <div class="game-shell-layout__scoreboard">
          <span v-if="showScore" class="game-shell-layout__score">
            {{ t('meta.hud.score') }} {{ score }}
          </span>
          <span v-if="showRound" class="game-shell-layout__round">
            {{ t('meta.hud.roundsDone') }} {{ round }}
          </span>
          <slot name="hud-extra" />
        </div>
      </div>
    </div>

    <!-- 暂停遮罩 -->
    <Transition name="fade">
      <div v-if="isPaused" class="game-shell-layout__overlay">
        <div class="game-shell-layout__pause-panel">
          <h2 class="game-shell-layout__pause-title">{{ t('meta.hud.pauseTitle') }}</h2>
          <div class="game-shell-layout__pause-divider" aria-hidden="true" />
          <GameButton
            v-for="item in menuActions"
            :key="item.label"
            :label="t(item.label)"
            :variant="item.variant"
            @click="item.onClick"
          />
        </div>
      </div>
    </Transition>

    <!-- 设置弹层（游戏内 Modal） -->
    <Transition name="fade">
      <div v-if="isSettingsOpen" class="game-shell-layout__overlay" @click.self="isSettingsOpen = false">
        <div class="game-shell-layout__settings-modal">
          <div class="game-shell-layout__settings-head">
            <h2 class="game-shell-layout__settings-title">{{ t('meta.hud.settings') }}</h2>
            <button class="game-shell-layout__settings-close" @click="isSettingsOpen = false">✕</button>
          </div>
          <SettingsPanel class="game-shell-layout__settings-body" />
        </div>
      </div>
    </Transition>

    <!-- 暂停触发按钮 -->
    <button
      v-if="!isPaused"
      class="game-shell-layout__pause-trigger"
      :aria-label="t('meta.hud.pause')"
      @click="pauseGame"
    >
      <Pause :size="18" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { Pause } from 'lucide-vue-next';
import { useEventBus, EVENT_KEYS } from '@momako-jam/core';
import GameButton from './game-button.vue';
import SettingsPanel from './settings-panel.vue';

interface Props {
  score?: number;
  round?: number;
  showScore?: boolean;
  showRound?: boolean;
  homeRouteName?: string;
}

const props = withDefaults(defineProps<Props>(), {
  score: 0,
  round: 0,
  showScore: true,
  showRound: true,
  homeRouteName: 'home',
});

const emit = defineEmits<{
  (e: 'pause'): void;
  (e: 'resume'): void;
  (e: 'restart'): void;
}>();

const router = useRouter();
const { t } = useI18n();
const eventBus = useEventBus();

const isPaused = ref(false);
const isSettingsOpen = ref(false);

const pauseGame = () => {
  isPaused.value = true;
  eventBus.emit(EVENT_KEYS.GAME_PAUSE);
  emit('pause');
};

const resumeGame = () => {
  isPaused.value = false;
  eventBus.emit(EVENT_KEYS.GAME_RESUME);
  emit('resume');
};

const restartGame = () => {
  isPaused.value = false;
  eventBus.emit(EVENT_KEYS.GAME_RESUME);
  eventBus.emit(EVENT_KEYS.GAME_RESTART);
  emit('restart');
};

const menuActions = [
  { label: 'meta.hud.resume', variant: 'primary' as const, onClick: resumeGame },
  { label: 'meta.hud.restart', variant: 'secondary' as const, onClick: restartGame },
  {
    label: 'meta.hud.settings',
    variant: 'secondary' as const,
    onClick: () => {
      isSettingsOpen.value = true;
    },
  },
  {
    label: 'meta.hud.exitToTitle',
    variant: 'secondary' as const,
    onClick: () => {
      resumeGame();
      router.push({ name: props.homeRouteName });
    },
  },
];

const onKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    if (isSettingsOpen.value) {
      isSettingsOpen.value = false;
    } else if (isPaused.value) {
      resumeGame();
    } else {
      pauseGame();
    }
  }
};

onMounted(() => {
  window.addEventListener('keydown', onKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', onKeyDown);
});
</script>

<style scoped>
@reference "../styles/hud.css";

.game-shell-layout {
  @apply relative h-screen w-screen overflow-hidden bg-slate-950 select-none;
}

.game-shell-layout__viewport {
  @apply relative h-full w-full flex items-center justify-center;
}

.game-shell-layout__hud {
  @apply pointer-events-none absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-5 py-3;
}

.game-shell-layout__scoreboard {
  @apply flex items-center gap-4;
}

.game-shell-layout__score {
  @apply text-lg font-bold text-amber-400;
}

.game-shell-layout__round {
  @apply text-sm font-bold text-slate-400;
}

.game-shell-layout__overlay {
  @apply absolute inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm;
}

.game-shell-layout__pause-panel {
  @apply flex w-88 flex-col items-center gap-3 rounded-2xl border border-slate-700/80 bg-slate-900/95 px-6 py-8 shadow-2xl;
}

.game-shell-layout__pause-title {
  @apply text-2xl font-bold tracking-wide text-slate-50;
}

.game-shell-layout__pause-divider {
  @apply mb-2 h-px w-12;
  background: linear-gradient(90deg, transparent, #f59e0b, transparent);
}

.game-shell-layout__pause-trigger {
  @apply absolute top-4 right-4 z-20 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-slate-600/60 bg-slate-900/70 text-slate-300 backdrop-blur-sm transition-all hover:border-amber-500 hover:text-amber-400;
}

.game-shell-layout__settings-modal {
  @apply flex max-h-[85vh] w-[90vw] max-w-lg flex-col rounded-2xl border border-slate-700/80 bg-slate-900/95 shadow-2xl;
}

.game-shell-layout__settings-head {
  @apply flex items-center justify-between border-b border-slate-700/60 px-6 py-4;
}

.game-shell-layout__settings-title {
  @apply text-lg font-bold text-slate-50;
}

.game-shell-layout__settings-close {
  @apply cursor-pointer border-none bg-transparent text-xl text-slate-400 hover:text-slate-100;
}

.game-shell-layout__settings-body {
  @apply overflow-y-auto p-6;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
