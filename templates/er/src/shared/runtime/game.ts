import * as Phaser from 'phaser';
import { GameShell } from '../engine/game-shell';
import { EVENT_KEYS, useEventBus } from '@momako/core';

const eventBus = useEventBus();

let gameShell: GameShell | null = null;

const ensureShell = (): GameShell => {
  if (!gameShell) {
    throw new Error('Game 尚未初始化，请先调用 initGame(container, initialScene)');
  }
  return gameShell;
};

export const initGame = (container: HTMLElement, initialScene: typeof Phaser.Scene) => {
  if (gameShell) return;
  gameShell = GameShell.createGameShell(container, initialScene);
};

export const destroyGame = (removeCanvas = true) => {
  gameShell?.destroy(removeCanvas);
  gameShell = null;
};

export const addScene = (sceneClass: typeof Phaser.Scene, autoStart = false) =>
  ensureShell().addScene(sceneClass, autoStart);

export const addScenes = (sceneClasses: (typeof Phaser.Scene)[], autoStartKey?: string) =>
  ensureShell().addScenes(sceneClasses, autoStartKey);

export const switchToScene = (sceneKey: string, data?: object) =>
  ensureShell().switchToScene(sceneKey, data);

export const restartScene = (sceneKey: string, data?: object) =>
  ensureShell().restart(sceneKey, data);

export const pauseGame = (sceneKey?: string) => ensureShell().pause(sceneKey);

export const resumeGame = (sceneKey?: string) => ensureShell().resume(sceneKey);

export const resizeGame = (width: number, height: number) =>
  ensureShell().resize(width, height);

export const quitGame = () => {
  eventBus.emit(EVENT_KEYS.GAME_OVER);
};

export function useGame() {
  return {
    initGame,
    destroyGame,
    addScene,
    addScenes,
    switchToScene,
    restartScene,
    pauseGame,
    resumeGame,
    resizeGame,
    quitGame,
  };
}
