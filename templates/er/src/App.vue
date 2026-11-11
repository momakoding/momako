<template>
  <RouterView />
</template>

<script setup lang="ts">
import { watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';
import { useSettingsStore } from '@momako-jam/hud';

const { locale } = useI18n();
const settings = useSettingsStore();

watchEffect(() => {
  locale.value = settings.language;
  document.documentElement.lang = settings.language;
});
</script>
