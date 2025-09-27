// src/app/mybaby/page.tsx - Phaser версия
'use client';

import { useEffect, useRef } from 'react';
import { GameManager } from '../../game/GameManager';

export default function MyBabyPage() {
  const gameRef = useRef<HTMLDivElement>(null);
  const gameManagerRef = useRef<GameManager | null>(null);

  useEffect(() => {
    if (gameRef.current && !gameManagerRef.current) {
      // Динамический импорт только в браузере
      import('../../game/GameManager').then(({ GameManager }) => {
        gameManagerRef.current = new GameManager();
        gameManagerRef.current.init('phaser-game');
      });
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