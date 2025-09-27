// src/game/GameManager.ts - Минимальная версия
import * as Phaser from 'phaser';
import { PlayScene } from './scenes/PlayScene';

export class GameManager {
  private game: Phaser.Game | null = null;

  init(containerId: string) {
    this.game = new Phaser.Game({
      type: Phaser.CANVAS,
      width: 400,
      height: 300,
      parent: containerId,
      scene: PlayScene
    });
    
    return this.game;
  }

  destroy() {
    if (this.game) {
      this.game.destroy(true);
      this.game = null;
    }
  }
}