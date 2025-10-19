// src/game/managers/RoomManager.ts
import * as Phaser from 'phaser';
import { GameState } from '../state/GameState';

export class RoomManager {
  private game: Phaser.Game;
  private gameState: GameState;
  private currentMusic?: Phaser.Sound.BaseSound;

  // Маппинг музыки для комнат
  private musicMap: Record<string, string> = {
    BedroomScene: 'bedroom_music',
    KitchenScene: 'kitchen_music',
    PlayroomScene: 'playroom_music',
    BathroomScene: 'bathroom_music',
  };

  constructor(game: Phaser.Game) {
    this.game = game;
    this.gameState = GameState.getInstance();
  }

  /**
   * Переключение между комнатами с плавными переходами
   */
  public async switchRoom(nextRoom: string): Promise<void> {
    // Проверка: та же комната
    if (this.gameState.currentRoom === nextRoom) {
      console.log('⚠️ Уже в этой комнате');
      return;
    }

    // Проверка: комната разблокирована?
    if (!this.gameState.isRoomUnlocked(nextRoom)) {
      console.log('🔒 Комната заблокирована');
      this.showLockedMessage();
      return;
    }

    console.log(`🚪 Переход: ${this.gameState.currentRoom} → ${nextRoom}`);

    // 1️⃣ Плавное затемнение (белый fade для мягкости)
    await this.fadeOut();

    // 2️⃣ Сохранить состояние текущей комнаты
    this.gameState.saveRoomState(this.gameState.currentRoom);

    // 3️⃣ Остановить текущую музыку
    this.stopCurrentMusic();

    // 4️⃣ Переключить сцену
    const currentScene = this.game.scene.getScene(this.gameState.currentRoom);
    if (currentScene) {
      this.game.scene.stop(this.gameState.currentRoom);
    }
    this.game.scene.start(nextRoom);

    // 5️⃣ Обновить текущую комнату
    this.gameState.currentRoom = nextRoom;

    // 6️⃣ Запустить музыку новой комнаты
    this.playRoomMusic(nextRoom);

    // 7️⃣ Плавное проявление
    await this.fadeIn();
  }

  /**
   * Показать сообщение о заблокированной комнате
   */
  private showLockedMessage(): void {
    const currentScene = this.game.scene.getScenes(true)[0];
    if (currentScene) {
      const text = (currentScene as any).add.text(
        400, 300,
        '🔒 Комната заблокирована!\nВыполните условия разблокировки',
        {
          fontSize: '20px',
          color: '#ff6b6b',
          backgroundColor: '#ffffff',
          padding: { x: 20, y: 15 },
          align: 'center',
        }
      );
      text.setOrigin(0.5);
      text.setDepth(100);

      // Исчезновение через 2 секунды
      currentScene.tweens.add({
        targets: text,
        alpha: 0,
        duration: 500,
        delay: 2000,
        onComplete: () => text.destroy(),
      });
    }
  }

  /**
   * Воспроизведение фоновой музыки комнаты
   */
  private playRoomMusic(roomKey: string): void {
    const musicKey = this.musicMap[roomKey];
    if (!musicKey) return;

    const scene = this.game.scene.getScene(roomKey);
    if (scene && scene.sound) {
      this.currentMusic = scene.sound.add(musicKey, {
        loop: true,
        volume: 0.3,
      });
      this.currentMusic.play();
      console.log(`🎵 Играет музыка: ${musicKey}`);
    }
  }

  /**
   * Остановка текущей музыки
   */
  private stopCurrentMusic(): void {
    if (this.currentMusic && this.currentMusic.isPlaying) {
      this.currentMusic.stop();
      this.currentMusic.destroy();
    }
  }

  /**
   * Эффект плавного затемнения
   */
  private fadeOut(useWhite: boolean = false): Promise<void> {
    return new Promise((resolve) => {
      const scenes = this.game.scene.getScenes(true);
      if (scenes.length === 0) {
        resolve();
        return;
      }

      const currentScene = scenes[0];
      const color = useWhite ? [255, 255, 255] : [0, 0, 0];
      currentScene.cameras.main.fadeOut(500, ...color);
      
      currentScene.cameras.main.once('camerafadeoutcomplete', () => {
        resolve();
      });
    });
  }

  /**
   * Эффект плавного проявления
   */
  private fadeIn(useWhite: boolean = false): Promise<void> {
    return new Promise((resolve) => {
      const scenes = this.game.scene.getScenes(true);
      if (scenes.length === 0) {
        resolve();
        return;
      }

      const currentScene = scenes[0];
      const color = useWhite ? [255, 255, 255] : [0, 0, 0];
      currentScene.cameras.main.fadeIn(500, ...color);
      
      currentScene.cameras.main.once('camerafadeincomplete', () => {
        resolve();
      });
    });
  }

  /**
   * Получение текущей комнаты
   */
  public getCurrentRoom(): string {
    return this.gameState.currentRoom;
  }

  /**
   * Получение списка разблокированных комнат
   */
  public getAvailableRooms() {
    return this.gameState.getUnlockedRooms();
  }
}