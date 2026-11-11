<script setup lang="ts">
interface Props {
  label: string;
  variant?: 'primary' | 'secondary' | 'danger';
}

withDefaults(defineProps<Props>(), {
  variant: 'primary',
});
</script>

<template>
  <button
    class="game-button"
    :class="{
      'game-button-primary': variant === 'primary',
      'game-button-secondary': variant === 'secondary',
      'game-button-danger': variant === 'danger',
    }"
  >
    {{ label }}
  </button>
</template>

<style scoped>
@reference "../styles/hud.css";

.game-button {
  @apply min-w-48 cursor-pointer rounded-lg px-8 py-3 text-lg font-semibold tracking-wide text-center transition-all duration-200 select-none;
}

.game-button-primary {
  @apply bg-(--color-accent) text-(--color-text-dark) hover:bg-(--color-accent-light) active:bg-(--color-accent-dim);
}

.game-button-secondary {
  @apply border border-(--color-text-muted) bg-transparent text-(--color-text-secondary) hover:border-(--color-text-secondary) hover:text-(--color-text-primary) active:bg-(--color-bg-surface);
}

.game-button-danger {
  @apply bg-(--color-danger) text-white hover:bg-(--color-danger-light);
}
</style>
