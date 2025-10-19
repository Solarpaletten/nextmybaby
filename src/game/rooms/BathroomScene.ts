// src/game/rooms/BathroomScene.ts
import * as Phaser from 'phaser';
import { GameState } from '../state/GameState';
import { RoomManager } from '../managers/RoomManager';
import { StatsOverlay } from '../ui/StatsOverlay';
import { DayNightManager } from '../managers/DayNightManager';

this.dayNight = new DayNightManager(this);
this.dayNight.setTimeByRealTime(); // Синхронизация с реальным временем
// ИЛИ
this.dayNight.startAutoCycle(240); // Автоцикл 4 минуты

export class BathroomScene extends Phaser.Scene {
  private baby!: Phaser.GameObjects.Sprite;
  private bathtub!: Phaser.GameObjects.Graphics;
  private duck!: Phaser.GameObjects.Sprite;
  private soap!: Phaser.GameObjects.Sprite;
  private towel!: Phaser.GameObjects.Sprite;
  private bubbles: Phaser.GameObjects.Graphics[] = [];
  private gameState: GameState;
  private roomManager!: RoomManager;
  private statsOverlay!: StatsOverlay;
  private feedbackText!: Phaser.GameObjects.Text;
  private isBathing: boolean = false;

  constructor() {
    super({ key: 'BathroomScene' });
    this.gameState = GameState.getInstance();
  }

  preload() {
    // Загружаем ассеты ванной
    this.load.image('baby-happy', '/mybaby/baby.png');
    this.load.image('teddy', '/mybaby/teddy.png'); // Для уточки (placeholder)
    this.load.image('bottle', '/mybaby/bottle.png'); // Для мыла (placeholder)
    
    // TODO: Добавить ассеты
    // this.load.image('bathroom-bg', '/mybaby/rooms/bathroom_bg.jpg');
    // this.load.image('duck', '/mybaby/items/bathroom/duck.png');
    // this.load.image('soap', '/mybaby/items/bathroom/soap.png');
    // this.load.image('towel', '/mybaby/items/bathroom/towel.png');
    
    // TODO: Аудио
    // this.load.audio('bathroom_music', '/mybaby/audio/ambient/bathroom_music.mp3');
    // this.load.audio('splash', '/mybaby/audio/effects/splash.mp3');
    // this.load.audio('bubble_pop', '/mybaby/audio/effects/bubble_pop.mp3');
  }

