// src/game/scenes/PlayScene.ts
import * as Phaser from 'phaser';
import { BabyState } from '../entities/BabyState';

export class PlayScene extends Phaser.Scene {
  private baby!: Phaser.GameObjects.Sprite;
  private bottle!: Phaser.GameObjects.Sprite;
  private teddy!: Phaser.GameObjects.Sprite;
  private crib!: Phaser.GameObjects.Sprite;
  private babyState = new BabyState();
  private statusText!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'PlayScene' });
  }

  preload() {
    // чтобы пути работали и локально, и на Render
    this.load.setPath('/mybaby/');

    this.load.on('loaderror', (file: any) => {
      console.error('Load error:', file?.src || file);
    });
    this.load.on('filecomplete-image-baby-happy', () => console.log('baby.png loaded'));
    this.load.on('complete', () => console.log('All assets loaded'));

    this.load.image('baby-happy', 'baby.png');
    this.load.image('bottle', 'bottle.png');
    this.load.image('teddy', 'teddy.png');
    this.load.image('crib', 'crib.png');
  }

  create() {
    const w = this.scale.width;
    const h = this.scale.height;

    // статус слева сверху
    this.statusText = this.add.text(24, 24, '', {
      color: '#ff66a0',
      fontFamily: 'monospace',
      fontSize: '14px',
    });

    // малыш в центре, но теперь тоже draggable
    this.baby = this.add.sprite(cx, cy, 'baby-happy')
      .setScale(0.75)
      .setDepth(1)
      .setInteractive({ draggable: true }); // как у предметов

    // предметы по углам
    this.bottle = this.makeItem(100, h - 100, 'bottle', 'feed');
    this.teddy = this.makeItem(w - 100, h - 100, 'teddy', 'play');
    this.crib = this.makeItem(100, 100, 'crib', 'sleep', 0.8);

    // кнопка на полный экран
    this.addFullScreenButton();

    this.updateStatusDisplay();
    this.setupDragAndDrop();

    // реакция на ресайз окна
    this.scale.on('resize', (gameSize: Phaser.Structs.Size) => {
      const { width, height } = gameSize;
      this.repositionElements(width, height);
    });
  }

  private repositionElements(w: number, h: number) {
    if (this.baby) this.baby.setPosition(w / 2, h / 2);
    if (this.bottle) this.bottle.setPosition(100, h - 100);
    if (this.teddy) this.teddy.setPosition(w - 100, h - 100);
    if (this.crib) this.crib.setPosition(100, 100);
    if (this.statusText) this.statusText.setPosition(24, 24);
  }

  private addFullScreenButton() {
    const button = this.add.text(this.scale.width - 60, 20, '📺', {
      fontSize: '32px',
      backgroundColor: '#fff',
      padding: { left: 8, right: 8, top: 4, bottom: 4 }
    })
      .setInteractive()
      .setScrollFactor(0)
      .setDepth(10);

    button.on('pointerdown', () => {
      if (this.scale.isFullscreen) {
        this.scale.stopFullscreen();
      } else {
        this.scale.startFullscreen();
      }
    });
  }

  private makeItem(x: number, y: number, key: string, action: string, scale = 0.6) {
    const s = this.add.sprite(x, y, key).setScale(scale).setDepth(2);
    s.setInteractive({ draggable: true });
    s.setData('action', action);
    return s;
  }

  private setupDragAndDrop() {
    this.input.on('dragstart', (_p: any, obj: Phaser.GameObjects.Sprite) => {
      obj.setTint(0x808080);
      obj.setScale(obj.scaleX * 1.1);
    });

    this.input.on('drag', (_p, obj: Phaser.GameObjects.Sprite, dragX, dragY) => {
      obj.x = dragX;
      obj.y = dragY;
    });

    this.input.on('dragend', (_p: any, obj: Phaser.GameObjects.Sprite) => {
      obj.clearTint();
      obj.setScale(Math.max(0.4, obj.scaleX / 1.1));

      const near = Phaser.Math.Distance.Between(obj.x, obj.y, this.baby.x, this.baby.y) < 120;
      if (near) this.applyAction(obj.getData('action'));
    });
  }

  private applyAction(action: 'feed' | 'play' | 'sleep') {
    switch (action) {
      case 'feed': this.babyState.feedBaby(); break;
      case 'play': this.babyState.playWithToy(); break;
      case 'sleep': this.babyState.sleepBaby(); break;
    }

    this.tweens.add({
      targets: this.baby,
      scaleX: this.baby.scaleX * 0.95,
      scaleY: this.baby.scaleY * 0.95,
      yoyo: true,
      duration: 180,
      ease: 'Sine.easeInOut',
    });

    this.updateStatusDisplay();
  }

  private updateStatusDisplay() {
    const s = this.babyState.getStats();
    this.statusText.setText(
      `Настроение: ${s.mood}\nСчастье: ${Math.round(s.happiness)}\nГолод: ${Math.round(s.hunger)}\nЭнергия: ${Math.round(s.energy)}`
    );
  }
}
