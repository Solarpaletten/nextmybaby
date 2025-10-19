// src/game/rooms/BedroomScene.ts
import * as Phaser from 'phaser';
import { GameState } from '../state/GameState';
import { RoomManager } from '../managers/RoomManager';
import { StatsOverlay } from '../ui/StatsOverlay';

export class BedroomScene extends Phaser.Scene {
  private baby!: Phaser.GameObjects.Sprite;
  private crib!: Phaser.GameObjects.Sprite;
  private nightlight!: Phaser.GameObjects.Sprite;
  private gameState: GameState;
  private roomManager!: RoomManager;
  private statsOverlay!: StatsOverlay;
  private navigationUI!: Phaser.GameObjects.Container;

  constructor() {
    super({ key: 'BedroomScene' });
    this.gameState = GameState.getInstance();
  }

  preload() {
    // Загружаем ассеты спальни
    this.load.image('baby-happy', '/mybaby/baby.png');
    this.load.image('crib', '/mybaby/crib.png');
    
    // TODO: Добавить фон спальни
    // this.load.image('bedroom-bg', '/mybaby/rooms/bedroom_bg.png');
    
    // TODO: Добавить музыку
    // this.load.audio('bedroom_music', '/mybaby/audio/ambient/bedroom_music.mp3');
  }

  create() {
    // Инициализируем RoomManager
    this.roomManager = new RoomManager(this.game);

    // Фон спальни (временно - розовый цвет)
    this.cameras.main.setBackgroundColor('#ffe4e9');

    // Создаем малыша
    this.baby = this.add.sprite(400, 350, 'baby-happy');
    this.baby.setScale(0.7);
    this.baby.setDepth(1);

    // Кроватка
    this.crib = this.add.sprite(250, 400, 'crib');
    this.crib.setScale(0.6);
    this.crib.setInteractive({ draggable: true });
    this.crib.setDepth(2);
    this.crib.setData('action', 'sleep');
    this.crib.setData('originalX', 250);
    this.crib.setData('originalY', 400);

    // Статус малыша
    this.createStatusDisplay();

    // UI навигации
    this.createNavigationUI();

    // Drag & Drop
    this.setupDragAndDrop();

    // Плавное появление
    this.cameras.main.fadeIn(400, 0, 0, 0);
  }

  private createStatusDisplay(): void {
    const stats = this.gameState.babyState.getStats();
    
    this.statusText = this.add.text(50, 50, '', {
      fontSize: '16px',
      color: '#ff69b4',
      backgroundColor: '#ffffff',
      padding: { x: 10, y: 10 },
    });
    this.statusText.setDepth(10);
    
    this.updateStatusDisplay();
  }

  private updateStatusDisplay(): void {
    const stats = this.gameState.babyState.getStats();
    const totalStats = this.gameState.stats;
    
    this.statusText.setText(`
🛏️ Спальня
Настроение: ${stats.mood}
Счастье: ${Math.round(stats.happiness)}
Энергия: ${Math.round(stats.energy)}

📊 Всего снов: ${totalStats.totalSleeps}
    `.trim());
  }

  private createNavigationUI(): void {
    // Контейнер для навигации
    this.navigationUI = this.add.container(400, 550);
    this.navigationUI.setDepth(20);

    const availableRooms = this.roomManager.getAvailableRooms();
    
    availableRooms.forEach((room, index) => {
      if (room.key === 'BedroomScene') return; // Текущая комната

      const button = this.add.text(
        index * 120 - 60,
        0,
        room.name,
        {
          fontSize: '14px',
          color: '#ffffff',
          backgroundColor: '#ff69b4',
          padding: { x: 15, y: 10 },
        }
      );
      
      button.setInteractive({ useHandCursor: true });
      button.on('pointerdown', () => {
        this.roomManager.switchRoom(room.key);
      });
      
      button.on('pointerover', () => {
        button.setStyle({ backgroundColor: '#ff85c0' });
      });
      
      button.on('pointerout', () => {
        button.setStyle({ backgroundColor: '#ff69b4' });
      });

      this.navigationUI.add(button);
    });
  }

  private setupDragAndDrop(): void {
    this.input.on('dragstart', (pointer: any, gameObject: Phaser.GameObjects.Sprite) => {
      gameObject.setTint(0x808080);
      gameObject.setScale(gameObject.scaleX * 1.1);
    });

    this.input.on('drag', (pointer: any, gameObject: Phaser.GameObjects.Sprite, dragX: number, dragY: number) => {
      gameObject.x = dragX;
      gameObject.y = dragY;
    });

    this.input.on('dragend', (pointer: any, gameObject: Phaser.GameObjects.Sprite) => {
      gameObject.clearTint();
      gameObject.setScale(0.6);

      const distance = Phaser.Math.Distance.Between(
        gameObject.x, gameObject.y,
        this.baby.x, this.baby.y
      );

      if (distance < 100) {
        this.handleItemUsed(gameObject);
      } else {
        this.returnItemToPlace(gameObject);
      }
    });
  }

  private handleItemUsed(item: Phaser.GameObjects.Sprite): void {
    const action = item.getData('action');

    if (action === 'sleep') {
      this.gameState.babyState.sleepBaby();
      this.gameState.updateStats('sleep');
      
      // Анимация засыпания
      this.tweens.add({
        targets: this.baby,
        alpha: 0.5,
        duration: 500,
        yoyo: true,
      });
    }

    this.returnItemToPlace(item);
    this.updateStatusDisplay();
    
    // Обновляем навигацию (могли разблокироваться новые комнаты)
    this.navigationUI.destroy();
    this.createNavigationUI();
  }

  private returnItemToPlace(item: Phaser.GameObjects.Sprite): void {
    const originalX = item.getData('originalX') || 250;
    const originalY = item.getData('originalY') || 400;

    this.tweens.add({
      targets: item,
      x: originalX,
      y: originalY,
      duration: 300,
      ease: 'Power2',
    });
  }
}