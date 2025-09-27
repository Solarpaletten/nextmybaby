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

    // полезные логи, если что-то не загрузилось
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
    // статус слева сверху (как на макете)
    this.statusText = this.add.text(24, 24, '', {
      color: '#ff66a0',
      fontFamily: 'monospace',
      fontSize: '14px',
    });

    // малыш справа, крупно
    const cx = this.scale.width * 0.7;
    const cy = this.scale.height * 0.6;

    this.baby = this.add.sprite(cx, cy, 'baby-happy').setScale(0.75).setDepth(1);

    // предметы слева внизу
    this.bottle = this.makeItem(140, this.scale.height - 100, 'bottle', 'feed');
    this.teddy  = this.makeItem(200, this.scale.height - 100, 'teddy',  'play');
    this.crib   = this.makeItem(265, this.scale.height - 100, 'crib',   'sleep', 0.8);

    this.updateStatusDisplay();
    this.setupDragAndDrop();
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

    this.input.on('drag', (_p: any, obj: Phaser.GameObjects.Sprite, dragX: number, dragY: number) => {
      obj.x = dragX;
      obj.y = dragY;
    });

    this.input.on('dragend', (_p: any, obj: Phaser.GameObjects.Sprite) => {
      obj.clearTint();
      obj.setScale(Math.max(0.4, obj.scaleX / 1.1)); // вернуть размер

      const near = Phaser.Math.Distance.Between(obj.x, obj.y, this.baby.x, this.baby.y) < 120;
      if (near) this.applyAction(obj.getData('action'));
      // предмет ОСТАЁТСЯ там, где его отпустили
    });
  }

  private applyAction(action: 'feed'|'play'|'sleep') {
    switch (action) {
      case 'feed': this.babyState.feedBaby(); break;
      case 'play': this.babyState.playWithToy(); break;
      case 'sleep': this.babyState.sleepBaby(); break;
    }

    // короткая радостная реакция малыша
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
