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

    this.load.audio('bg-music', 'audio/happy_birthday.mp3'); // <-- музыка
  }

  create() {
    const w = this.scale.width;
    const h = this.scale.height;

    const cx = w / 2;
    const cy = h / 2;

    // малыш
    this.baby = this.add.sprite(cx, cy, 'baby-happy')
      .setScale(0.75)
      .setDepth(1)
      .setInteractive({ draggable: true });

    // предметы
    this.bottle = this.makeItem(100, h - 100, 'bottle', 'feed');
    this.teddy = this.makeItem(w - 100, h - 100, 'teddy', 'play');
    this.crib = this.makeItem(100, 100, 'crib', 'sleep', 0.8);

    // создаём статус в левом верхнем углу
    this.statusText = this.add.text(24, 24, '', {
      font: '16px Arial',
      color: '#ff69b4',
      align: 'left'
    }).setDepth(5);

    // кнопка fullscreen
    this.addFullScreenButton();

    // обработчик ресайза
    this.scale.on('resize', (gameSize: Phaser.Structs.Size) => {
      const { width, height } = gameSize;
      this.repositionElements(width, height);
    });

    // теперь безопасно
    this.updateStatusDisplay();
    this.setupDragAndDrop();
  }

  const music = this.sound.add('bg-music', {
    loop: true,
    volume: 0.6, // настрой громкость
  });
  
  this.input.once('pointerdown', () => {
    music.play();
  });

const musicToggle = this.add.text(20, this.scale.height - 40, '🔊 Музыка', {
  fontSize: '18px',
  backgroundColor: '#ffffff',
  color: '#000000',
  padding: { left: 6, right: 6, top: 2, bottom: 2 },
})
  .setInteractive()
  .setDepth(10);

let musicPlaying = false;

musicToggle.on('pointerdown', () => {
  if (!musicPlaying) {
    music.play();
    musicToggle.setText('🔇 Выключить');
  } else {
    music.stop();
    musicToggle.setText('🔊 Музыка');
  }
  musicPlaying = !musicPlaying;
});
  
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
  this.input.on('dragstart', (_p: Phaser.Input.Pointer, obj: Phaser.GameObjects.Sprite) => {
    obj.setTint(0x808080);
    obj.setScale(obj.scaleX * 1.1);
  });

  this.input.on(
    'drag',
    (_p: Phaser.Input.Pointer, obj: Phaser.GameObjects.Sprite, dragX: number, dragY: number) => {
      obj.x = dragX;
      obj.y = dragY;
    }
  );

  this.input.on('dragend', (_p: Phaser.Input.Pointer, obj: Phaser.GameObjects.Sprite) => {
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
