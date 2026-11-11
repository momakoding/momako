import type zhCN from './zh-CN';

const en: typeof zhCN = {
  common: {
    backHome: 'Back to Home',
  },
  home: {
    startGame: 'Start Game',
    howToPlay: 'How to Play',
    settings: 'Settings',
    aboutUs: 'About Us',
    exitGame: 'Exit Game',
  },
  settings: {
    title: 'Settings',
    eyebrow: 'PREFERENCES',
    audio: {
      title: 'Audio',
      muted: 'Mute',
      bgm: 'Music',
      sfx: 'Sound FX',
    },
    language: {
      title: 'Language',
      label: 'UI Language',
    },
    resolution: {
      title: 'Game Resolution',
      label: 'Canvas Size',
      auto: 'Auto',
      autoDesc: 'Adapts to window size',
      '800x600': '800 × 600',
      '1280x720': '1280 × 720',
      '1920x1080': '1920 × 1080',
    },
  },
  howToPlay: {
    title: 'How to Play',
    eyebrow: 'GUIDE',
    start: 'Start Game',
  },
  aboutUs: {
    credits: 'CREDITS',
    title: 'About Us',
    team: 'Team',
    game: 'Game',
    oss: {
      title: 'Open Source',
      headline: 'Standing on the Shoulders of Giants',
      desc: 'Built with the following open-source technologies. Special thanks to all contributors.',
      scaffold: 'Scaffold',
      deps: 'Dependencies',
    },
    footer: 'Built with Momako GameJam Starter',
  },
  credit: {
    desc: 'Built on this open-source game jam scaffold',
  },
  meta: {
    hud: {
      score: '⭐ Score:',
      roundsDone: 'Rounds done:',
      pauseTitle: 'Game Paused',
      pause: 'Pause',
      resume: 'Resume',
      restart: 'Restart',
      settings: 'Settings',
      exitToTitle: 'Back to Title',
    },
  },
};

export default en;
