// src/game/GameManager.ts
import * as Phaser from 'phaser';
import { PlayScene } from './scenes/PlayScene';

export class GameManager {
  private game: Phaser.Game | null = null;

  init(containerId: string) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`Container with id "${containerId}" not found`);
      return null;
    }

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: containerId,
      backgroundColor: '#fdf2f8',
      scene: [PlayScene],
      physics: {
        default: 'arcade',
        arcade: { gravity: { x: 0, y: 0 }, debug: false }
      },
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: window.innerWidth,
        height: window.innerHeight
      }
    };

    this.game = new Phaser.Game(config);

    window.addEventListener('resize', this.handleResize);
    return this.game;
  }

  destroy() {
    window.removeEventListener('resize', this.handleResize);
    if (this.game) {
      this.game.destroy(true);
      this.game = null;
    }
  }

  private handleResize = () => {
    if (this.game) {
      this.game.scale.resize(window.innerWidth, window.innerHeight);
    }
  }
}
