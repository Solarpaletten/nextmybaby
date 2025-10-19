// src/game/ui/StatsOverlay.ts
import * as Phaser from 'phaser';
import { GameState } from '../state/GameState';

export class StatsOverlay {
  private scene: Phaser.Scene;
  private gameState: GameState;
  private container!: Phaser.GameObjects.Container;
  
  // UI элементы
  private happinessText!: Phaser.GameObjects.Text;
  private energyText!: Phaser.GameObjects.Text;
  private hungerText!: Phaser.GameObjects.Text;
  
  private happinessBar!: Phaser.GameObjects.Graphics;
  private energyBar!: Phaser.GameObjects.Graphics;
  private hungerBar!: Phaser.GameObjects.Graphics;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.gameState = GameState.getInstance();
    this.create();
  }

  private create(): void {
    // Контейнер для всей панели
    this.container = this.scene.add.container(0, 0);
    this.container.setDepth(100);

    // Фон панели
    const bg = this.scene.add.rectangle(400, 30, 780, 50, 0xffffff, 0.9);
    bg.setStrokeStyle(2, 0xffb6d9);
    this.container.add(bg);

    // Создаем показатели
    this.createStatDisplay('❤️', 80, 30, 'happiness');
    this.createStatDisplay('⚡', 280, 30, 'energy');
    this.createStatDisplay('🍽️', 480, 30, 'hunger');

    // Имя малыша
    const babyName = this.scene.add.text(650, 30, '👶 Малыш', {
      fontSize: '18px',
      color: '#ff69b4',
      fontStyle: 'bold',
    });
    babyName.setOrigin(0.5);
    this.container.add(babyName);

    // Запускаем обновление каждые 100мс
    this.scene.time.addEvent({
      delay: 100,
      callback: () => this.update(),
      loop: true,
    });
  }

  private createStatDisplay(icon: string, x: number, y: number, type: 'happiness' | 'energy' | 'hunger'): void {
    // Иконка
    const iconText = this.scene.add.text(x - 80, y, icon, {
      fontSize: '24px',
    });
    iconText.setOrigin(0.5);
    this.container.add(iconText);

    // Фон прогресс-бара
    const barBg = this.scene.add.graphics();
    barBg.fillStyle(0xe0e0e0, 1);
    barBg.fillRoundedRect(x - 50, y - 8, 100, 16, 8);
    this.container.add(barBg);

    // Прогресс-бар
    const bar = this.scene.add.graphics();
    this.container.add(bar);

    // Текст значения
    const valueText = this.scene.add.text(x, y, '100', {
      fontSize: '14px',
      color: '#333333',
      fontStyle: 'bold',
    });
    valueText.setOrigin(0.5);
    this.container.add(valueText);

    // Сохраняем ссылки
    if (type === 'happiness') {
      this.happinessBar = bar;
      this.happinessText = valueText;
    } else if (type === 'energy') {
      this.energyBar = bar;
      this.energyText = valueText;
    } else {
      this.hungerBar = bar;
      this.hungerText = valueText;
    }
  }

  private update(): void {
    const stats = this.gameState.babyState.getStats();

    // Обновляем счастье
    this.updateBar(
      this.happinessBar,
      this.happinessText,
      stats.happiness,
      80 - 50,
      30 - 8,
      this.getColorForStat(stats.happiness)
    );

    // Обновляем энергию
    this.updateBar(
      this.energyBar,
      this.energyText,
      stats.energy,
      280 - 50,
      30 - 8,
      this.getColorForStat(stats.energy)
    );

    // Обновляем голод (инверсия: чем меньше, тем лучше)
    this.updateBar(
      this.hungerBar,
      this.hungerText,
      100 - stats.hunger,
      480 - 50,
      30 - 8,
      this.getColorForHunger(stats.hunger)
    );
  }

  private updateBar(
    bar: Phaser.GameObjects.Graphics,
    text: Phaser.GameObjects.Text,
    value: number,
    x: number,
    y: number,
    color: number
  ): void {
    const clampedValue = Phaser.Math.Clamp(value, 0, 100);
    const width = (clampedValue / 100) * 100;

    bar.clear();
    bar.fillStyle(color, 1);
    bar.fillRoundedRect(x, y, width, 16, 8);

    text.setText(Math.round(clampedValue).toString());
  }

  private getColorForStat(value: number): number {
    if (value >= 70) return 0x4caf50; // Зелёный
    if (value >= 40) return 0xffc107; // Жёлтый
    return 0xff5252; // Красный
  }

  private getColorForHunger(hunger: number): number {
    // Инверсия: чем больше голод, тем хуже
    if (hunger <= 30) return 0x4caf50; // Зелёный
    if (hunger <= 60) return 0xffc107; // Жёлтый
    return 0xff5252; // Красный
  }

  public destroy(): void {
    this.container.destroy();
  }
}