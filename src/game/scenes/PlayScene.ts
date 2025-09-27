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
    // Загружаем ассеты
    this.load.image('baby-sad', '/mybaby/baby.png');
    this.load.image('baby-happy', '/mybaby/babysmile.svg');
    this.load.image('bottle', '/mybaby/bottle.png');
    this.load.image('teddy', '/mybaby/teddy.png');
    this.load.image('crib', '/mybaby/crib.png');
  }

  create() {
    // Создаем малыша в центре
    this.baby = this.add.sprite(400, 300, 'baby-sad');
    this.baby.setInteractive();
    this.baby.setScale(0.8);
    
    // Делаем малыша перетаскиваемым
    this.input.setDraggable(this.baby);

    // Создаем группу предметов
    this.items = this.add.group();
    this.createItems();

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

  private createItems() {
    // Создаем предметы внизу экрана
    const itemsData = [
      { key: 'bottle', x: 200, action: 'feed' },
      { key: 'teddy', x: 300, action: 'play' },
      { key: 'crib', x: 400, action: 'sleep' }
    ];

    itemsData.forEach(item => {
      const sprite = this.add.sprite(item.x, 500, item.key);
      sprite.setInteractive();
      sprite.setScale(0.6);
      sprite.setData('action', item.action);
      sprite.setData('originalX', item.x);
      sprite.setData('originalY', 500);
      this.input.setDraggable(sprite);
      this.items.add(sprite);
    });
  }

  private setupDragAndDrop() {
    // Drag события
    this.input.on('dragstart', (pointer: any, gameObject: Phaser.GameObjects.GameObject) => {
      gameObject.setTint(0x808080);
    });

    this.input.on('drag', (pointer: any, gameObject: Phaser.GameObjects.GameObject, dragX: number, dragY: number) => {
      gameObject.x = dragX;
      gameObject.y = dragY;
    });

    this.input.on('dragend', (pointer: any, gameObject: Phaser.GameObjects.GameObject) => {
      gameObject.clearTint();
      
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

  private handleItemUsed(item: Phaser.GameObjects.GameObject) {
    const action = item.getData('action');
    let newMood;

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
    }

    // Обновляем спрайт малыша
    this.updateBabySprite(newMood);
    
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

  private updateBabySprite(mood?: string) {
    const currentMood = mood || this.babyState.getStats().mood;
    const texture = currentMood === 'happy' ? 'baby-happy' : 'baby-sad';
    this.baby.setTexture(texture);
  }

  private returnItemToPlace(item: Phaser.GameObjects.GameObject) {
    const originalX = item.getData('originalX') || item.x;
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
    `);
  }
}