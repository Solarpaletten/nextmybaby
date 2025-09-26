'use client';

import React, { useState } from 'react';

import Link from 'next/link';

import { TextAreaAdapter } from '@/components/legacy/translator/TextAreaAdapter';

export default function TranslatorPage() {
  const [text, setText] = useState('');

  return (
    <main style={{ padding: '40px 24px', maxWidth: '800px', margin: '0 auto' }}>
      <Link href="/">← Назад к главной</Link>
      <h1>🌐 Translator Module (MVP)</h1>

      <TextAreaAdapter
        value={text}
        onChange={setText}
        placeholder="Введите текст для перевода..."
      />

      <p style={{ marginTop: '20px' }}>
        <strong>Live preview:</strong> {text}
      </p>
    </main>
  );
}
