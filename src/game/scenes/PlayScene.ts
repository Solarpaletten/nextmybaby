// src/game/scenes/PlayScene.ts - Полноэкранная версия
import * as Phaser from 'phaser';
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
        this.load.image('baby-happy', '/baby.png');   
        this.load.image('baby-sad', '/mybaby/babymude.png');
        this.load.image('bottle', '/mybaby/bottle.png');
        this.load.image('teddy', '/mybaby/teddy.png');
        this.load.image('crib', '/mybaby/crib.png');
    }

    create() {
        const { width, height } = this.cameras.main;

        // Создаем малыша в центре экрана
        this.baby = this.add.sprite(width / 2, height / 2, 'baby-happy');
        this.baby.setInteractive();
        this.baby.setScale(0.8);

        // Делаем малыша перетаскиваемым
        this.input.setDraggable(this.baby);

        // Создаем группу предметов
        this.items = this.add.group();
        this.createItems();

        // Статус малыша в левом верхнем углу
        this.statusText = this.add.text(20, 20, '', {
            fontSize: '18px',
            color: '#ff69b4',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            padding: { x: 10, y: 10 }
        });

        // Настраиваем drag & drop
        this.setupDragAndDrop();

        // Обновляем статус
        this.updateStatusDisplay();

        // Добавляем инструкции
        this.add.text(width / 2, height - 40, 'Перетащите предметы к малышу для взаимодействия!', {
            fontSize: '16px',
            color: '#666',
            align: 'center'
        }).setOrigin(0.5);
    }

    private createItems() {
        const { width, height } = this.cameras.main;

        // Размещаем предметы по углам и краям экрана
        const itemsData = [
            // Правый верхний угол - бутылочка
            { key: 'bottle', x: width - 80, y: 80, action: 'feed', label: 'Бутылочка' },

            // Левый нижний угол - мишка
            { key: 'teddy', x: 80, y: height - 80, action: 'play', label: 'Игрушка' },

            // Правый нижний угол - кроватка
            { key: 'crib', x: width - 80, y: height - 80, action: 'sleep', label: 'Кроватка' },

            // Дополнительные позиции для будущих предметов
            // Левый верхний (под статусом)
            // { key: 'pacifier', x: 80, y: 150, action: 'calm', label: 'Соска' },

            // Центр левой стороны  
            // { key: 'medicine', x: 50, y: height / 2, action: 'heal', label: 'Лекарство' }
        ];

        itemsData.forEach(item => {
            const sprite = this.add.sprite(item.x, item.y, item.key);
            sprite.setInteractive();
            sprite.setScale(0.6);
            sprite.setData('action', item.action);
            sprite.setData('originalX', item.x);
            sprite.setData('originalY', item.y);
            sprite.setData('label', item.label);

            // Добавляем подпись к предмету
            const label = this.add.text(item.x, item.y + 50, item.label, {
                fontSize: '14px',
                color: '#666',
                align: 'center'
            }).setOrigin(0.5);

            sprite.setData('labelText', label);

            this.input.setDraggable(sprite);
            this.items.add(sprite);
        });
    }

    private setupDragAndDrop() {
        // Drag события
        this.input.on('dragstart', (pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.GameObject) => {
            (gameObject as Phaser.GameObjects.Sprite).setTint(0x808080);
            (gameObject as Phaser.GameObjects.Sprite).setScale(0.7); // Увеличиваем при захвате

            // Скрываем подпись во время перетаскивания
            const label = gameObject.getData('labelText');
            if (label) label.setVisible(false);
        });

        this.input.on('drag', (pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.GameObject, dragX: number, dragY: number) => {
            gameObject.x = dragX;
            gameObject.y = dragY;
        });

        this.input.on('dragend', (pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.GameObject) => {
            (gameObject as Phaser.GameObjects.Sprite).clearTint();
            (gameObject as Phaser.GameObjects.Sprite).setScale(0.6); // Возвращаем исходный размер

            // Проверяем расстояние до малыша
            const distance = Phaser.Math.Distance.Between(
                gameObject.x, gameObject.y,
                this.baby.x, this.baby.y
            );

            if (distance < 200) { // Увеличили зону взаимодействия
                this.handleItemUsed(gameObject);
            } else {
                // Возвращаем предмет на место
                this.returnItemToPlace(gameObject);
            }
        });

        // Добавляем hover эффекты
        this.input.on('gameobjectover', (pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.GameObject) => {
            if (gameObject === this.baby) return;
            (gameObject as Phaser.GameObjects.Sprite).setTint(0xdddddd);
        });

        this.input.on('gameobjectout', (pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.GameObject) => {
            if (gameObject === this.baby) return;
            (gameObject as Phaser.GameObjects.Sprite).clearTint();
        });
    }

    private handleItemUsed(item: Phaser.GameObjects.GameObject) {
        const action = item.getData('action');
        const label = item.getData('label');
        let newMood;

        switch (action) {
            case 'feed':
                newMood = this.babyState.feedBaby();
                this.showFeedback(`${label} использована!`, '#4CAF50');
                break;
            case 'play':
                newMood = this.babyState.playWithToy();
                this.showFeedback(`Играем с ${label.toLowerCase()}!`, '#FF9800');
                break;
            case 'sleep':
                newMood = this.babyState.sleepBaby();
                this.showFeedback(`Малыш лег в ${label.toLowerCase()}!`, '#9C27B0');
                break;
        }

        // Обновляем спрайт малыша
        this.updateBabySprite(newMood);

        // Анимация реакции малыша
        this.tweens.add({
            targets: this.baby,
            scaleX: 1.0,
            scaleY: 1.0,
            duration: 200,
            yoyo: true,
            ease: 'Power2'
        });

        // Эффект частиц вокруг малыша
        this.createParticleEffect();

        // Возвращаем предмет
        this.returnItemToPlace(item);

        // Обновляем статус
        this.updateStatusDisplay();
    }

    private showFeedback(text: string, color: string) {
        const { width, height } = this.cameras.main;

        const feedbackText = this.add.text(width / 2, height / 2 - 100, text, {
            fontSize: '24px',
            color: color,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5);

        // Анимация появления и исчезновения
        this.tweens.add({
            targets: feedbackText,
            y: height / 2 - 150,
            alpha: 0,
            duration: 2000,
            ease: 'Power2',
            onComplete: () => feedbackText.destroy()
        });
    }

    private createParticleEffect() {
        // Простой эффект частиц (сердечки или звездочки)
        for (let i = 0; i < 5; i++) {
            const particle = this.add.text(
                this.baby.x + Phaser.Math.Between(-50, 50),
                this.baby.y + Phaser.Math.Between(-50, 50),
                ['💖', '⭐', '✨', '💫'][Phaser.Math.Between(0, 3)],
                { fontSize: '20px' }
            );

            this.tweens.add({
                targets: particle,
                y: particle.y - 100,
                alpha: 0,
                duration: 1500,
                delay: i * 100,
                ease: 'Power2',
                onComplete: () => particle.destroy()
            });
        }
    }

    private updateBabySprite(mood?: string) {
        const currentMood = mood || this.babyState.getStats().mood;
        const texture = currentMood === 'happy' || currentMood === 'playing' ? 'baby-happy' : 'baby-sad';
        this.baby.setTexture(texture);
    }

    private returnItemToPlace(item: Phaser.GameObjects.GameObject) {
        const originalX = item.getData('originalX');
        const originalY = item.getData('originalY');
        const label = item.getData('labelText');

        this.tweens.add({
            targets: item,
            x: originalX,
            y: originalY,
            duration: 800,
            ease: 'Back.easeOut',
            onComplete: () => {
                // Показываем подпись обратно
                if (label) {
                    label.setPosition(originalX, originalY + 50);
                    label.setVisible(true);
                }
            }
        });
    }

    private updateStatusDisplay() {
        const stats = this.babyState.getStats();
        this.statusText.setText(`Настроение: ${stats.mood}
Счастье: ${Math.round(stats.happiness)}
Голод: ${Math.round(stats.hunger)}
Энергия: ${Math.round(stats.energy)}`);
    }
}