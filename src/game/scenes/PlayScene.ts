// src/game/scenes/PlayScene.ts - Финальная версия с drag&drop
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
    this.baby.setDepth(1);

    // Создаем предметы с drag&drop
    this.bottle = this.createDraggableItem(200, 500, 'bottle', 'feed');
    this.teddy = this.createDraggableItem(300, 500, 'teddy', 'play');
    this.crib = this.createDraggableItem(400, 500, 'crib', 'sleep');

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

  private createDraggableItem(x: number, y: number, texture: string, action: string) {
    const item = this.add.sprite(x, y, texture);
    item.setScale(0.6);
    item.setInteractive({ draggable: true });
    item.setDepth(2);
    item.setData('action', action);
    return item;
  }

  private setupDragAndDrop() {
    this.input.on('dragstart', (pointer: any, gameObject: Phaser.GameObjects.Sprite) => {
      gameObject.setTint(0x808080);
      gameObject.setScale(0.7);
    });

    this.input.on('drag', (pointer: any, gameObject: Phaser.GameObjects.Sprite, dragX: number, dragY: number) => {
      gameObject.x = dragX;
      gameObject.y = dragY;
    });

    this.input.on('dragend', (pointer: any, gameObject: Phaser.GameObjects.Sprite) => {
      gameObject.clearTint();
      gameObject.setScale(0.6);

      // Проверяем расстояние до малыша
      const distance = Phaser.Math.Distance.Between(
        gameObject.x, gameObject.y,
        this.baby.x, this.baby.y
      );

      if (distance < 100) {
        this.handleItemUsed(gameObject);
      } else {
        // Запоминаем новую позицию как "оригинальную"
        gameObject.setData('originalX', gameObject.x);
        gameObject.setData('originalY', gameObject.y);
      }
    });
  }

  private handleItemUsed(item: Phaser.GameObjects.Sprite) {
    const action = item.getData('action');
    let newMood: string;

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

    // Обновляем статус
    this.updateStatusDisplay();

    console.log(`Использован предмет: ${action}, новое настроение: ${newMood}`);
  }

  private updateBabySprite() {
    this.baby.setTexture('baby-happy');
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
