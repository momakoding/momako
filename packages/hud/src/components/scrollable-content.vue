<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, useSlots } from 'vue';

const scrollArea = ref<HTMLElement | null>(null);
const scrollThumb = ref<HTMLElement | null>(null);
const scrollTrack = ref<HTMLElement | null>(null);
const footerEl = ref<HTMLElement | null>(null);

let dragging = false;
let startY = 0;
let startTop = 0;

function syncFooterOffset() {
  if (!footerEl.value || !scrollTrack.value || !scrollArea.value) return;
  const footerH = footerEl.value.offsetHeight;
  scrollTrack.value.style.bottom = `${footerH}px`;
  scrollArea.value.style.paddingBottom = `${footerH}px`;
}

function updateThumb() {
  if (!scrollArea.value || !scrollThumb.value || !scrollTrack.value) return;
  const el = scrollArea.value;
  const trackH = scrollTrack.value.clientHeight;
  const ratio = el.clientHeight / el.scrollHeight;
  const thumbH = Math.max(32, trackH * ratio);
  const maxScrollTop = el.scrollHeight - el.clientHeight;
  const scrolled = maxScrollTop > 0 ? el.scrollTop / maxScrollTop : 0;
  const thumbTop = scrolled * (trackH - thumbH);

  scrollThumb.value.style.height = `${thumbH}px`;
  scrollThumb.value.style.top = `${thumbTop}px`;
  scrollThumb.value.style.opacity = ratio >= 1 ? '0' : '1';
}

function onScroll() {
  updateThumb();
}

function onResize() {
  syncFooterOffset();
  updateThumb();
}

function onThumbMousedown(e: MouseEvent) {
  dragging = true;
  startY = e.clientY;
  startTop = scrollArea.value?.scrollTop ?? 0;
  document.body.style.userSelect = 'none';
  e.preventDefault();
}

function onDocMousemove(e: MouseEvent) {
  if (!dragging || !scrollArea.value || !scrollTrack.value || !scrollThumb.value) return;
  const trackH = scrollTrack.value.clientHeight;
  const thumbH = scrollThumb.value.clientHeight;
  const dy = e.clientY - startY;
  const maxScroll = scrollArea.value.scrollHeight - scrollArea.value.clientHeight;
  const scrollRatio = dy / (trackH - thumbH);
  scrollArea.value.scrollTop = Math.max(0, Math.min(maxScroll, startTop + scrollRatio * maxScroll));
}

function onDocMouseup() {
  dragging = false;
  document.body.style.userSelect = '';
}

const slots = useSlots();
const hasFooter = () => !!slots.footer;

onMounted(() => {
  if (hasFooter()) syncFooterOffset();
  updateThumb();
  document.addEventListener('mousemove', onDocMousemove);
  document.addEventListener('mouseup', onDocMouseup);
  window.addEventListener('resize', onResize);
});

onBeforeUnmount(() => {
  document.removeEventListener('mousemove', onDocMousemove);
  document.removeEventListener('mouseup', onDocMouseup);
  window.removeEventListener('resize', onResize);
});
</script>

<template>
  <div class="scrollable-content-wrapper">
    <!-- 内容区 -->
    <div ref="scrollArea" class="scrollable-content" @scroll="onScroll">
      <slot />
    </div>

    <!-- 自定义滚动条 -->
    <div ref="scrollTrack" class="custom-scrollbar-track" aria-hidden="true">
      <div
        ref="scrollThumb"
        class="custom-scrollbar-thumb"
        @mousedown="onThumbMousedown"
      />
    </div>

    <!-- 固定底部槽位 -->
    <div v-if="hasFooter()" ref="footerEl" class="scrollable-footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<style scoped>
@reference "../styles/hud.css";

.scrollable-content-wrapper {
  @apply relative h-full w-full overflow-hidden;
}

.scrollable-content {
  @apply h-full w-full overflow-y-auto no-scrollbar;
}

.custom-scrollbar-track {
  @apply custom-scrollbar-track bottom-0;
}

.custom-scrollbar-thumb {
  @apply custom-scrollbar-thumb;
}

.scrollable-footer {
  @apply absolute bottom-0 left-0 right-0 z-20;
}
</style>
