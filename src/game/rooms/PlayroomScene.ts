// src/game/rooms/PlayroomScene.ts
import * as Phaser from 'phaser';
import { GameState } from '../state/GameState';
import { RoomManager } from '../managers/RoomManager';
import { StatsOverlay } from '../ui/StatsOverlay';

export class PlayroomScene extends Phaser.Scene {
  private baby!: Phaser.GameObjects.Sprite;
  private teddy!: Phaser.GameObjects.Sprite;
  private ball!: Phaser.GameObjects.Sprite;
  private blocks!: Phaser.GameObjects.Sprite;
  private toy!: Phaser.GameObjects.Sprite;
  private gameState: GameState;
  private roomManager!: RoomManager;
  private statsOverlay!: StatsOverlay;
  private feedbackText!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'PlayroomScene' });
    this.gameState = GameState.getInstance();
  }

  preload() {
    // Загружаем ассеты игровой комнаты
    this.load.image('baby-happy', '/mybaby/baby.png');
    this.load.image('teddy', '/mybaby/teddy.png');
    this.load.image('crib', '/mybaby/crib.png'); // Временно для других игрушек
    
    // TODO: Добавить новые ассеты
    // this.load.image('playroom-bg', '/mybaby/rooms/playroom_bg.jpg');
    // this.load.image('ball', '/mybaby/items/playroom/ball.png');
    // this.load.image('blocks', '/mybaby/items/playroom/blocks.png');
    
    // TODO: Музыка
    // this.load.audio('playroom_music', '/mybaby/audio/ambient/playroom_music.mp3');
    // this.load.audio('giggle', '/mybaby/audio/effects/giggle.mp3');
    // this.load.audio('toy_sound', '/mybaby/audio/effects/toy_sound.mp3');
  }

  create() {
    // Инициализируем RoomManager
    this.roomManager = new RoomManager(this.game);

    // Фон игровой (яркие цвета)
    this.cameras.main.setBackgroundColor('#c8e6ff');

    // Малыш на коврике
    this.baby = this.add.sprite(400, 350, 'baby-happy');
    this.baby.setScale(0.65);
    this.baby.setDepth(1);

    // Анимация: малыш покачивается от радости
    this.tweens.add({
      targets: this.baby,
      angle: { from: -3, to: 3 },
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // Создаем игрушки
    this.createToys();

    // Stats Overlay
    this.statsOverlay = new StatsOverlay(this);

    // Текст обратной связи
    this.feedbackText = this.add.text(400, 120, '', {
      fontSize: '28px',
      color: '#ff6b35',
      fontStyle: 'bold',
      stroke: '#ffffff',
      strokeThickness: 5,
    });
    this.feedbackText.setOrigin(0.5);
    this.feedbackText.setDepth(15);
    this.feedbackText.setAlpha(0);

    // Drag & Drop
    this.setupDragAndDrop();

    // Кнопка возврата
    this.createNavigationButton();

    // Плавное появление
    this.cameras.main.fadeIn(400, 0, 0, 0);
  }

  private createToys(): void {
    // Мишка
    this.teddy = this.add.sprite(150, 480, 'teddy');
    this.teddy.setScale(0.5);
    this.teddy.setInteractive({ draggable: true });
    this.teddy.setDepth(2);
    this.teddy.setData('action', 'play');
    this.teddy.setData('toyType', 'teddy');
    this.teddy.setData('originalX', 150);
    this.teddy.setData('originalY', 480);

    // Анимация: мишка машет лапкой
    this.tweens.add({
      targets: this.teddy,
      scaleX: { from: 0.5, to: 0.55 },
      duration: 800,
      yoyo: true,
      repeat: -1,
    });

    // Мячик
    this.ball = this.add.sprite(280, 480, 'crib'); // Placeholder
    this.ball.setScale(0.35);
    this.ball.setTint(0xff6b6b); // Красный мяч
    this.ball.setInteractive({ draggable: true });
    this.ball.setDepth(2);
    this.ball.setData('action', 'play');
    this.ball.setData('toyType', 'ball');
    this.ball.setData('originalX', 280);
    this.ball.setData('originalY', 480);

    // Анимация: мячик подпрыгивает
    this.tweens.add({
      targets: this.ball,
      y: { from: 480, to: 460 },
      duration: 600,
      yoyo: true,
      repeat: -1,
      ease: 'Bounce.easeOut',
    });

    // Кубики
    this.blocks = this.add.sprite(410, 480, 'crib'); // Placeholder
    this.blocks.setScale(0.4);
    this.blocks.setTint(0x4ecdc4); // Бирюзовые кубики
    this.blocks.setInteractive({ draggable: true });
    this.blocks.setDepth(2);
    this.blocks.setData('action', 'play');
    this.blocks.setData('toyType', 'blocks');
    this.blocks.setData('originalX', 410);
    this.blocks.setData('originalY', 480);

    // Анимация: кубики поворачиваются
    this.tweens.add({
      targets: this.blocks,
      angle: { from: 0, to: 360 },
      duration: 4000,
      repeat: -1,
      ease: 'Linear',
    });

    // Игрушка-пищалка
    this.toy = this.add.sprite(540, 480, 'crib'); // Placeholder
    this.toy.setScale(0.35);
    this.toy.setTint(0xffeb3b); // Жёлтая игрушка
    this.toy.setInteractive({ draggable: true });
    this.toy.setDepth(2);
    this.toy.setData('action', 'play');
    this.toy.setData('toyType', 'squeaky');
    this.toy.setData('originalX', 540);
    this.toy.setData('originalY', 480);

    // Анимация: пульсация
    this.tweens.add({
      targets: this.toy,
      scale: { from: 0.35, to: 0.4 },
      duration: 700,
      yoyo: true,
      repeat: -1,
    });
  }

  private createNavigationButton(): void {
    const backButton = this.add.text(40, 520, '🏠 В спальню', {
      fontSize: '18px',
      color: '#ffffff',
      backgroundColor: '#ff69b4',
      padding: { x: 15, y: 10 },
    });

    backButton.setInteractive({ useHandCursor: true });
    backButton.setDepth(20);

    backButton.on('pointerdown', () => {
      this.roomManager.switchRoom('BedroomScene');
    });

    backButton.on('pointerover', () => {
      backButton.setStyle({ backgroundColor: '#ff85c0' });
    });

    backButton.on('pointerout', () => {
      backButton.setStyle({ backgroundColor: '#ff69b4' });
    });
  }

  private setupDragAndDrop(): void {
    this.input.on('dragstart', (pointer: any, gameObject: Phaser.GameObjects.Sprite) => {
      gameObject.setTint(0x808080);
      const currentScale = gameObject.scale;
      gameObject.setScale(currentScale * 1.15);
    });

    this.input.on('drag', (pointer: any, gameObject: Phaser.GameObjects.Sprite, dragX: number, dragY: number) => {
      gameObject.x = dragX;
      gameObject.y = dragY;
    });

    this.input.on('dragend', (pointer: any, gameObject: Phaser.GameObjects.Sprite) => {
      gameObject.clearTint();
      const toyType = gameObject.getData('toyType');
      const baseScale = toyType === 'ball' || toyType === 'squeaky' ? 0.35 : 
                       toyType === 'blocks' ? 0.4 : 0.5;
      gameObject.setScale(baseScale);

      const distance = Phaser.Math.Distance.Between(
        gameObject.x, gameObject.y,
        this.baby.x, this.baby.y
      );

      if (distance < 120) {
        this.handlePlayAction(gameObject);
      } else {
        this.returnItemToPlace(gameObject);
      }
    });
  }

  private handlePlayAction(item: Phaser.GameObjects.Sprite): void {
    const toyType = item.getData('toyType');

    // Обновляем состояние малыша
    this.gameState.babyState.playWithToy();
    this.gameState.updateStats('play');

    // Специфичные реакции для разных игрушек
    let feedback = '';
    let babyReaction: any = {};

    switch (toyType) {
      case 'teddy':
        feedback = '🐻 Обнимашки!';
        babyReaction = { 
          scaleX: 0.7, 
          scaleY: 0.7, 
          duration: 400,
          yoyo: true 
        };
        break;
      case 'ball':
        feedback = '⚽ Кати-кати!';
        babyReaction = { 
          x: { from: 400, to: 420 },
          duration: 150,
          repeat: 3,
          yoyo: true 
        };
        // TODO: Звук toy_sound
        break;
      case 'blocks':
        feedback = '🧱 Строим башню!';
        babyReaction = { 
          angle: { from: -8, to: 8 },
          duration: 200,
          repeat: 3,
          yoyo: true 
        };
        break;
      case 'squeaky':
        feedback = '🎵 Пи-пи-пи!';
        babyReaction = { 
          y: { from: 350, to: 330 },
          duration: 250,
          yoyo: true,
          repeat: 2 
        };
        // TODO: Звук giggle
        break;
    }

    // Показываем обратную связь
    this.showFeedback(feedback);

    // Анимация реакции малыша
    this.tweens.add({
      targets: this.baby,
      ...babyReaction,
      ease: 'Power2',
      onComplete: () => {
        this.baby.setScale(0.65);
        this.baby.setAngle(0);
        this.baby.x = 400;
        this.baby.y = 350;
      },
    });

    // Возвращаем игрушку
    this.returnItemToPlace(item);

    // Проверяем разблокировку ванной комнаты
    if (this.gameState.stats.totalPlays >= 5) {
      this.showFeedback('🎉 Открыта Ванная комната!', 3000);
    }
  }

  private showFeedback(text: string, duration: number = 2000): void {
    this.feedbackText.setText(text);
    
    this.tweens.add({
      targets: this.feedbackText,
      alpha: { from: 0, to: 1 },
      duration: 300,
      yoyo: true,
      hold: duration - 600,
      ease: 'Power2',
    });
  }

  private returnItemToPlace(item: Phaser.GameObjects.Sprite): void {
    const originalX = item.getData('originalX');
    const originalY = item.getData('originalY');

    this.tweens.add({
      targets: item,
      x: originalX,
      y: originalY,
      duration: 300,
      ease: 'Power2',
    });
  }
}