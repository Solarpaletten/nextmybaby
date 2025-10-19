// src/game/managers/DayNightManager.ts
import * as Phaser from 'phaser';

export type TimeOfDay = 'morning' | 'day' | 'evening' | 'night';

export class DayNightManager {
  private scene: Phaser.Scene;
  private overlay!: Phaser.GameObjects.Rectangle;
  private currentTime: TimeOfDay = 'day';
  private cycleTimer?: Phaser.Time.TimerEvent;

  // Настройки цветов для разного времени суток
  private readonly timeSettings = {
    morning: { color: 0xffd699, alpha: 0.1, name: '🌅 Утро' },
    day: { color: 0xffffff, alpha: 0, name: '☀️ День' },
    evening: { color: 0xff9966, alpha: 0.2, name: '🌆 Вечер' },
    night: { color: 0x000066, alpha: 0.4, name: '🌙 Ночь' },
  };

  constructor(scene: Phaser.Scene, startTime: TimeOfDay = 'day') {
    this.scene = scene;
    this.currentTime = startTime;
    this.create();
  }

  private create(): void {
    // Создаём оверлей для эффекта освещения
    this.overlay = this.scene.add.rectangle(
      400, 300,
      800, 600,
      0xffffff,
      0
    );
    this.overlay.setDepth(50); // Над игрой, но под UI
    this.overlay.setBlendMode(Phaser.BlendModes.MULTIPLY);

    // Применяем начальное время суток
    this.applyTime(this.currentTime, false);
  }

  /**
   * Установить время суток
   */
  public setTime(time: TimeOfDay, animated: boolean = true): void {
    if (this.currentTime === time) return;
    
    this.currentTime = time;
    this.applyTime(time, animated);
  }

  /**
   * Применить эффект времени суток
   */
  private applyTime(time: TimeOfDay, animated: boolean): void {
    const settings = this.timeSettings[time];

    if (animated) {
      // Плавный переход
      this.scene.tweens.add({
        targets: this.overlay,
        fillColor: settings.color,
        alpha: settings.alpha,
        duration: 2000,
        ease: 'Sine.easeInOut',
      });
    } else {
      // Моментально
      this.overlay.setFillStyle(settings.color, settings.alpha);
    }

    console.log(`${settings.name} настало`);
  }

  /**
   * Запустить автоматический цикл день/ночь
   * @param cycleDuration Длительность полного цикла в секундах
   */
  public startAutoCycle(cycleDuration: number = 240): void {
    const phaseTime = cycleDuration / 4;

    this.cycleTimer = this.scene.time.addEvent({
      delay: phaseTime * 1000,
      callback: () => this.nextPhase(),
      loop: true,
    });

    console.log(`🔄 Автоцикл запущен (полный цикл: ${cycleDuration}с)`);
  }

  /**
   * Остановить автоцикл
   */
  public stopAutoCycle(): void {
    if (this.cycleTimer) {
      this.cycleTimer.destroy();
      this.cycleTimer = undefined;
      console.log('⏹️ Автоцикл остановлен');
    }
  }

  /**
   * Следующая фаза дня
   */
  private nextPhase(): void {
    const sequence: TimeOfDay[] = ['morning', 'day', 'evening', 'night'];
    const currentIndex = sequence.indexOf(this.currentTime);
    const nextIndex = (currentIndex + 1) % sequence.length;
    this.setTime(sequence[nextIndex]);
  }

  /**
   * Получить текущее время суток
   */
  public getCurrentTime(): TimeOfDay {
    return this.currentTime;
  }

  /**
   * Установить время по реальному времени пользователя
   */
  public setTimeByRealTime(): void {
    const hour = new Date().getHours();
    
    let time: TimeOfDay;
    if (hour >= 5 && hour < 12) {
      time = 'morning';
    } else if (hour >= 12 && hour < 17) {
      time = 'day';
    } else if (hour >= 17 && hour < 21) {
      time = 'evening';
    } else {
      time = 'night';
    }

    this.setTime(time, false);
    console.log(`⏰ Время установлено по реальному: ${hour}:00`);
  }

  /**
   * Уничтожить менеджер
   */
  public destroy(): void {
    this.stopAutoCycle();
    this.overlay.destroy();
  }
}