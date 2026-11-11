<template>
  <GameShellLayout :score="score" :round="completedRounds">
    <template #game>
      <div class="tres-wrapper">
        <TresCanvas window-size clear-color="#0f172a" shadows>
          <TresPerspectiveCamera
            :position="[camPos.x, camPos.y, camPos.z]"
            :look-at="[playerPos.x, playerPos.y + 0.5, playerPos.z]"
          />

          <!-- 灯光 -->
          <TresAmbientLight :intensity="0.8" />
          <TresDirectionalLight
            :position="[10, 20, 15]"
            :intensity="1.5"
            cast-shadow
          />

          <!-- 地面 -->
          <TresMesh :rotation="[-Math.PI / 2, 0, 0]" receive-shadow>
            <TresPlaneGeometry :args="[60, 60]" />
            <TresMeshStandardMaterial color="#1e293b" :roughness="0.8" />
          </TresMesh>
          <TresGridHelper :args="[60, 30, '#f59e0b', '#334155']" :position="[0, 0.01, 0]" />

          <!-- 玩家 (立方体) -->
          <TresMesh
            :position="[playerPos.x, playerPos.y, playerPos.z]"
            cast-shadow
          >
            <TresBoxGeometry :args="[1, 1, 1]" />
            <TresMeshStandardMaterial
              color="#38bdf8"
              :roughness="0.3"
              :metalness="0.2"
              emissive="#0284c7"
              :emissive-intensity="0.3"
            />
          </TresMesh>

          <!-- 金色八面体星星 -->
          <TresMesh
            v-for="star in stars"
            :key="star.id"
            :position="[star.x, star.y, star.z]"
            :rotation="[starRot, starRot * 2, 0]"
            cast-shadow
          >
            <TresOctahedronGeometry :args="[0.5]" />
            <TresMeshStandardMaterial
              color="#fbbf24"
              emissive="#f59e0b"
              :emissive-intensity="0.7"
              :roughness="0.2"
              :metalness="0.8"
            />
          </TresMesh>
        </TresCanvas>
      </div>
    </template>
  </GameShellLayout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue';
import { TresCanvas, useLoop } from '@tresjs/core';
import { GameShellLayout } from '@momako-jam/hud';
import { EVENT_KEYS, useEventBus } from '@momako-jam/core';

interface StarItem {
  id: number;
  x: number;
  y: number;
  z: number;
}

const score = ref(0);
const completedRounds = ref(0);
const eventBus = useEventBus();
const isPaused = ref(false);

// 玩家物理与位置
const playerPos = reactive({ x: 0, y: 0.5, z: 0 });
const playerVelY = ref(0);
const isGrounded = ref(true);

// 相机跟随平滑坐标
const camPos = reactive({ x: 0, y: 7, z: 10 });

// 星星数据
const stars = ref<StarItem[]>([]);
const starRot = ref(0);
let starIdCounter = 0;

function spawnStars(count: number) {
  const newStars: StarItem[] = [];
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    const radius = 5 + Math.random() * 8;
    newStars.push({
      id: ++starIdCounter,
      x: Math.cos(angle) * radius,
      y: 0.8 + Math.random() * 0.5,
      z: Math.sin(angle) * radius,
    });
  }
  stars.value = newStars;
}

// 键盘控制
const keys: Record<string, boolean> = {};

const onKeyDown = (e: KeyboardEvent) => {
  keys[e.code] = true;
};

const onKeyUp = (e: KeyboardEvent) => {
  keys[e.code] = false;
};

// 游戏循环 (TresJS useLoop)
const { onBeforeRender } = useLoop();

