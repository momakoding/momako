export * from './stores';
export * from './i18n';

// Components & UI Elements (files: kebab-case, exports: PascalCase)
export { default as GameButton } from './components/game-button.vue';
export { default as ScrollableContent } from './components/scrollable-content.vue';
export { default as SettingsPanel } from './components/settings-panel.vue';
export { default as MmkdStarterCredit } from './components/mmkd-starter-credit.vue';
export { default as GameShellLayout } from './components/game-shell-layout.vue';

// Universal Game Jam Pages (files: kebab-case, exports: PascalCase)
export { default as HomePage } from './pages/home.vue';
export { default as HowToPlayPage } from './pages/how-to-play.vue';
export { default as SettingsPage } from './pages/settings.vue';
export { default as AboutUsPage } from './pages/about-us.vue';
