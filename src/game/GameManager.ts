import * as Phaser from 'phaser';
import { PlayScene } from './scenes/PlayScene';

export class GameManager {
  private game: Phaser.Game | null = null;

  init(containerId: string) {
    if (this.game) return this.game; // защита от повторного запуска

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: window.innerWidth - 100,
      height: window.innerHeight - 200,
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

    // Правильно вешаем resize
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
      this.game.scale.resize(window.innerWidth - 100, window.innerHeight - 200);
    }
  };
}
