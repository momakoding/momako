<template>
  <TresMesh
    :position="[star.x, star.y, star.z]"
    :rotation="[rotation, rotation * STAR_SPIN_Y_FACTOR, 0]"
    cast-shadow
  >
    <TresOctahedronGeometry :args="[STAR_SIZE]" />
    <TresMeshStandardMaterial
      :color="STAR_MATERIAL.color"
      :emissive="STAR_MATERIAL.emissive"
      :emissive-intensity="STAR_MATERIAL.emissiveIntensity"
      :roughness="STAR_MATERIAL.roughness"
      :metalness="STAR_MATERIAL.metalness"
    />
  </TresMesh>
</template>

<script setup lang="ts">
import { STAR_MATERIAL, STAR_SIZE, STAR_SPIN_Y_FACTOR } from '../scenes/constants';
import type { StarItem } from '../scenes/types';

defineProps<{
  /** 星星数据 */
  star: StarItem;
  /** 当前自转角度（弧度） */
  rotation: number;
}>();
</script>
