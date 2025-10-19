// src/game/ui/SaveMenuUI.ts
import * as Phaser from 'phaser';
import { GameState } from '../state/GameState';
import { LocalStorageManager } from '../managers/LocalStorageManager';

export class SaveMenuUI {
  private scene: Phaser.Scene;
  private gameState: GameState;
  private container!: Phaser.GameObjects.Container;
  private isVisible: boolean = false;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.gameState = GameState.getInstance();
    this.createToggleButton();
  }

  private createToggleButton(): void {
    // Кнопка открытия меню (правый верхний угол)
    const button = this.scene.add.text(750, 20, '⚙️', {
      fontSize: '32px',
    });
    button.setOrigin(1, 0);
    button.setInteractive({ useHandCursor: true });
    button.setDepth(150);

    button.on('pointerdown', () => {
      if (this.isVisible) {
        this.hide();
      } else {
        this.show();
      }
    });

    button.on('pointerover', () => {
      button.setScale(1.1);
    });

    button.on('pointerout', () => {
      button.setScale(1);
    });
  }

  private show(): void {
    if (this.container) return;

    this.isVisible = true;
    this.container = this.scene.add.container(400, 300);
    this.container.setDepth(160);

    // Затемнённый фон
    const overlay = this.scene.add.rectangle(0, 0, 800, 600, 0x000000, 0.7);
    overlay.setOrigin(0.5);
    overlay.setInteractive();
    this.container.add(overlay);

    // Панель меню
    const panel = this.scene.add.rectangle(0, 0, 400, 350, 0xffffff, 1);
    panel.setStrokeStyle(4, 0xff69b4);
    this.container.add(panel);

    // Заголовок
    const title = this.scene.add.text(0, -140, '⚙️ Настройки', {
      fontSize: '28px',
      color: '#ff69b4',
      fontStyle: 'bold',
    });
    title.setOrigin(0.5);
    this.container.add(title);

    // Информация о сохранении
    const saveInfo = LocalStorageManager.getSaveInfo();
    let infoText = '';
    if (saveInfo.exists) {
      const date = saveInfo.timestamp!;
      infoText = `Последнее сохранение:\n${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    } else {
      infoText = 'Сохранений пока нет';
    }

    const info = this.scene.add.text(0, -70, infoText, {
      fontSize: '16px',
      color: '#666666',
      align: 'center',
    });
    info.setOrigin(0.5);
    this.container.add(info);

    // Кнопки действий
    this.createActionButton(0, -10, '💾 Сохранить сейчас', () => {
      LocalStorageManager.saveState(this.gameState);
      this.showNotification('✅ Игра сохранена!');
      this.hide();
    });

    this.createActionButton(0, 50, '📂 Загрузить', () => {
      const loaded = LocalStorageManager.loadState();
      if (loaded) {
        LocalStorageManager.applyLoadedState(this.gameState, loaded);
        this.showNotification('✅ Игра загружена!');
        // Перезапускаем текущую сцену
        this.scene.scene.restart();
        this.hide();
      } else {
        this.showNotification('❌ Сохранение не найдено');
      }
    });

    this.createActionButton(0, 110, '🗑️ Сбросить прогресс', () => {
      this.showConfirmDialog();
    });

    // Кнопка закрытия
    const closeButton = this.scene.add.text(0, 150, '✖ Закрыть', {
      fontSize: '18px',
      color: '#999999',
    });
    closeButton.setOrigin(0.5);
    closeButton.setInteractive({ useHandCursor: true });
    closeButton.on('pointerdown', () => this.hide());
    this.container.add(closeButton);

    // Анимация появления
    this.container.setScale(0.8);
    this.container.setAlpha(0);
    this.scene.tweens.add({
      targets: this.container,
      scale: 1,
      alpha: 1,
      duration: 300,
      ease: 'Back.easeOut',
    });
  }

  private hide(): void {
    if (!this.container) return;

    this.scene.tweens.add({
      targets: this.container,
      scale: 0.8,
      alpha: 0,
      duration: 200,
      ease: 'Power2',
      onComplete: () => {
        this.container.destroy();
        this.container = null as any;
        this.isVisible = false;
      },
    });
  }

  private createActionButton(x: number, y: number, text: string, callback: () => void): void {
    const button = this.scene.add.rectangle(x, y, 320, 45, 0xff69b4, 1);
    button.setStrokeStyle(2, 0xff85c0);
    button.setInteractive({ useHandCursor: true });

    const label = this.scene.add.text(x, y, text, {
      fontSize: '18px',
      color: '#ffffff',
      fontStyle: 'bold',
    });
    label.setOrigin(0.5);

    button.on('pointerover', () => {
      button.setFillStyle(0xff85c0);
      button.setScale(1.05);
      label.setScale(1.05);
    });

    button.on('pointerout', () => {
      button.setFillStyle(0xff69b4);
      button.setScale(1);
      label.setScale(1);
    });

    button.on('pointerdown', callback);

    this.container.add(button);
    this.container.add(label);
  }

  private showConfirmDialog(): void {
    const confirmOverlay = this.scene.add.rectangle(0, 0, 350, 200, 0xffffff, 1);
    confirmOverlay.setStrokeStyle(3, 0xff5252);

    const confirmText = this.scene.add.text(0, -40, 'Удалить все сохранения?\nЭто действие необратимо!', {
      fontSize: '16px',
      color: '#ff5252',
      align: 'center',
      fontStyle: 'bold',
    });
    confirmText.setOrigin(0.5);

    const yesButton = this.scene.add.rectangle(-80, 40, 120, 40, 0xff5252, 1);
    const yesLabel = this.scene.add.text(-80, 40, 'Да, удалить', {
      fontSize: '14px',
      color: '#ffffff',
    });
    yesLabel.setOrigin(0.5);
    yesButton.setInteractive({ useHandCursor: true });

    yesButton.on('pointerdown', () => {
      LocalStorageManager.clearState();
      this.showNotification('🗑️ Прогресс сброшен');
      this.scene.scene.restart();
      this.hide();
    });

    const noButton = this.scene.add.rectangle(80, 40, 120, 40, 0x4caf50, 1);
    const noLabel = this.scene.add.text(80, 40, 'Отмена', {
      fontSize: '14px',
      color: '#ffffff',
    });
    noLabel.setOrigin(0.5);
    noButton.setInteractive({ useHandCursor: true });

    noButton.on('pointerdown', () => {
      confirmOverlay.destroy();
      confirmText.destroy();
      yesButton.destroy();
      yesLabel.destroy();
      noButton.destroy();
      noLabel.destroy();
    });

    this.container.add([confirmOverlay, confirmText, yesButton, yesLabel, noButton, noLabel]);
  }

  private showNotification(text: string): void {
    const notification = this.scene.add.text(400, 50, text, {
      fontSize: '20px',
      color: '#ffffff',
      backgroundColor: '#333333',
      padding: { x: 20, y: 10 },
    });
    notification.setOrigin(0.5);
    notification.setDepth(200);

    this.scene.tweens.add({
      targets: notification,
      y: 80,
      alpha: 0,
      duration: 2000,
      ease: 'Power2',
      onComplete: () => notification.destroy(),
    });
  }

  public destroy(): void {
    if (this.container) {
      this.container.destroy();
    }
  }
}