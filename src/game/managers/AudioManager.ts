// src/game/managers/AudioManager.ts
import * as Phaser from 'phaser';

export type MusicTrack = 'bedroom' | 'kitchen' | 'playroom' | 'bathroom';
export type SoundEffect = 'feed' | 'play' | 'sleep' | 'bath' | 'achievement' | 'unlock';

export class AudioManager {
  private scene: Phaser.Scene;
  private currentMusic?: Phaser.Sound.BaseSound;
  private musicVolume: number = 0.3;
  private sfxVolume: number = 0.5;
  private musicEnabled: boolean = true;
  private sfxEnabled: boolean = true;

  // Mapping музыки для комнат
  private readonly musicTracks: Record<MusicTrack, string> = {
    bedroom: 'lullaby_ambient',
    kitchen: 'kitchen_morning',
    playroom: 'playful_melody',
    bathroom: 'water_bubbles',
  };

  // Mapping звуковых эффектов
  private readonly soundEffects: Record<SoundEffect, string> = {
    feed: 'nom_nom',
    play: 'giggle',
    sleep: 'yawn',
    bath: 'splash',
    achievement: 'achievement_unlock',
    unlock: 'room_unlock',
  };

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.loadSettings();
  }

  /**
   * Загрузка всех аудио-файлов (вызывать в preload)
   */
  public static preloadAudio(scene: Phaser.Scene): void {
    // Ambient музыка
    scene.load.audio('lullaby_ambient', '/mybaby/audio/ambient/lullaby_ambient.mp3');
    scene.load.audio('kitchen_morning', '/mybaby/audio/ambient/kitchen_morning.mp3');
    scene.load.audio('playful_melody', '/mybaby/audio/ambient/playful_melody.mp3');
    scene.load.audio('water_bubbles', '/mybaby/audio/ambient/water_bubbles.mp3');

    // Звуковые эффекты
    scene.load.audio('nom_nom', '/mybaby/audio/effects/nom_nom.mp3');
    scene.load.audio('giggle', '/mybaby/audio/effects/giggle.mp3');
    scene.load.audio('yawn', '/mybaby/audio/effects/yawn.mp3');
    scene.load.audio('splash', '/mybaby/audio/effects/splash.mp3');
    scene.load.audio('achievement_unlock', '/mybaby/audio/effects/achievement.mp3');
    scene.load.audio('room_unlock', '/mybaby/audio/effects/unlock.mp3');
  }

  /**
   * Воспроизведение фоновой музыки
   */
  public playMusic(track: MusicTrack, fadeIn: boolean = true): void {
    if (!this.musicEnabled) return;

    const trackKey = this.musicTracks[track];

    // Останавливаем текущую музыку
    if (this.currentMusic) {
      if (fadeIn) {
        this.fadeOutMusic(() => this.startMusic(trackKey, fadeIn));
      } else {
        this.currentMusic.stop();
        this.currentMusic.destroy();
        this.startMusic(trackKey, fadeIn);
      }
    } else {
      this.startMusic(trackKey, fadeIn);
    }
  }

  /**
   * Запуск музыки
   */
  private startMusic(trackKey: string, fadeIn: boolean): void {
    if (!this.scene.sound.get(trackKey)) {
      this.currentMusic = this.scene.sound.add(trackKey, {
        loop: true,
        volume: fadeIn ? 0 : this.musicVolume,
      });
    } else {
      this.currentMusic = this.scene.sound.get(trackKey);
    }

    this.currentMusic.play();

    if (fadeIn) {
      this.scene.tweens.add({
        targets: this.currentMusic,
        volume: this.musicVolume,
        duration: 1500,
        ease: 'Linear',
      });
    }

    console.log(`🎵 Играет: ${trackKey}`);
  }

  /**
   * Плавное затухание музыки
   */
  private fadeOutMusic(onComplete?: () => void): void {
    if (!this.currentMusic) return;

    this.scene.tweens.add({
      targets: this.currentMusic,
      volume: 0,
      duration: 1000,
      ease: 'Linear',
      onComplete: () => {
        if (this.currentMusic) {
          this.currentMusic.stop();
          this.currentMusic.destroy();
          this.currentMusic = undefined;
        }
        if (onComplete) onComplete();
      },
    });
  }

  /**
   * Воспроизведение звукового эффекта
   */
  public playSound(effect: SoundEffect, volume?: number): void {
    if (!this.sfxEnabled) return;

    const effectKey = this.soundEffects[effect];
    const finalVolume = volume ?? this.sfxVolume;

    const sound = this.scene.sound.add(effectKey, {
      volume: finalVolume,
    });

    sound.play();

    // Автоматическое удаление после проигрывания
    sound.once('complete', () => {
      sound.destroy();
    });

    console.log(`🔊 Звук: ${effectKey}`);
  }

  /**
   * Остановка всей музыки
   */
  public stopMusic(fadeOut: boolean = true): void {
    if (fadeOut) {
      this.fadeOutMusic();
    } else {
      if (this.currentMusic) {
        this.currentMusic.stop();
        this.currentMusic.destroy();
        this.currentMusic = undefined;
      }
    }
  }

  /**
   * Пауза музыки
   */
  public pauseMusic(): void {
    if (this.currentMusic && this.currentMusic.isPlaying) {
      this.currentMusic.pause();
      console.log('⏸️ Музыка на паузе');
    }
  }

  /**
   * Возобновление музыки
   */
  public resumeMusic(): void {
    if (this.currentMusic && this.currentMusic.isPaused) {
      this.currentMusic.resume();
      console.log('▶️ Музыка возобновлена');
    }
  }

  /**
   * Установка громкости музыки
   */
  public setMusicVolume(volume: number): void {
    this.musicVolume = Phaser.Math.Clamp(volume, 0, 1);
    if (this.currentMusic) {
      this.currentMusic.setVolume(this.musicVolume);
    }
    this.saveSettings();
  }

  /**
   * Установка громкости звуковых эффектов
   */
  public setSfxVolume(volume: number): void {
    this.sfxVolume = Phaser.Math.Clamp(volume, 0, 1);
    this.saveSettings();
  }

  /**
   * Включение/выключение музыки
   */
  public toggleMusic(enabled?: boolean): void {
    this.musicEnabled = enabled ?? !this.musicEnabled;
    
    if (!this.musicEnabled && this.currentMusic) {
      this.stopMusic(true);
    }
    
    this.saveSettings();
    console.log(`🎵 Музыка: ${this.musicEnabled ? 'ВКЛ' : 'ВЫКЛ'}`);
  }

  /**
   * Включение/выключение звуковых эффектов
   */
  public toggleSfx(enabled?: boolean): void {
    this.sfxEnabled = enabled ?? !this.sfxEnabled;
    this.saveSettings();
    console.log(`🔊 Звуки: ${this.sfxEnabled ? 'ВКЛ' : 'ВЫКЛ'}`);
  }

  /**
   * Получение текущих настроек
   */
  public getSettings() {
    return {
      musicVolume: this.musicVolume,
      sfxVolume: this.sfxVolume,
      musicEnabled: this.musicEnabled,
      sfxEnabled: this.sfxEnabled,
    };
  }

  /**
   * Сохранение настроек в localStorage
   */
  private saveSettings(): void {
    const settings = {
      musicVolume: this.musicVolume,
      sfxVolume: this.sfxVolume,
      musicEnabled: this.musicEnabled,
      sfxEnabled: this.sfxEnabled,
    };
    localStorage.setItem('babyverse_audio_settings', JSON.stringify(settings));
  }

  /**
   * Загрузка настроек из localStorage
   */
  private loadSettings(): void {
    const saved = localStorage.getItem('babyverse_audio_settings');
    if (saved) {
      try {
        const settings = JSON.parse(saved);
        this.musicVolume = settings.musicVolume ?? 0.3;
        this.sfxVolume = settings.sfxVolume ?? 0.5;
        this.musicEnabled = settings.musicEnabled ?? true;
        this.sfxEnabled = settings.sfxEnabled ?? true;
      } catch (error) {
        console.error('Ошибка загрузки аудио настроек:', error);
      }
    }
  }

  /**
   * Уничтожение менеджера
   */
  public destroy(): void {
    this.stopMusic(false);
  }
}