// src/game/entities/BabyState.ts
export class BabyState {
    private happiness = 50;
    private hunger = 50;
    private energy = 50;
    private health = 100;
    private currentMood: 'sad' | 'happy' | 'sleeping' | 'playing' = 'sad';
  
    constructor() {
      // Автоматическое снижение параметров со временем
      setInterval(() => {
        this.hunger = Math.max(0, this.hunger - 1);
        this.energy = Math.max(0, this.energy - 0.5);
        this.updateMood();
      }, 5000); // каждые 5 секунд
    }
  
    feedBaby(nutritionValue: number = 20) {
      this.hunger = Math.min(100, this.hunger + nutritionValue);
      this.happiness = Math.min(100, this.happiness + 10);
      this.updateMood();
      return this.currentMood;
    }
  
    playWithToy(funValue: number = 15) {
      this.happiness = Math.min(100, this.happiness + funValue);
      this.energy = Math.max(0, this.energy - 10);
      this.updateMood();
      return this.currentMood;
    }
  
    sleepBaby() {
      this.energy = Math.min(100, this.energy + 30);
      this.currentMood = 'sleeping';
      return this.currentMood;
    }
  
    private updateMood() {
      if (this.happiness > 70) {
        this.currentMood = 'happy';
      } else if (this.energy < 30) {
        this.currentMood = 'sleeping';
      } else {
        this.currentMood = 'sad';
      }
    }
  
