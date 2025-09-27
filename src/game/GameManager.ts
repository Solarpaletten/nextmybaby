// src/game/GameManager.ts - Финальная версия
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
      width: container.clientWidth || 800,
      height: container.clientHeight || 600,
      parent: containerId,
      backgroundColor: '#fdf2f8',
      scene: [PlayScene],
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { x: 0, y: 0 }, // Указываем оба значения
          debug: false,
        },
      },
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
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
      const canvas = this.game.canvas;
      const container = canvas.parentNode as HTMLElement | null;

      if (container) {
        this.game.scale.resize(container.clientWidth, container.clientHeight);
      }
    }
  };
}
