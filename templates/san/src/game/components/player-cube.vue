<template>
  <TresMesh :position="[position.x, position.y, position.z]" cast-shadow>
    <TresBoxGeometry :args="[PLAYER_SIZE, PLAYER_SIZE, PLAYER_SIZE]" />
    <TresMeshStandardMaterial
      :color="PLAYER_MATERIAL.color"
      :roughness="PLAYER_MATERIAL.roughness"
      :metalness="PLAYER_MATERIAL.metalness"
      :emissive="PLAYER_MATERIAL.emissive"
      :emissive-intensity="PLAYER_MATERIAL.emissiveIntensity"
    />
  </TresMesh>
</template>

<script setup lang="ts">
import type { Vec3 } from '@/shared/runtime';
import { PLAYER_MATERIAL, PLAYER_SIZE } from '../scenes/constants';

defineProps<{
  /** 玩家世界坐标 */
  position: Vec3;
}>();
</script>
