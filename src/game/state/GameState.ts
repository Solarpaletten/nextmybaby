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

export interface Achievement {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  icon: string;
}

export class GameState {
  private static instance: GameState;
  public currentScene?: Phaser.Scene; // Для показа уведомлений
  
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

  // Система достижений
  public achievements: Map<string, Achievement> = new Map([
    ['firstFeed', {
      id: 'firstFeed',
      name: 'Первое кормление',
      description: 'Покормил малыша первый раз',
      unlocked: false,
      icon: '🍼'
    }],
    ['threeFeeds', {
      id: 'threeFeeds',
      name: 'Заботливый родитель',
      description: 'Покормил малыша 3 раза',
      unlocked: false,
      icon: '🍽️'
    }],
    ['firstSleep', {
      id: 'firstSleep',
      name: 'Сладкий сон',
      description: 'Уложил малыша спать',
      unlocked: false,
      icon: '😴'
    }],
    ['firstPlay', {
      id: 'firstPlay',
      name: 'Весёлая игра',
      description: 'Поиграл с малышом',
      unlocked: false,
      icon: '🎮'
    }],
    ['unlockedKitchen', {
      id: 'unlockedKitchen',
      name: 'Кухня открыта',
      description: 'Разблокирована кухня',
      unlocked: false,
      icon: '🍽️'
    }],
    ['unlockedPlayroom', {
      id: 'unlockedPlayroom',
      name: 'Игровая открыта',
      description: 'Разблокирована игровая комната',
      unlocked: false,
      icon: '🎮'
    }],
  ]);

  private constructor() {
    this.babyState = new BabyState();
    this.loadFromStorage();
  }

  // Singleton pattern
  public static getInstance(): GameState {
    if (!GameState.instance) {
      GameState.instance = new GameState();
    }
    return GameState.instance;
  }

  // Загрузка из localStorage
  private loadFromStorage(): void {
    // Импортируем динамически для избежания циклических зависимостей
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = localStorage.getItem('babyverse_state');
      if (saved) {
        console.log('📂 Найдено сохранение, загрузка...');
      }
    }
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
        // Проверка достижений
        if (this.stats.totalFeeds === 1) {
          this.unlockAchievement('firstFeed');
        }
        if (this.stats.totalFeeds === 3) {
          this.unlockAchievement('threeFeeds');
        }
        break;
      case 'play':
        this.stats.totalPlays++;
        if (this.stats.totalPlays === 1) {
          this.unlockAchievement('firstPlay');
        }
        break;
      case 'sleep':
        this.stats.totalSleeps++;
        if (this.stats.totalSleeps === 1) {
          this.unlockAchievement('firstSleep');
        }
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
          
          // Разблокируем соответствующее достижение
          if (key === 'KitchenScene') {
            this.unlockAchievement('unlockedKitchen');
          } else if (key === 'PlayroomScene') {
            this.unlockAchievement('unlockedPlayroom');
          }
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

  // Разблокировка достижения
  public unlockAchievement(achievementId: string): void {
    const achievement = this.achievements.get(achievementId);
    if (achievement && !achievement.unlocked) {
      achievement.unlocked = true;
      console.log(`🏆 Достижение разблокировано: ${achievement.name}`);
      
      // Показываем уведомление, если есть активная сцена
      if (this.currentScene) {
        // Динамический импорт для избежания циклических зависимостей
        import('../ui/AchievementNotification').then(module => {
          new module.AchievementNotification(this.currentScene!, achievement);
        });
      }
    }
  }

  // Получение всех достижений
  public getAchievements(): Achievement[] {
    return Array.from(this.achievements.values());
  }

  // Получение разблокированных достижений
  public getUnlockedAchievements(): Achievement[] {
    return Array.from(this.achievements.values()).filter(a => a.unlocked);
  }
}