// src/game/rooms/KitchenScene.ts
import * as Phaser from 'phaser';
import { GameState } from '../state/GameState';
import { RoomManager } from '../managers/RoomManager';
import { DayNightManager } from '../managers/DayNightManager';

export class KitchenScene extends Phaser.Scene {
  private baby!: Phaser.GameObjects.Sprite;
  private highchair!: Phaser.GameObjects.Sprite;
  private spoon!: Phaser.GameObjects.Sprite;
  private apple!: Phaser.GameObjects.Sprite;
  private banana!: Phaser.GameObjects.Sprite;
  private bottle!: Phaser.GameObjects.Sprite;
  private gameState: GameState;
  private roomManager!: RoomManager;
  private statusText!: Phaser.GameObjects.Text;
  private feedbackText!: Phaser.GameObjects.Text;
  private dayNight?: DayNightManager; 

  constructor() {
    super({ key: 'KitchenScene' });
    this.gameState = GameState.getInstance();
  }

  preload() {
    // Загружаем ассеты кухни
    this.load.image('baby-happy', '/mybaby/baby.png');
    this.load.image('bottle', '/mybaby/bottle.png');

    // TODO: Добавить новые ассеты
    // this.load.image('kitchen-bg', '/mybaby/rooms/kitchen_bg.jpg');
    // this.load.image('highchair', '/mybaby/items/kitchen/highchair.png');
    // this.load.image('spoon', '/mybaby/items/kitchen/spoon.png');
    // this.load.image('apple', '/mybaby/items/kitchen/apple.png');
    // this.load.image('banana', '/mybaby/items/kitchen/banana.png');

    // TODO: Добавить музыку и звуки
    // this.load.audio('kitchen_morning', '/mybaby/audio/ambient/kitchen_morning.mp3');
    // this.load.audio('nom_nom', '/mybaby/audio/effects/nom_nom.mp3');
    // this.load.audio('giggle', '/mybaby/audio/effects/giggle.mp3');
  }

  create() {
    // Инициализируем RoomManager
    this.roomManager = new RoomManager(this.game);

    // Фон кухни (временно - персиковый)
    this.cameras.main.setBackgroundColor('#ffd4b8');

    // Малыш в стульчике (центр)
    this.baby = this.add.sprite(400, 320, 'baby-happy');
    this.baby.setScale(0.6);
    this.baby.setDepth(1);

    // Стульчик (под малышом)
    // Временно - используем crib как placeholder
    this.highchair = this.add.sprite(400, 380, 'crib');
    this.highchair.setScale(0.5);
    this.highchair.setDepth(0);
    this.highchair.setTint(0xd4a574); // Коричневый оттенок

    // Создаем волшебные предметы для кормления
    this.createFoodItems();

    // Статус и фидбек
    this.createUI();

    // Drag & Drop
    this.setupDragAndDrop();

    // Кнопка возврата в спальню
    this.createNavigationButton();

    // Плавное появление
    this.cameras.main.fadeIn(400, 0, 0, 0);

    // Менеджер дня и ночи
    this.dayNight = new DayNightManager(this);

    this.dayNight.setTimeByRealTime(); // Синхронизация с реальным временем
  }

