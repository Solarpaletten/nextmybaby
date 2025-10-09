'use client';

import { useEffect, useRef } from 'react';
import { GameManager } from '@/src/game/GameManager';

export default function MyBabyGame() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameManagerRef = useRef<GameManager | null>(null);

  useEffect(() => {
    if (containerRef.current) {
      const manager = new GameManager();
      manager.init(containerRef.current.id);
      gameManagerRef.current = manager;

      return () => {
        manager.destroy();
      };
    }
  }, []);

  return (
    <div
      id="phaser-container"
      ref={containerRef}
      style={{ width: '100%', height: '60vh', backgroundColor: '#fff5f8', borderRadius: '15px' }}
    />
  );
}
