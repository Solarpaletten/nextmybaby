'use client';

import { useEffect, useState } from 'react';

interface BabyStats {
  happiness: number;
  hunger: number;
  energy: number;
  mood: string;
}

export default function MyBabyPage() {
  const [stats, setStats] = useState<BabyStats>({
    happiness: 50,
    hunger: 50,
    energy: 50,
    mood: 'neutral',
  });

  const [gameLoaded, setGameLoaded] = useState(false);

  // Инициализируем Phaser ТОЛЬКО после появления контейнера
  useEffect(() => {
    let manager: any | null = null;

    async function boot() {
      if (!gameLoaded) return;
      const el = document.getElementById('phaser-game');
      if (!el) return; // контейнер ещё не смонтирован – защитимся
      const { GameManager } = await import('../../game/GameManager');
      manager = new GameManager();
      manager.init('phaser-game');
    }

    boot();

    return () => {
      if (manager) manager.destroy();
    };
  }, [gameLoaded]);

  const handleFeed = () => {
    setStats((prev) => ({
      ...prev,
      hunger: Math.min(100, prev.hunger + 20),
      happiness: Math.min(100, prev.happiness + 10),
      mood: 'happy',
    }));
  };

  const handlePlay = () => {
    setStats((prev) => ({
      ...prev,
      happiness: Math.min(100, prev.happiness + 15),
      energy: Math.max(0, prev.energy - 10),
      mood: 'playing',
    }));
  };

  const handleSleep = () => {
    setStats((prev) => ({
      ...prev,
      energy: Math.min(100, prev.energy + 30),
      mood: 'sleeping',
    }));
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-pink-50 to-white p-6">
      <h1 className="text-3xl font-bold text-pink-600 mb-6">
        My Mini Baby - Game Edition
      </h1>

      {/* Статистика */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6 min-w-[300px]">
        <h2 className="text-xl font-bold text-gray-800 mb-4">👶 Статистика малыша</h2>
        <div className="space-y-2">
          <div>Настроение: <span className="font-semibold">{stats.mood}</span></div>
          <div>Счастье: <span className="font-semibold">{Math.round(stats.happiness)}</span></div>
          <div>Голод: <span className="font-semibold">{Math.round(stats.hunger)}</span></div>
          <div>Энергия: <span className="font-semibold">{Math.round(stats.energy)}</span></div>
        </div>
      </div>

      {/* Игровая зона / кнопка загрузки */}
      {!gameLoaded ? (
        <div className="border-2 border-pink-200 rounded-lg p-8 text-center bg-white shadow-lg">
          <div className="text-6xl mb-4">👶</div>
          <p className="text-gray-600 mb-4">Малыш готов к игре!</p>
          <button
            onClick={() => setGameLoaded(true)}
            className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-lg font-semibold"
          >
            Загрузить игру
          </button>
        </div>
      ) : (
        <div
          id="phaser-game"
          className="border-2 border-pink-200 rounded-lg shadow-lg w-full max-w-[1100px] h-[520px] bg-pink-50"
        />
      )}

      {/* Кнопки */}
      <div className="flex gap-4 mt-6">
        <button onClick={handleFeed} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2">
          🍼 Покормить
        </button>
        <button onClick={handlePlay} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2">
          🧸 Поиграть
        </button>
        <button onClick={handleSleep} className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2">
          🛏️ Спать
        </button>
      </div>

      <div className="mt-4 text-center text-gray-600">
        <p>Перетаскивай предметы — они остаются там, где ты их отпустил.</p>
        <p>Phaser подгружается по требованию для стабильного деплоя.</p>
      </div>
    </div>
  );
}
