'use client';

import { useEffect, useState } from 'react';
import './styles.css';

export default function BirthdayPage() {
  const [isSinging, setIsSinging] = useState(false);

  useEffect(() => {
    createConfetti(); // запустить сразу
  }, []);

  const toggleSing = () => {
    setIsSinging((prev) => {
      const audio = new Audio('/mybaby/audio/happy_birthday.mp3');
      audio.volume = 0.6;
      audio.play();
      return !prev;
    });
  };

  const makeWish = () => {
    alert('🌟✨ Загадай самое заветное желание, Дашенька! Оно обязательно сбудется! ✨🌟\n\nС любовью, твой папа и MyMiniBaby! 💕');
    createConfetti();
  };

  const createConfetti = () => {
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = Math.random() * 100 + 'vw';
      confetti.style.animationDelay = Math.random() * 3 + 's';
      confetti.style.background = ['#ff6b9d', '#ffa500', '#667eea', '#764ba2', '#00ff00'][Math.floor(Math.random() * 5)];
      document.body.appendChild(confetti);
    }
  };

  return (
    <div className="container">
      <h1>🎉 С Днём Рождения! 🎉</h1>
      <h2 style={{ color: '#764ba2', marginBottom: '10px' }}>Дашенька!</h2>
      <div className="age">10 ЛЕТ!</div>

      <div className="stage">
        <div className={`mybaby ${isSinging ? 'singing' : ''}`} onClick={toggleSing}>
          <div className="baby-hair"></div>
          <div className="baby-head">
            <div className="baby-eye left"></div>
            <div className="baby-eye right"></div>
            <div className="baby-nose"></div>
            <div className="baby-mouth"></div>
          </div>
          <div className="baby-arm left"></div>
          <div className="baby-arm right"></div>
          <div className="baby-body"></div>
          <div className="baby-diaper"></div>
          <div className="baby-leg left"></div>
          <div className="baby-leg right"></div>
          <div className="microphone"></div>
        </div>
      </div>

      <div className="poem">
        <p>🌟 Дашенька, тебе сегодня десять лет,</p>
        <p>Ты умница, талантливее всех на свете нет!</p>
        <p>Рисуешь ты, и лепишь, и танцуешь,</p>
        <p>В гимнастике всех лучше выступаешь!</p>
        <br />
        <p>🎨 Фломастеров аж восемьдесят у тебя,</p>
        <p>MyMiniBaby создаёшь, любя!</p>
        <p>Домики и комнаты для малыша,</p>
        <p>Как всё красиво, просто красота!</p>
        <br />
        <p>📚 Английский изучаешь, математика на пять,</p>
        <p>Тебя нельзя не похвалить, нельзя не обнимать!</p>
        <p>Занимайся тем, что любишь, что по сердцу,</p>
        <p>И счастье будет рядом, откроется все дверцы!</p>
        <br />
        <p>💝 Желаем здоровья, радости, добра,</p>
        <p>Пусть сбудутся все-все твои мечты!</p>
        <p>Папа любит очень-очень сильно,</p>
        <p>С Днём Рождения, доченька, расти красивой! 🎂✨</p>
      </div>

      <button className="button" onClick={toggleSing}>🎵 Спеть песенку!</button>
      <button className="button" onClick={makeWish}>🌟 Загадать желание!</button>

      {isSinging && (
        <div className="lyrics show">
          <h3 style={{ color: '#ff6b9d', textAlign: 'center', marginBottom: '15px' }}>🎤 MyMiniBaby поёт:</h3>
          <p><strong>♫ С Днём Рождения, Дашенька! ♫</strong></p>
          <p>Тебе сегодня десять лет,</p>
          <p>Ты ярче всех на свете!</p>
          <p>Пусть счастье, радость и успех</p>
          <p>Всегда с тобой на свете!</p>
          <br />
          <p>Рисуй, танцуй, твори, мечтай,</p>
          <p>Учись, играй, смейся!</p>
          <p>И MyBaby не забывай,</p>
          <p>Пусть чудеса случаются! 🎶</p>
        </div>
      )}
    </div>
  );
}
