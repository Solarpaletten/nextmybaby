// src/game/managers/LocalStorageManager.ts
import { GameState, RoomConfig, Achievement } from '../state/GameState';

interface SerializedGameState {
  version: string;
  timestamp: number;
  currentRoom: string;
  rooms: Array<[string, RoomConfig]>;
  achievements: Array<[string, Achievement]>;
  stats: {
    totalFeeds: number;
    totalPlays: number;
    totalSleeps: number;
  };
  babyState: {
    happiness: number;
    hunger: number;
    energy: number;
    mood: string;
  };
}

export class LocalStorageManager {
  private static readonly STORAGE_KEY = 'babyverse_state';
  private static readonly VERSION = '0.3.0';
  private static autoSaveInterval?: NodeJS.Timeout;

  /**
   * Сохранение состояния игры
   */
  static saveState(gameState: GameState): boolean {
    try {
      const serialized = this.serializeState(gameState);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(serialized));
      console.log('💾 Игра сохранена');
      return true;
    } catch (error) {
      console.error('❌ Ошибка сохранения:', error);
      return false;
    }
  }

  /**
   * Загрузка состояния игры
   */
  static loadState(): SerializedGameState | null {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (!data) {
        console.log('ℹ️ Сохранение не найдено');
        return null;
      }

      const parsed: SerializedGameState = JSON.parse(data);
      
      // Проверка версии
      if (parsed.version !== this.VERSION) {
        console.warn('⚠️ Версия сохранения не совпадает, сброс...');
        this.clearState();
        return null;
      }

      console.log('📂 Игра загружена');
      return parsed;
    } catch (error) {
      console.error('❌ Ошибка загрузки:', error);
      return null;
    }
  }

  /**
   * Применение загруженного состояния к GameState
   */
  static applyLoadedState(gameState: GameState, loaded: SerializedGameState): void {
    // Восстанавливаем текущую комнату
    gameState.currentRoom = loaded.currentRoom;

    // Восстанавливаем комнаты
    loaded.rooms.forEach(([key, room]) => {
      const existing = gameState.rooms.get(key);
      if (existing) {
        existing.unlocked = room.unlocked;
      }
    });

    // Восстанавливаем достижения
    loaded.achievements.forEach(([id, achievement]) => {
      const existing = gameState.achievements.get(id);
      if (existing) {
        existing.unlocked = achievement.unlocked;
      }
    });

    // Восстанавливаем статистику
    gameState.stats = { ...loaded.stats };

    // Восстанавливаем состояние малыша
    const baby = gameState.babyState;
    (baby as any).happiness = loaded.babyState.happiness;
    (baby as any).hunger = loaded.babyState.hunger;
    (baby as any).energy = loaded.babyState.energy;
    (baby as any).mood = loaded.babyState.mood;

    console.log('✅ Состояние применено');
  }

  /**
   * Удаление сохранения
   */
  static clearState(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    console.log('🗑️ Сохранение удалено');
  }

  /**
   * Проверка наличия сохранения
   */
  static hasSavedState(): boolean {
    return localStorage.getItem(this.STORAGE_KEY) !== null;
  }

  /**
   * Автосохранение каждые N секунд
   */
  static startAutoSave(gameState: GameState, intervalSeconds: number = 30): void {
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
    }

    this.autoSaveInterval = setInterval(() => {
      this.saveState(gameState);
    }, intervalSeconds * 1000);

    console.log(`⏱️ Автосохранение запущено (каждые ${intervalSeconds}с)`);
  }

  /**
   * Остановка автосохранения
   */
  static stopAutoSave(): void {
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
      this.autoSaveInterval = undefined;
      console.log('⏹️ Автосохранение остановлено');
    }
  }

  /**
   * Сериализация состояния игры
   */
  private static serializeState(gameState: GameState): SerializedGameState {
    const stats = gameState.babyState.getStats();

    return {
      version: this.VERSION,
      timestamp: Date.now(),
      currentRoom: gameState.currentRoom,
      rooms: Array.from(gameState.rooms.entries()),
      achievements: Array.from(gameState.achievements.entries()),
      stats: gameState.stats,
      babyState: {
        happiness: stats.happiness,
        hunger: stats.hunger,
        energy: stats.energy,
        mood: stats.mood,
      },
    };
  }

  /**
   * Получение информации о сохранении
   */
  static getSaveInfo(): { exists: boolean; timestamp?: Date; version?: string } {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (!data) {
      return { exists: false };
    }

    try {
      const parsed: SerializedGameState = JSON.parse(data);
      return {
        exists: true,
        timestamp: new Date(parsed.timestamp),
        version: parsed.version,
      };
    } catch {
      return { exists: false };
    }
  }
}