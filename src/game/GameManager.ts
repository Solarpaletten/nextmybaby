// src/game/GameManager.ts - Полноэкранная версия
import { GameManager } from '../../game/GameManager';
import { PlayScene } from './scenes/PlayScene';

export class GameManager {
  private game: Phaser.Game | null = null;

  init(containerId: string) {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: window.innerWidth - 100, // Почти на весь экран с отступами
      height: window.innerHeight - 200, // Оставляем место для заголовка
      parent: containerId,
      backgroundColor: '#fdf2f8',
      scene: [PlayScene],
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0, x: 0 },
          debug: false
        }
      },
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
      }
    };

    this.game = new Phaser.Game(config);

    // Обработка изменения размера окна
    window.addEventListener('resize', () => {
      if (this.game) {
        this.game.scale.resize(window.innerWidth - 100, window.innerHeight - 200);
      }
    });

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
      this.game.scale.resize(window.innerWidth - 100, window.innerHeight - 200);
    }
  }
}