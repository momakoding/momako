import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { createJamI18n } from '@momako/hud';
import { router } from './router';
import App from './App.vue';
import { META_MESSAGES, getHowToPlayMarkdown, getOssCredits } from '@/contents/meta-info';
import './style.css';

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

const i18n = createJamI18n({
  messages: META_MESSAGES,
});

const app = createApp(App);
app.provide('jam:get-how-to-play', getHowToPlayMarkdown);
app.provide('jam:get-oss-credits', getOssCredits);
app.use(pinia);
app.use(router);
app.use(i18n);
app.mount('#app');
