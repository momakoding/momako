import type { EventCallback } from '../types';

export class GameEventBus {
  private listeners = new Map<string, Set<EventCallback>>();

  constructor() {}

  on(event: string, callback: EventCallback): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
  }

  off(event: string, callback: EventCallback): void {
    this.listeners.get(event)?.delete(callback);
  }

  emit(event: string, ...args: unknown[]): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach((ccb) => ccb(...args));
    }
  }

  /** 清理所有监听器（场景或组件销毁时调用） */
  clear(): void {
    this.listeners.clear();
  }

  public static createEventBus(): GameEventBus {
    return new GameEventBus();
  }
}

/** 全局单例 EventBus */
let globalBus: GameEventBus | null = null;

export function useEventBus(): GameEventBus {
  if (!globalBus) {
    globalBus = new GameEventBus();
  }
  return globalBus;
}
