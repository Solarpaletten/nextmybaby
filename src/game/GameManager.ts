// src/game/GameManager.ts
import * as Phaser from 'phaser';
import { PlayScene } from './scenes/PlayScene';

export class GameManager {
  private game: Phaser.Game | null = null;
  private resizeHandler = () => {};

  init(containerId: string) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`Container with id "${containerId}" not found`);
      return null;
    }

    const width = container.clientWidth || 900;
    const height = container.clientHeight || 520;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: containerId,
      width,
      height,
      backgroundColor: '#fdecef',
      scene: [PlayScene],
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { x: 0, y: 0 },
          debug: false,
        },
      },
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
    };

    this.game = new Phaser.Game(config);

    // ресайз под размеры контейнера
    this.resizeHandler = () => {
      if (this.game && container) {
        this.game.scale.resize(container.clientWidth, container.clientHeight);
      }
    };
    window.addEventListener('resize', this.resizeHandler);

    return this.game;
  }

  destroy() {
    window.removeEventListener('resize', this.resizeHandler);
    if (this.game) {
      this.game.destroy(true);
      this.game = null;
    }
  }
}