  create() {
    // Инициализируем RoomManager
    this.roomManager = new RoomManager(this.game);

    // Фон ванной (голубовато-белый)
    this.cameras.main.setBackgroundColor('#e3f2fd');

    // Рисуем ванну
    this.createBathtub();

    // Малыш в ванне
    this.baby = this.add.sprite(400, 340, 'baby-happy');
    this.baby.setScale(0.55);
    this.baby.setDepth(2);

    // Лёгкое покачивание в воде
    this.tweens.add({
      targets: this.baby,
      y: { from: 340, to: 345 },
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // Создаём предметы для купания
    this.createBathItems();

    // Менеджер дня и ночи
    this.dayNight = new DayNightManager(this);

    // this.dayNight.setTimeByRealTime(); // Синхронизация с реальным временем
    // ИЛИ
    // 
    this.dayNight.startAutoCycle(240); // Автоцикл 4 минуты

    // Stats Overlay
    this.statsOverlay = new StatsOverlay(this);

    // Текст обратной связи
    this.feedbackText = this.add.text(400, 120, '', {
      fontSize: '26px',
      color: '#0288d1',
      fontStyle: 'bold',
      stroke: '#ffffff',
      strokeThickness: 5,
    });
    this.feedbackText.setOrigin(0.5);
    this.feedbackText.setDepth(15);
    this.feedbackText.setAlpha(0);

    // Генерация пузырей
    this.time.addEvent({
      delay: 800,
      callback: () => this.createBubble(),
      loop: true,
    });

    // Drag & Drop
    this.setupDragAndDrop();

    // Кнопка возврата
    this.createNavigationButton();

    // Плавное появление
    this.cameras.main.fadeIn(400, 0, 0, 0);
  }

  private createBathtub(): void {
    // Ванна (округлый прямоугольник)
    this.bathtub = this.add.graphics();
    this.bathtub.setDepth(0);
    
    // Контур ванны
    this.bathtub.lineStyle(4, 0xb0bec5, 1);
    this.bathtub.fillStyle(0xbbdefb, 0.8);
    this.bathtub.fillRoundedRect(250, 300, 300, 150, 20);
    this.bathtub.strokeRoundedRect(250, 300, 300, 150, 20);

    // Вода (градиент эффект через прозрачность)
    this.bathtub.fillStyle(0x81d4fa, 0.6);
    this.bathtub.fillRoundedRect(255, 310, 290, 135, 18);
  }

  private createBathItems(): void {
    // Уточка (плавает)
    this.duck = this.add.sprite(320, 450, 'teddy');
    this.duck.setScale(0.4);
    this.duck.setTint(0xffeb3b); // Жёлтая уточка
    this.duck.setInteractive({ draggable: true });
    this.duck.setDepth(3);
    this.duck.setData('action', 'bath');
    this.duck.setData('itemType', 'duck');
    this.duck.setData('originalX', 320);
    this.duck.setData('originalY', 450);

    // Анимация: уточка качается на воде
    this.tweens.add({
      targets: this.duck,
      y: { from: 450, to: 455 },
      angle: { from: -5, to: 5 },
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // Мыло (на краю ванны)
    this.soap = this.add.sprite(200, 480, 'bottle');
    this.soap.setScale(0.35);
    this.soap.setTint(0xff80ab); // Розовое мыло
    this.soap.setInteractive({ draggable: true });
    this.soap.setDepth(3);
    this.soap.setData('action', 'bath');
    this.soap.setData('itemType', 'soap');
    this.soap.setData('originalX', 200);
    this.soap.setData('originalY', 480);

    // Лёгкое мерцание мыла
    this.tweens.add({
      targets: this.soap,
      alpha: { from: 0.8, to: 1 },
      duration: 1000,
      yoyo: true,
      repeat: -1,
    });

    // Полотенце (висит справа)
    this.towel = this.add.sprite(600, 380, 'bottle');
    this.towel.setScale(0.5);
    this.towel.setTint(0x80deea); // Голубое полотенце
    this.towel.setInteractive({ draggable: true });
    this.towel.setDepth(3);
    this.towel.setData('action', 'bath');
    this.towel.setData('itemType', 'towel');
    this.towel.setData('originalX', 600);
    this.towel.setData('originalY', 380);
  }

  private createBubble(): void {
    if (this.bubbles.length > 15) {
      // Удаляем старые пузыри
      const oldBubble = this.bubbles.shift();
      oldBubble?.destroy();
    }

    const x = Phaser.Math.Between(270, 530);
    const y = 440;
    const size = Phaser.Math.Between(8, 20);

    const bubble = this.add.graphics();
    bubble.setDepth(4);
    bubble.fillStyle(0xffffff, 0.6);
    bubble.fillCircle(x, y, size);
    bubble.lineStyle(2, 0xe1f5fe, 0.8);
    bubble.strokeCircle(x, y, size);

    this.bubbles.push(bubble);

    // Анимация: пузырь поднимается и лопается
    this.tweens.add({
      targets: bubble,
      y: y - Phaser.Math.Between(80, 150),
      alpha: 0,
      duration: Phaser.Math.Between(2000, 4000),
      ease: 'Sine.easeOut',
      onComplete: () => {
        bubble.destroy();
        this.bubbles = this.bubbles.filter(b => b !== bubble);
      },
    });
  }

  private createNavigationButton(): void {
    const backButton = this.add.text(40, 520, '🏠 В спальню', {
      fontSize: '18px',
      color: '#ffffff',
      backgroundColor: '#0288d1',
      padding: { x: 15, y: 10 },
    });

    backButton.setInteractive({ useHandCursor: true });
    backButton.setDepth(20);

    backButton.on('pointerdown', () => {
      this.roomManager.switchRoom('BedroomScene');
    });

    backButton.on('pointerover', () => {
      backButton.setStyle({ backgroundColor: '#039be5' });
    });

    backButton.on('pointerout', () => {
      backButton.setStyle({ backgroundColor: '#0288d1' });
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
      const itemType = gameObject.getData('itemType');
      const baseScale = itemType === 'soap' ? 0.35 : itemType === 'duck' ? 0.4 : 0.5;
      gameObject.setScale(baseScale);

      const distance = Phaser.Math.Distance.Between(
        gameObject.x, gameObject.y,
        this.baby.x, this.baby.y
      );

      if (distance < 100) {
        this.handleBathAction(gameObject);
      } else {
        this.returnItemToPlace(gameObject);
      }
    });
  }

  private handleBathAction(item: Phaser.GameObjects.Sprite): void {
    const itemType = item.getData('itemType');

    // Увеличиваем счастье и энергию через купание
    const stats = this.gameState.babyState.getStats();
    this.gameState.babyState['happiness'] = Math.min(100, stats.happiness + 15);
    this.gameState.babyState['energy'] = Math.min(100, stats.energy + 10);

    let feedback = '';
    let babyReaction: any = {};

    switch (itemType) {
      case 'duck':
        feedback = '🦆 Кря-кря! Весело!';
        babyReaction = {
          x: { from: 400, to: 420 },
          duration: 200,
          repeat: 3,
          yoyo: true,
        };
        // TODO: Звук splash
        // Создаём всплеск пузырей
        for (let i = 0; i < 5; i++) {
          this.time.delayedCall(i * 100, () => this.createBubble());
        }
        break;
      case 'soap':
        feedback = '🧼 Чистый малыш!';
        this.isBathing = true;
        babyReaction = {
          angle: { from: -8, to: 8 },
          duration: 300,
          repeat: 2,
          yoyo: true,
        };
        // Больше пузырей при мытье
        for (let i = 0; i < 10; i++) {
          this.time.delayedCall(i * 50, () => this.createBubble());
        }
        break;
      case 'towel':
        feedback = '🛁 Купание закончено!';
        babyReaction = {
          scaleX: 0.6,
          scaleY: 0.6,
          duration: 400,
          yoyo: true,
        };
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
        this.baby.setScale(0.55);
        this.baby.setAngle(0);
        this.baby.x = 400;
      },
    });

    // Возвращаем предмет
    this.returnItemToPlace(item);
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