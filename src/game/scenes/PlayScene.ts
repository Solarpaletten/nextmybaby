// src/game/scenes/PlayScene.ts
import * as Phaser from 'phaser';
import { BabyState } from '../entities/BabyState';

export class PlayScene extends Phaser.Scene {
  private baby!: Phaser.GameObjects.Sprite;
  private items!: Phaser.GameObjects.Group;
  private babyState: BabyState;
  private statusText!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'PlayScene' });
    this.babyState = new BabyState();
  }

  preload() {
    // Загружаем ассеты - пока только одна текстура малыша
    this.load.image('baby-happy', '/mybaby/baby.png');
    this.load.image('bottle', '/mybaby/bottle.png');
    this.load.image('teddy', '/mybaby/teddy.png');
    this.load.image('crib', '/mybaby/crib.png');
  }

  create() {
    // Создаем малыша в центре
    this.baby = this.add.sprite(200, 150, 'baby-happy');
    this.baby.setInteractive();
    this.baby.setScale(0.8);

    // Делаем малыша перетаскиваемым
    this.input.setDraggable(this.baby);

    // Создаем группу предметов
    this.items = this.add.group();
    this.createItems();

    // Статус малыша
    this.statusText = this.add.text(20, 20, '', {
      fontSize: '16px',
      color: '#ff69b4'
    });

    // Настраиваем drag & drop
    this.setupDragAndDrop();

    // Обновляем статус
    this.updateStatusDisplay();
  }

  private createItems() {
    // Создаем предметы внизу экрана
    const itemsData = [
      { key: 'bottle', x: 80, action: 'feed' },
      { key: 'teddy', x: 160, action: 'play' },
      { key: 'crib', x: 240, action: 'sleep' }
    ];

    itemsData.forEach(item => {
      const sprite = this.add.sprite(item.x, 250, item.key);
      sprite.setInteractive();
      sprite.setScale(0.6);
      sprite.setData('action', item.action);
      sprite.setData('originalX', item.x);
      sprite.setData('originalY', 250);
      this.input.setDraggable(sprite);
      this.items.add(sprite);
    });
  }

  private setupDragAndDrop() {
    this.input.on('dragstart', (pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.Sprite) => {
      gameObject.setTint(0x808080);
    });

    this.input.on('drag', (pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.Sprite, dragX: number, dragY: number) => {
      gameObject.x = dragX;
      gameObject.y = dragY;
    });

    this.input.on('dragend', (pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.Sprite) => {
      gameObject.clearTint();

      const distance = Phaser.Math.Distance.Between(
        gameObject.x,
        gameObject.y,
        this.baby.x,
        this.baby.y
      );

      if (distance < 80) {
        this.handleItemUsed(gameObject);
      } else {
        this.returnItemToPlace(gameObject);
      }
    });
  }

  private handleItemUsed(item: Phaser.GameObjects.Sprite) {
    const action = item.getData('action');

    switch (action) {
      case 'feed':
        this.babyState.feedBaby();
        console.log('Baby fed! Happiness:', this.babyState.getStats().happiness);
        break;
      case 'play':
        this.babyState.playWithToy();
        console.log('Baby played! Happiness:', this.babyState.getStats().happiness);
        break;
      case 'sleep':
        this.babyState.sleepBaby();
        console.log('Baby sleeping! Energy:', this.babyState.getStats().energy);
        break;
    }

    // Анимация реакции
    this.tweens.add({
      targets: this.baby,
      scaleX: 0.9,
      scaleY: 0.9,
      duration: 200,
      yoyo: true,
      ease: 'Power2'
    });

    // Возвращаем предмет
    this.returnItemToPlace(item);

    // Обновляем статус
    this.updateStatusDisplay();
  }

  private updateBabySprite() {
    // Пока используем только одну текстуру
    this.baby.setTexture('baby-happy');
  }

  private returnItemToPlace(item: Phaser.GameObjects.Sprite) {
    const originalX = item.getData('originalX') || item.x;
    const originalY = item.getData('originalY') || 250;

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
    this.statusText.setText(`Настроение: ${stats.mood}
Счастье: ${Math.round(stats.happiness)}
Голод: ${Math.round(stats.hunger)}
Энергия: ${Math.round(stats.energy)}`);
  }
}