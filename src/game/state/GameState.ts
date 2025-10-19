// src/game/state/GameState.ts
import { BabyState } from '../entities/BabyState';

export interface RoomConfig {
  key: string;
  name: string;
  unlocked: boolean;
  unlockCondition?: {
    type: 'feeds' | 'plays' | 'sleeps';
    count: number;
  };
}

export class GameState {
  private static instance: GameState;
  
  // Состояние комнат
  public currentRoom: string = 'BedroomScene';
  public rooms: Map<string, RoomConfig> = new Map([
    ['BedroomScene', { key: 'BedroomScene', name: '🛏️ Спальня', unlocked: true }],
    ['KitchenScene', { key: 'KitchenScene', name: '🍽️ Кухня', unlocked: false, unlockCondition: { type: 'feeds', count: 3 } }],
    ['PlayroomScene', { key: 'PlayroomScene', name: '🎮 Игровая', unlocked: false, unlockCondition: { type: 'plays', count: 5 } }],
    ['BathroomScene', { key: 'BathroomScene', name: '🛁 Ванная', unlocked: false, unlockCondition: { type: 'sleeps', count: 2 } }],
  ]);

  // Состояние малыша (singleton)
  public babyState: BabyState;

  // Статистика для разблокировок
  public stats = {
    totalFeeds: 0,
    totalPlays: 0,
    totalSleeps: 0,
  };

  private constructor() {
    this.babyState = new BabyState();
  }

  // Singleton pattern
  public static getInstance(): GameState {
    if (!GameState.instance) {
      GameState.instance = new GameState();
    }
    return GameState.instance;
  }

  // Сохранение состояния комнаты
  public saveRoomState(roomKey: string): void {
    console.log(`💾 Сохранено состояние комнаты: ${roomKey}`);
    // Здесь можно добавить localStorage
  }

  // Обновление статистики и проверка разблокировок
  public updateStats(action: 'feed' | 'play' | 'sleep'): void {
    switch (action) {
      case 'feed':
        this.stats.totalFeeds++;
        break;
      case 'play':
        this.stats.totalPlays++;
        break;
      case 'sleep':
        this.stats.totalSleeps++;
        break;
    }

    this.checkUnlocks();
  }

  // Проверка условий разблокировки комнат
  private checkUnlocks(): void {
    this.rooms.forEach((room, key) => {
      if (!room.unlocked && room.unlockCondition) {
        const { type, count } = room.unlockCondition;
        const currentCount = type === 'feeds' ? this.stats.totalFeeds :
                            type === 'plays' ? this.stats.totalPlays :
                            this.stats.totalSleeps;

        if (currentCount >= count) {
          room.unlocked = true;
          console.log(`🎉 Комната разблокирована: ${room.name}`);
        }
      }
    });
  }

  // Проверка доступности комнаты
  public isRoomUnlocked(roomKey: string): boolean {
    return this.rooms.get(roomKey)?.unlocked || false;
  }

  // Получение списка доступных комнат
  public getUnlockedRooms(): RoomConfig[] {
    return Array.from(this.rooms.values()).filter(room => room.unlocked);
  }
}