import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { createJamI18n } from '@momako-jam/hud';
import { router } from './router';
import App from './App.vue';
import './style.css';

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

const i18n = createJamI18n({
  messages: {
    'zh-CN': {
      meta: {
        game: {
          title: '摘星星 3D',
          subtitle: 'Picking Stars 3D - 基于 TresJS 的极速声明式 3D 原型',
          description: '基于 Vue 3 + TresJS 构建的 3D Game Jam 原型脚手架。',
          tags: ['3D', 'TresJS', 'Vue 3', 'Game Jam'],
          showGameCard: true,
        },
        team: {
          name: 'Momakoding 3D Team',
          description: '让 Game Jam 3D 原型创作像呼吸一样自然。',
          members: [
            { name: 'Jammer', role: '3D 程序员 / 策划' },
          ],
        },
        hud: {
          score: '⭐ 3D 分数:',
          roundsDone: '轮数:',
          pauseTitle: '游戏暂停 (3D)',
          pause: '暂停',
          resume: '继续游戏',
          restart: '重新开始',
          settings: '设置',
          exitToTitle: '返回标题页面',
        },
      },
    },
    en: {
      meta: {
        game: {
          title: 'Picking Stars 3D',
          subtitle: 'TresJS Powered Declarative 3D Rapid Prototype',
          description: 'A 3D Game Jam starter built on Vue 3 + TresJS.',
          tags: ['3D', 'TresJS', 'Vue 3', 'Game Jam'],
          showGameCard: true,
        },
        team: {
          name: 'Momakoding 3D Team',
          description: 'Empowering 3D Game Jam creators to prototype with speed.',
          members: [
            { name: 'Jammer', role: '3D Dev / Designer' },
          ],
        },
        hud: {
          score: '⭐ 3D Score:',
          roundsDone: 'Rounds done:',
          pauseTitle: 'Game Paused (3D)',
          pause: 'Pause',
          resume: 'Resume',
          restart: 'Restart',
          settings: 'Settings',
          exitToTitle: 'Back to Title',
        },
      },
    },
  },
});

const app = createApp(App);
app.provide('jam:get-how-to-play', (loc: string) => {
  return loc === 'zh-CN'
    ? '### 3D 玩法说明\n\n- 使用 **WASD** 或方向键控制蓝色 3D 角色移动\n- 收集场景中的旋转黄色星体\n- 随时按 **ESC** 暂停并呼出菜单'
    : '### 3D Instructions\n\n- Use **WASD** or Arrow keys to control the blue 3D character\n- Collect all rotating yellow stars\n- Press **ESC** anytime to pause and tweak settings';
});
app.provide('jam:get-oss-credits', () => [
  { name: '@tresjs/core', desc: 'Declarative Three.js for Vue 3' },
  { name: '@tresjs/cientos', desc: 'Useful helpers and components for TresJS' },
  { name: 'three', desc: 'JavaScript 3D Library' },
  { name: 'pinia', desc: 'Intuitive state management for Vue' },
]);
app.use(pinia);
app.use(router);
app.use(i18n);
app.mount('#app');
