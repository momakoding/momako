import { createRouter, createWebHashHistory } from 'vue-router';
import { HomePage, HowToPlayPage, SettingsPage, AboutUsPage } from '@momako-jam/hud';
import GamePage from '../pages/game/index.vue';

export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', name: 'home', component: HomePage },
    { path: '/how-to-play', name: 'how-to-play', component: HowToPlayPage },
    { path: '/settings', name: 'settings', component: SettingsPage },
    { path: '/about-us', name: 'about-us', component: AboutUsPage },
    { path: '/game', name: 'game', component: GamePage },
  ],
});