  private createFoodItems(): void {
    // Бутылочка
    this.bottle = this.add.sprite(150, 500, 'bottle');
    this.bottle.setScale(0.5);
    this.bottle.setInteractive({ draggable: true });
    this.bottle.setDepth(2);
    this.bottle.setData('action', 'feed');
    this.bottle.setData('foodType', 'bottle');
    this.bottle.setData('originalX', 150);
    this.bottle.setData('originalY', 500);

    // Ложка (анимированная)
    this.spoon = this.add.sprite(280, 500, 'bottle'); // Placeholder
    this.spoon.setScale(0.4);
    this.spoon.setTint(0xc0c0c0); // Серебристый
    this.spoon.setInteractive({ draggable: true });
    this.spoon.setDepth(2);
    this.spoon.setData('action', 'feed');
    this.spoon.setData('foodType', 'spoon');
    this.spoon.setData('originalX', 280);
    this.spoon.setData('originalY', 500);

    // Анимация покачивания ложки
    this.tweens.add({
      targets: this.spoon,
      angle: { from: -10, to: 10 },
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // Яблоко
    this.apple = this.add.sprite(410, 500, 'bottle'); // Placeholder
    this.apple.setScale(0.4);
    this.apple.setTint(0xff6b6b); // Красный
    this.apple.setInteractive({ draggable: true });
    this.apple.setDepth(2);
    this.apple.setData('action', 'feed');
    this.apple.setData('foodType', 'apple');
    this.apple.setData('originalX', 410);
    this.apple.setData('originalY', 500);

    // Подпрыгивание яблока
    this.tweens.add({
      targets: this.apple,
      y: { from: 500, to: 490 },
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Bounce.easeOut',
    });

    // Банан
    this.banana = this.add.sprite(540, 500, 'bottle'); // Placeholder
    this.banana.setScale(0.4);
    this.banana.setTint(0xffeb3b); // Желтый
    this.banana.setInteractive({ draggable: true });
    this.banana.setDepth(2);
    this.banana.setData('action', 'feed');
    this.banana.setData('foodType', 'banana');
    this.banana.setData('originalX', 540);
    this.banana.setData('originalY', 500);

    // Покачивание банана (подмигивание)
    this.tweens.add({
      targets: this.banana,
      scaleX: { from: 0.4, to: 0.45 },
      scaleY: { from: 0.4, to: 0.35 },
      duration: 600,
      yoyo: true,
      repeat: -1,
    });
  }

  private createUI(): void {
    const stats = this.gameState.babyState.getStats();
    const totalStats = this.gameState.stats;

    // Статус малыша
    this.statusText = this.add.text(50, 50, '', {
      fontSize: '16px',
      color: '#ff6b35',
      backgroundColor: '#ffffff',
      padding: { x: 10, y: 10 },
    });
    this.statusText.setDepth(10);

    // Текст обратной связи (центр вверху)
    this.feedbackText = this.add.text(400, 120, '', {
      fontSize: '24px',
      color: '#ff6b35',
      fontStyle: 'bold',
      stroke: '#ffffff',
      strokeThickness: 4,
    });
    this.feedbackText.setOrigin(0.5);
    this.feedbackText.setDepth(15);
    this.feedbackText.setAlpha(0);

    this.updateStatusDisplay();
  }

  private updateStatusDisplay(): void {
    const stats = this.gameState.babyState.getStats();
    // Удалить эту строку: const totalStats = this.gameState.stats;
  
    this.statusText.setText(`
  🍽️ Кухня
  Настроение: ${stats.mood}
  Счастье: ${Math.round(stats.happiness)}
  Голод: ${Math.round(stats.hunger)}
  
  📊 Всего кормлений: ${this.gameState.stats.totalFeeds}
    `.trim());
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
      const currentScale = gameObject.getData('foodType') === 'spoon' ? 0.4 : 0.5;
      gameObject.setScale(currentScale * 1.2);
    });

    this.input.on('drag', (pointer: any, gameObject: Phaser.GameObjects.Sprite, dragX: number, dragY: number) => {
      gameObject.x = dragX;
      gameObject.y = dragY;
    });

    this.input.on('dragend', (pointer: any, gameObject: Phaser.GameObjects.Sprite) => {
      gameObject.clearTint();
      const foodType = gameObject.getData('foodType');
      const baseScale = foodType === 'spoon' || foodType === 'apple' || foodType === 'banana' ? 0.4 : 0.5;
      gameObject.setScale(baseScale);

      const distance = Phaser.Math.Distance.Between(
        gameObject.x, gameObject.y,
        this.baby.x, this.baby.y
      );

      if (distance < 120) {
        this.handleFeedingAction(gameObject);
      } else {
        this.returnItemToPlace(gameObject);
      }
    });
  }

  private handleFeedingAction(item: Phaser.GameObjects.Sprite): void {
    const foodType = item.getData('foodType');

    // Обновляем состояние малыша
    this.gameState.babyState.feedBaby();
    this.gameState.updateStats('feed');

    // Специфичные реакции для разных продуктов
    let feedback = '';
    let babyReaction: any = {};

    switch (foodType) {
      case 'bottle':
        feedback = 'Ням-ням! 🍼';
        babyReaction = { scaleX: 0.7, scaleY: 0.7, duration: 300 };
        break;
      case 'spoon':
        feedback = 'Вкусно! 🥄';
        babyReaction = { angle: { from: -5, to: 5 }, duration: 200, repeat: 2 };
        // TODO: Воспроизвести звук nom_nom
        break;
      case 'apple':
        feedback = 'Хрум-хрум! 🍎';
        babyReaction = { y: { from: 320, to: 300 }, duration: 200, yoyo: true };
        break;
      case 'banana':
        feedback = 'Ммм, вкуснятина! 🍌';
        babyReaction = { scaleX: 0.65, scaleY: 0.65, duration: 500, yoyo: true };
        // TODO: Воспроизвести звук giggle
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
        this.baby.setScale(0.6);
        this.baby.setAngle(0);
      },
    });

    // Возвращаем предмет
    this.returnItemToPlace(item);

    // Обновляем статус
    this.updateStatusDisplay();

    // Проверяем разблокировку новой комнаты
    if (this.gameState.stats.totalFeeds >= 3) {
      this.showFeedback('🎉 Открыта Игровая комната!', 3000);
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