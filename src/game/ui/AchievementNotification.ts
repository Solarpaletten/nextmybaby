// src/game/ui/AchievementNotification.ts
import * as Phaser from 'phaser';
import { Achievement } from '../state/GameState';

export class AchievementNotification {
  private scene: Phaser.Scene;
  private container!: Phaser.GameObjects.Container;
  private static activeNotifications: number = 0;

  constructor(scene: Phaser.Scene, achievement: Achievement) {
    this.scene = scene;
    this.show(achievement);
  }

  private show(achievement: Achievement): void {
    // Позиция (с учётом других уведомлений)
    const yOffset = AchievementNotification.activeNotifications * 90;
    const startX = 850; // За экраном справа
    const endX = 600;   // Финальная позиция

    // Контейнер для всего уведомления
    this.container = this.scene.add.container(startX, 100 + yOffset);
    this.container.setDepth(200);

    // Фон уведомления (карточка)
    const bg = this.scene.add.rectangle(0, 0, 220, 70, 0xffffff, 1);
    bg.setStrokeStyle(3, 0xffd700);
    this.container.add(bg);

    // Сияние (золотой border эффект)
    const glow = this.scene.add.rectangle(0, 0, 220, 70, 0xffd700, 0.3);
    this.container.add(glow);

    // Пульсация сияния
    this.scene.tweens.add({
      targets: glow,
      alpha: { from: 0.3, to: 0.6 },
      duration: 800,
      yoyo: true,
      repeat: 2,
    });

    // Иконка достижения
    const icon = this.scene.add.text(-90, 0, achievement.icon, {
      fontSize: '36px',
    });
    icon.setOrigin(0.5);
    this.container.add(icon);

    // Заголовок "🏆 Достижение!"
    const title = this.scene.add.text(10, -20, '🏆 Достижение!', {
      fontSize: '14px',
      color: '#ffd700',
      fontStyle: 'bold',
    });
    title.setOrigin(0, 0.5);
    this.container.add(title);

    // Название достижения
    const name = this.scene.add.text(10, 5, achievement.name, {
      fontSize: '16px',
      color: '#333333',
      fontStyle: 'bold',
    });
    name.setOrigin(0, 0.5);
    this.container.add(name);

    // Описание
    const description = this.scene.add.text(10, 22, achievement.description, {
      fontSize: '11px',
      color: '#666666',
      wordWrap: { width: 180 },
    });
    description.setOrigin(0, 0.5);
    this.container.add(description);

    // Звёздочки вокруг (эффект)
    for (let i = 0; i < 3; i++) {
      const star = this.scene.add.text(
        Phaser.Math.Between(-110, 110),
        Phaser.Math.Between(-40, 40),
        '✨',
        { fontSize: '20px' }
      );
      star.setOrigin(0.5);
      this.container.add(star);

      // Анимация звёздочек
      this.scene.tweens.add({
        targets: star,
        alpha: 0,
        y: star.y - 30,
        duration: 1500,
        ease: 'Power2',
      });
    }

    AchievementNotification.activeNotifications++;

    // Анимация появления (slide in)
    this.scene.tweens.add({
      targets: this.container,
      x: endX,
      duration: 500,
      ease: 'Back.easeOut',
    });

    // Автоматическое исчезновение через 4 секунды
    this.scene.time.delayedCall(4000, () => {
      this.hide();
    });
  }

  private hide(): void {
    // Анимация исчезновения (slide out)
    this.scene.tweens.add({
      targets: this.container,
      x: 850,
      alpha: 0,
      duration: 400,
      ease: 'Back.easeIn',
      onComplete: () => {
        this.container.destroy();
        AchievementNotification.activeNotifications--;
      },
    });
  }

  public static resetCounter(): void {
    AchievementNotification.activeNotifications = 0;
  }
}