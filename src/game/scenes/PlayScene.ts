// src/game/scenes/PlayScene.ts - Исправленная версия с работающим drag & drop
import * as Phaser from 'phaser';
import { BabyState } from '../entities/BabyState';

export class PlayScene extends Phaser.Scene {
  private baby!: Phaser.GameObjects.Sprite;
  private bottle!: Phaser.GameObjects.Sprite;
  private teddy!: Phaser.GameObjects.Sprite;
  private crib!: Phaser.GameObjects.Sprite;
  private babyState: BabyState;
  private statusText!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'PlayScene' });
    this.babyState = new BabyState();
  }

  preload() {
    // Загружаем ассеты
    this.load.image('baby-happy', '/mybaby/baby.png');
    this.load.image('bottle', '/mybaby/bottle.png');
    this.load.image('teddy', '/mybaby/teddy.png');
    this.load.image('crib', '/mybaby/crib.png');
  }

  create() {
    // Создаем малыша в центре
    this.baby = this.add.sprite(400, 300, 'baby-happy');
    this.baby.setScale(0.8);
    this.baby.setDepth(1); // Малыш сзади

    // Создаем предметы с правильной настройкой drag & drop
    this.bottle = this.add.sprite(200, 500, 'bottle');
    this.bottle.setScale(0.6);
    this.bottle.setInteractive({ draggable: true });
    this.bottle.setDepth(2);
    this.bottle.setData('action', 'feed');
    this.bottle.setData('originalX', 200);
    this.bottle.setData('originalY', 500);

    this.teddy = this.add.sprite(300, 500, 'teddy');
    this.teddy.setScale(0.6);
    this.teddy.setInteractive({ draggable: true });
    this.teddy.setDepth(2);
    this.teddy.setData('action', 'play');
    this.teddy.setData('originalX', 300);
    this.teddy.setData('originalY', 500);

    this.crib = this.add.sprite(400, 500, 'crib');
    this.crib.setScale(0.6);
    this.crib.setInteractive({ draggable: true });
    this.crib.setDepth(2);
    this.crib.setData('action', 'sleep');
    this.crib.setData('originalX', 400);
    this.crib.setData('originalY', 500);

    // Статус малыша
    this.statusText = this.add.text(50, 50, '', {
      fontSize: '18px',
      color: '#ff69b4'
    });

    // Настраиваем drag & drop
    this.setupDragAndDrop();

    // Обновляем статус
    this.updateStatusDisplay();
  }

  private setupDragAndDrop() {
    // Drag события для всех draggable объектов
    this.input.on('dragstart', (pointer: any, gameObject: Phaser.GameObjects.Sprite) => {
      gameObject.setTint(0x808080);
      gameObject.setScale(gameObject.scaleX * 1.1); // Немного увеличиваем при перетаскивании
    });

    this.input.on('drag', (pointer: any, gameObject: Phaser.GameObjects.Sprite, dragX: number, dragY: number) => {
      gameObject.x = dragX;
      gameObject.y = dragY;
    });

    this.input.on('dragend', (pointer: any, gameObject: Phaser.GameObjects.Sprite) => {
      gameObject.clearTint();
      gameObject.setScale(0.6); // Возвращаем исходный размер

      // Проверяем, было ли перетаскивание на малыша
      const distance = Phaser.Math.Distance.Between(
        gameObject.x, gameObject.y,
        this.baby.x, this.baby.y
      );

      if (distance < 100) {
        this.handleItemUsed(gameObject);
      } else {
        // Возвращаем предмет на место
        this.returnItemToPlace(gameObject);
      }
    });
  }

  private handleItemUsed(item: Phaser.GameObjects.Sprite) {
    const action = item.getData('action');
    let newMood: string; // Исправлена ошибка компиляции

    switch (action) {
      case 'feed':
        newMood = this.babyState.feedBaby();
        break;
      case 'play':
        newMood = this.babyState.playWithToy();
        break;
      case 'sleep':
        newMood = this.babyState.sleepBaby();
        break;
      default:
        newMood = 'sad';
    }

    // Обновляем спрайт малыша
    this.updateBabySprite();

    // Анимация реакции малыша
    this.tweens.add({
      targets: this.baby,
      scaleX: 0.9,
      scaleY: 0.9,
      duration: 200,
      yoyo: true,
      ease: 'Power2'
    });

    // Возвращаем предмет на место
    this.returnItemToPlace(item);

    // Обновляем статус
    this.updateStatusDisplay();

    console.log(`Использован предмет: ${action}, новое настроение: ${newMood}`);
  }

  private updateBabySprite() {
    // Пока используем только одну текстуру
    this.baby.setTexture('baby-happy');
  }

  private returnItemToPlace(item: Phaser.GameObjects.Sprite) {
    const originalX = item.getData('originalX') || 200;
    const originalY = item.getData('originalY') || 500;

    this.tweens.add({
      targets: item,
      x: originalX,
      y: originalY,
      duration: 300,
      ease: 'Power2'
    });
  }

  private updateStatusDisplay() {
    const stats = this.babyState.getStats();
    this.statusText.setText(`
Настроение: ${stats.mood}
Счастье: ${Math.round(stats.happiness)}
Голод: ${Math.round(stats.hunger)}
Энергия: ${Math.round(stats.energy)}
    `.trim());
  }
}