onBeforeRender(({ delta }) => {
  if (isPaused.value) return;

  const dt = Math.min(delta, 0.1);

  // 1. 键盘位移
  const moveSpeed = 8;
  let mx = 0;
  let mz = 0;
  if (keys['KeyW'] || keys['ArrowUp']) mz -= 1;
  if (keys['KeyS'] || keys['ArrowDown']) mz += 1;
  if (keys['KeyA'] || keys['ArrowLeft']) mx -= 1;
  if (keys['KeyD'] || keys['ArrowRight']) mx += 1;

  if (mx !== 0 || mz !== 0) {
    const len = Math.hypot(mx, mz);
    playerPos.x += (mx / len) * moveSpeed * dt;
    playerPos.z += (mz / len) * moveSpeed * dt;
  }

  // 2. 跳跃与重力
  const gravity = -20;
  if ((keys['Space'] || keys['KeyK']) && isGrounded.value) {
    playerVelY.value = 8;
    isGrounded.value = false;
  }

  playerVelY.value += gravity * dt;
  playerPos.y += playerVelY.value * dt;

  if (playerPos.y <= 0.5) {
    playerPos.y = 0.5;
    playerVelY.value = 0;
    isGrounded.value = true;
  }

  // 3. 边界限制
  playerPos.x = Math.max(-25, Math.min(25, playerPos.x));
  playerPos.z = Math.max(-25, Math.min(25, playerPos.z));

  // 4. 星星旋转与碰撞检测
  starRot.value += 2 * dt;

  for (let i = stars.value.length - 1; i >= 0; i--) {
    const s = stars.value[i]!;
    const dist = Math.hypot(playerPos.x - s.x, playerPos.y - s.y, playerPos.z - s.z);

    if (dist < 1.1) {
      stars.value.splice(i, 1);
      score.value += 10;
      eventBus.emit(EVENT_KEYS.SCORE_UPDATE, score.value);

      if (stars.value.length === 0) {
        completedRounds.value += 1;
        eventBus.emit(EVENT_KEYS.ROUND_UPDATE, completedRounds.value);
        spawnStars(8 + completedRounds.value * 2);
      }
    }
  }

  // 5. 平滑相机跟随
  const targetCamX = playerPos.x;
  const targetCamY = playerPos.y + 6;
  const targetCamZ = playerPos.z + 9;

  camPos.x += (targetCamX - camPos.x) * 5 * dt;
  camPos.y += (targetCamY - camPos.y) * 5 * dt;
  camPos.z += (targetCamZ - camPos.z) * 5 * dt;
});

// EventBus 事件响应
const handlePause = () => {
  isPaused.value = true;
};

const handleResume = () => {
  isPaused.value = false;
};

const handleRestart = () => {
  score.value = 0;
  completedRounds.value = 0;
  playerPos.x = 0;
  playerPos.y = 0.5;
  playerPos.z = 0;
  playerVelY.value = 0;
  spawnStars(8);
  eventBus.emit(EVENT_KEYS.SCORE_UPDATE, score.value);
  eventBus.emit(EVENT_KEYS.ROUND_UPDATE, completedRounds.value);
};

onMounted(() => {
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);

  eventBus.on(EVENT_KEYS.GAME_PAUSE, handlePause);
  eventBus.on(EVENT_KEYS.GAME_RESUME, handleResume);
  eventBus.on(EVENT_KEYS.GAME_RESTART, handleRestart);

  spawnStars(8);
  eventBus.emit(EVENT_KEYS.SCORE_UPDATE, score.value);
  eventBus.emit(EVENT_KEYS.ROUND_UPDATE, completedRounds.value);
});

onUnmounted(() => {
  window.removeEventListener('keydown', onKeyDown);
  window.removeEventListener('keyup', onKeyUp);

  eventBus.off(EVENT_KEYS.GAME_PAUSE, handlePause);
  eventBus.off(EVENT_KEYS.GAME_RESUME, handleResume);
  eventBus.off(EVENT_KEYS.GAME_RESTART, handleRestart);
});
</script>

<style scoped>
@reference "@/style.css";

.tres-wrapper {
  @apply relative h-full w-full overflow-hidden;
}
</style>
