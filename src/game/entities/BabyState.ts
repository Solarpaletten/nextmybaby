export class BabyState {
  private happiness = 50;
  private hunger = 50;
  private energy = 50;
  private health = 100;
  private currentMood: 'sad' | 'happy' | 'sleeping' | 'playing' = 'sad';

  constructor() {
    setInterval(() => {
      this.hunger = Math.max(0, this.hunger - 1);
      this.energy = Math.max(0, this.energy - 0.5);
      this.updateMood();
    }, 5000);
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
