<template>
  <TresPerspectiveCamera
    :position="[camPos.x, camPos.y, camPos.z]"
    :look-at="[playerPos.x, playerPos.y + CAMERA_LOOK_AT_OFFSET_Y, playerPos.z]"
  />

  <TresAmbientLight :intensity="AMBIENT_LIGHT_INTENSITY" />
  <TresDirectionalLight
    :position="[...DIRECTIONAL_LIGHT_POSITION]"
    :intensity="DIRECTIONAL_LIGHT_INTENSITY"
    cast-shadow
  />

  <GroundGrid />
  <PlayerCube :position="playerPos" />
  <StarItemMesh v-for="star in stars" :key="star.id" :star="star" :rotation="starRot" />
</template>

<script setup lang="ts">
import { useLoop } from '@tresjs/core';
import { CAMERA_LOOK_AT_OFFSET_Y, useGame } from '@/shared/runtime';
import { GroundGrid, PlayerCube, StarItemMesh } from '../components';
import {
  AMBIENT_LIGHT_INTENSITY,
  DIRECTIONAL_LIGHT_INTENSITY,
  DIRECTIONAL_LIGHT_POSITION,
} from './constants';

const { camPos, playerPos, stars, starRot, step } = useGame();

const { onBeforeRender } = useLoop();
onBeforeRender(({ delta }) => step(delta));
</script>