    getStats() {
      return {
        happiness: this.happiness,
        hunger: this.hunger,
        energy: this.energy,
        health: this.health,
        mood: this.currentMood
      };
    }
  }
  
  // src/game/scenes/PlayScene.ts
  import Phaser from 'phaser';
  import { BabyState } from '../entities/BabyState';
  
  export class PlayScene extends Phaser.Scene {
    private baby!: Phaser.GameObjects.Sprite;
    private items!: Phaser.GameObjects.Group;
    private babyState: BabyState;
    private statusText!: Phaser.GameObjects.Text;
  
    constructor() {
      super({ key: 'PlayScene' });
      this.babyState = new BabyState();
    }
  
    preload() {
      // Загружаем ассеты
      this.load.image('baby-sad', '/mybaby/baby.png');
      this.load.image('baby-happy', '/mybaby/babysmile.svg');
      this.load.image('bottle', '/mybaby/bottle.png');
      this.load.image('teddy', '/mybaby/teddy.png');
      this.load.image('crib', '/mybaby/crib.png');
    }
  
    create() {
      // Создаем малыша в центре
      this.baby = this.add.sprite(400, 300, 'baby-sad');
      this.baby.setInteractive();
      this.baby.setScale(0.8);
      
      // Делаем малыша перетаскиваемым
      this.input.setDraggable(this.baby);
  
      // Создаем группу предметов
      this.items = this.add.group();
      this.createItems();
  
      // Статус малыша
      this.statusText = this.add.text(50, 50, '', {
        fontSize: '18px',
        color: '#ff69b4'
      });
  
      // Настраиваем drag & drop
      this.setupDragAndDrop();
      
      // Обновляем статус
      this.updateStatusDisplay();
    }
  
    private createItems() {
      // Создаем предметы внизу экрана
      const itemsData = [
        { key: 'bottle', x: 200, action: 'feed' },
        { key: 'teddy', x: 300, action: 'play' },
        { key: 'crib', x: 400, action: 'sleep' }
      ];
  
      itemsData.forEach(item => {
        const sprite = this.add.sprite(item.x, 500, item.key);
        sprite.setInteractive();
        sprite.setScale(0.6);
        sprite.setData('action', item.action);
        this.input.setDraggable(sprite);
        this.items.add(sprite);
      });
    }
  
    private setupDragAndDrop() {
      // Drag события
      this.input.on('dragstart', (pointer: any, gameObject: Phaser.GameObjects.GameObject) => {
        gameObject.setTint(0x808080);
      });
  
      this.input.on('drag', (pointer: any, gameObject: Phaser.GameObjects.GameObject, dragX: number, dragY: number) => {
        gameObject.x = dragX;
        gameObject.y = dragY;
      });
  
      this.input.on('dragend', (pointer: any, gameObject: Phaser.GameObjects.GameObject) => {
        gameObject.clearTint();
        
        // Проверяем, было ли перетаскивание на малыша
        const distance = Phaser.Geom.Point.Distance(
          { x: gameObject.x, y: gameObject.y },
          { x: this.baby.x, y: this.baby.y }
        );
  
        if (distance < 100) {
          this.handleItemUsed(gameObject);
        } else {
          // Возвращаем предмет на место
          this.returnItemToPlace(gameObject);
        }
      });
    }
  
    private handleItemUsed(item: Phaser.GameObjects.GameObject) {
      const action = item.getData('action');
      let newMood;
  
      switch (action) {
        case 'feed':
          newMood = this.babyState.feedBaby();
          break;
        case 'play':
          newMood = this.babyState.playWithToy();
          break;
        case 'sleep':
          newMood = this.babyState.sleepBaby();
          break;
      }
  
      // Обновляем спрайт малыша
      this.updateBabySprite(newMood);
      
      // Анимация реакции
      this.tweens.add({
        targets: this.baby,
        scaleX: 0.9,
        scaleY: 0.9,
        duration: 200,
        yoyo: true,
        ease: 'Power2'
      });
  
      // Возвращаем предмет
      this.returnItemToPlace(item);
      
      // Обновляем статус
      this.updateStatusDisplay();
    }
  
    private updateBabySprite(mood?: string) {
      const currentMood = mood || this.babyState.getStats().mood;
      const texture = currentMood === 'happy' ? 'baby-happy' : 'baby-sad';
      this.baby.setTexture(texture);
    }
  
    private returnItemToPlace(item: Phaser.GameObjects.GameObject) {
      const originalX = item.getData('originalX') || item.x;
      const originalY = item.getData('originalY') || 500;
      
      this.tweens.add({
        targets: item,
        x: originalX,
        y: originalY,
        duration: 300,
        ease: 'Power2'
      });
    }
  
    private updateStatusDisplay() {
      const stats = this.babyState.getStats();
      this.statusText.setText(`
  Настроение: ${stats.mood}
  Счастье: ${Math.round(stats.happiness)}
  Голод: ${Math.round(stats.hunger)}
  Энергия: ${Math.round(stats.energy)}
      `);
    }
  }
  
  // src/game/GameManager.ts
  import Phaser from 'phaser';
  import { PlayScene } from './scenes/PlayScene';
  
  export class GameManager {
    private game: Phaser.Game | null = null;
  
    init(containerId: string) {
      const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        parent: containerId,
        backgroundColor: '#fdf2f8',
        scene: [PlayScene],
        physics: {
          default: 'arcade',
          arcade: {
            gravity: { y: 0, x: 0 },
            debug: false
          }
        }
      };
  
      this.game = new Phaser.Game(config);
      return this.game;
    }
  
    destroy() {
      if (this.game) {
        this.game.destroy(true);
        this.game = null;
      }
    }
  }
  
  // src/app/mybaby/page.tsx - обновленная версия с Phaser
  'use client';
  
  import { useEffect, useRef } from 'react';
  import { GameManager } from '../../game/GameManager';
  
  export default function MyBabyPage() {
    const gameRef = useRef<HTMLDivElement>(null);
    const gameManagerRef = useRef<GameManager | null>(null);
  
    useEffect(() => {
      if (gameRef.current && !gameManagerRef.current) {
        gameManagerRef.current = new GameManager();
        gameManagerRef.current.init('phaser-game');
      }
  
      return () => {
        if (gameManagerRef.current) {
          gameManagerRef.current.destroy();
          gameManagerRef.current = null;
        }
      };
    }, []);
  
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-pink-50 to-white p-6">
        <h1 className="text-3xl font-bold text-pink-600 mb-6">My Mini Baby - Game Edition</h1>
        
        <div 
          id="phaser-game" 
          ref={gameRef}
          className="border-2 border-pink-200 rounded-lg shadow-lg"
        />
        
        <div className="mt-4 text-center text-gray-600">
          <p>Перетащите предметы к малышу для взаимодействия!</p>
          <p>🍼 Бутылочка - покормить | 🧸 Игрушка - поиграть | 🛏️ Кроватка - уложить спать</p>
        </div>
      </div>
    );
  }