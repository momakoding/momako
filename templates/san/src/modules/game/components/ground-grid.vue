<template>
  <TresMesh :rotation="[-Math.PI / 2, 0, 0]" receive-shadow>
    <TresPlaneGeometry :args="[GROUND_SIZE, GROUND_SIZE]" />
    <TresMeshStandardMaterial :color="GROUND_COLOR" :roughness="GROUND_ROUGHNESS" />
  </TresMesh>
  <TresGridHelper
    :args="[GROUND_SIZE, GRID_DIVISIONS, GRID_CENTER_COLOR, GRID_LINE_COLOR]"
    :position="[0, GRID_LIFT, 0]"
  />
</template>

<script setup lang="ts">
import {
  GRID_CENTER_COLOR,
  GRID_DIVISIONS,
  GRID_LIFT,
  GRID_LINE_COLOR,
  GROUND_COLOR,
  GROUND_ROUGHNESS,
  GROUND_SIZE,
} from '../scenes/constants';
</script>
