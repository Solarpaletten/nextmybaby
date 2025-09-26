# 🔧 Шаблоны адаптеров для переноса компонентов

## 📁 Создайте структуру для адаптеров

```bash
mkdir -p src/components/legacy/translator
mkdir -p src/components/legacy/vat
mkdir -p src/components/legacy/shared
```

## 🎨 1. UI Component Adapter (для кнопок, форм, модалов)

**Файл: `src/components/legacy/shared/ButtonAdapter.tsx`**

```typescript
'use client';

import React from 'react';

// Интерфейс для новых пропсов (типизированный)
interface ButtonAdapterProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  className?: string;
}

/**
 * Адаптер для старых кнопок из legacy проектов
 * 
 * Как использовать:
 * 1. Положи старый компонент в _source/
 * 2. Скопируй логику сюда
 * 3. Добавь типы пропсов
 * 4. Замени старые стили на новые
 */
export const ButtonAdapter: React.FC<ButtonAdapterProps> = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  className = '',
}) => {
  // Старая логика из legacy компонента (адаптированная)
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    onClick?.();
  };

  // Стили адаптированы для Next.js
  const baseStyles = {
    padding: '12px 24px',
    borderRadius: '8px',
    border: 'none',
    fontWeight: '600',
    fontSize: '14px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease',
    opacity: disabled ? 0.6 : 1,
  };

  const variantStyles = {
    primary: {
      background: '#3b82f6',
      color: 'white',
    },
    secondary: {
      background: '#f3f4f6',
      color: '#374151',
      border: '1px solid #d1d5db',
    },
    danger: {
      background: '#ef4444',
      color: 'white',
    },
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled}
      className={className}
      style={{
        ...baseStyles,
        ...variantStyles[variant],
      }}
    >
      {children}
    </button>
  );
};

export default ButtonAdapter;
```

## 📝 2. Form Component Adapter (для текстовых полей, форм)

**Файл: `src/components/legacy/translator/TextAreaAdapter.tsx`**

```typescript
'use client';

import React, { useState, useCallback } from 'react';

interface TextAreaAdapterProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  rows?: number;
  maxLength?: number;
  label?: string;
}

/**
 * Адаптер для старого textarea из переводчика
 * Включает валидацию и обработку ошибок
 */
export const TextAreaAdapter: React.FC<TextAreaAdapterProps> = ({
  value = '',
  onChange,
  placeholder = 'Введите текст...',
  disabled = false,
  rows = 4,
  maxLength,
  label,
}) => {
  const [localValue, setLocalValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);

  // Legacy логика обработки изменений
  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    
    // Проверка maxLength (из старого кода)
    if (maxLength && newValue.length > maxLength) {
      return;
    }

    setLocalValue(newValue);
    onChange?.(newValue);
  }, [onChange, maxLength]);

  const styles = {
    container: {
      marginBottom: '16px',
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      fontWeight: '600',
      color: '#374151',
      fontSize: '14px',
    },
    textarea: {
      width: '100%',
      padding: '12px',
      border: `2px solid ${isFocused ? '#3b82f6' : '#d1d5db'}`,
      borderRadius: '8px',
      fontSize: '14px',
      fontFamily: 'inherit',
      resize: 'vertical' as const,
      transition: 'border-color 0.2s ease',
      outline: 'none',
      backgroundColor: disabled ? '#f9fafb' : 'white',
    },
    counter: {
      textAlign: 'right' as const,
      fontSize: '12px',
      color: '#6b7280',
      marginTop: '4px',
    },
  };

  return (
    <div style={styles.container}>
      {label && <label style={styles.label}>{label}</label>}
      <textarea
        value={localValue}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        style={styles.textarea}
      />
      {maxLength && (
        <div style={styles.counter}>
          {localValue.length} / {maxLength}
        </div>
      )}
    </div>
  );
};

export default TextAreaAdapter;
```

## ⚙️ 3. Logic Adapter (для утилит, API, бизнес-логики)

**Файл: `src/components/legacy/translator/TranslationLogicAdapter.ts`**

```typescript
// Типы для API (из старого проекта, адаптированные)
interface TranslationRequest {
  text: string;
  from: string;
  to: string;
}

interface TranslationResponse {
  translatedText: string;
  originalText: string;
  confidence: number;
}

/**
 * Адаптер для логики переводчика из старого проекта
 * Конвертирует старые API вызовы в новый формат
 */
export class TranslationLogicAdapter {
  private static instance: TranslationLogicAdapter;
  private baseUrl = '/api'; // Новый базовый URL для Next.js

  static getInstance(): TranslationLogicAdapter {
    if (!TranslationLogicAdapter.instance) {
      TranslationLogicAdapter.instance = new TranslationLogicAdapter();
    }
    return TranslationLogicAdapter.instance;
  }

  /**
   * Адаптированный метод перевода (из старого проекта)
   */
  async translateText(request: TranslationRequest): Promise<TranslationResponse> {
    try {
      // Старая логика адаптирована для Next.js fetch
      const response = await fetch(`${this.baseUrl}/translate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`Translation failed: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Адаптация ответа к новому формату
      return {
        translatedText: data.result || data.translatedText,
        originalText: request.text,
        confidence: data.confidence || 0.95,
      };
    } catch (error) {
      console.error('Translation error:', error);
      throw new Error('Ошибка перевода. Попробуйте позже.');
    }
  }

  /**
   * Валидация текста (из старого проекта)
   */
  validateText(text: string): { isValid: boolean; error?: string } {
    // Старые правила валидации
    if (!text || text.trim().length === 0) {
      return { isValid: false, error: 'Текст не может быть пустым' };
    }

    if (text.length > 5000) {
      return { isValid: false, error: 'Текст слишком длинный (макс. 5000 символов)' };
    }

    // Проверка на спам (из старого кода)
    const spamPatterns = /^(.)\1{10,}$/; // Повторяющиеся символы
    if (spamPatterns.test(text)) {
      return { isValid: false, error: 'Текст содержит подозрительные символы' };
    }

    return { isValid: true };
  }

  /**
   * Форматирование результата (legacy логика)
   */
  formatTranslationResult(response: TranslationResponse): string {
    // Старая логика форматирования
    const confidence = Math.round(response.confidence * 100);
    return `${response.translatedText}\n\n(Точность: ${confidence}%)`;
  }
}

// Экспорт инстанса для удобства
export const translationLogic = TranslationLogicAdapter.getInstance();
```

## 📊 4. Dashboard Adapter (для целых страниц/дашбордов)

**Файл: `src/components/legacy/vat/VatDashboardAdapter.tsx`**

```typescript
'use client';

import React, { useState, useEffect } from 'react';

interface VatData {
  totalIncome: number;
  vatAmount: number;
  period: string;
  status: 'draft' | 'submitted' | 'approved';
}

interface VatDashboardAdapterProps {
  initialData?: VatData;
  onSave?: (data: VatData) => void;
  onSubmit?: (data: VatData) => void;
}

/**
 * Адаптер для старого HTML дашборда VAT системы
 * Конвертирует статичную HTML страницу в интерактивный React компонент
 */
export const VatDashboardAdapter: React.FC<VatDashboardAdapterProps> = ({
  initialData,
  onSave,
  onSubmit,
}) => {
  const [data, setData] = useState<VatData>(
    initialData || {
      totalIncome: 0,
      vatAmount: 0,
      period: new Date().toISOString().slice(0, 7), // YYYY-MM
      status: 'draft',
    }
  );

  // Legacy эффект для автоматического расчета НДС
  useEffect(() => {
    const vatRate = 0.2; // 20% НДС
    const calculatedVat = data.totalIncome * vatRate;
    
    if (calculatedVat !== data.vatAmount) {
      setData(prev => ({
        ...prev,
        vatAmount: calculatedVat,
      }));
    }
  }, [data.totalIncome]);

  // Стили адаптированы из старого CSS
  const styles = {
    container: {
      maxWidth: '800px',
      margin: '0 auto',
      padding: '24px',
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
    },
    header: {
      borderBottom: '2px solid #e5e7eb',
      paddingBottom: '16px',
      marginBottom: '24px',
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#1f2937',
      margin: 0,
    },
    formGroup: {
      marginBottom: '20px',
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      fontWeight: '600',
      color: '#374151',
    },
    input: {
      width: '100%',
      padding: '12px',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      fontSize: '14px',
    },
    summary: {
      backgroundColor: '#f3f4f6',
      padding: '20px',
      borderRadius: '8px',
      marginTop: '24px',
    },
    buttonGroup: {
      display: 'flex',
      gap: '12px',
      marginTop: '24px',
    },
    button: {
      padding: '12px 24px',
      borderRadius: '6px',
      border: 'none',
      fontWeight: '600',
      cursor: 'pointer',
    },
    saveButton: {
      backgroundColor: '#3b82f6',
      color: 'white',
    },
    submitButton: {
      backgroundColor: '#10b981',
      color: 'white',
    },
  };

  const handleInputChange = (field: keyof VatData, value: any) => {
    setData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    onSave?.(data);
    alert('Данные сохранены');
  };

  const handleSubmit = () => {
    if (data.totalIncome <= 0) {
      alert('Заполните корректные данные');
      return;
    }
    
    const submittedData = { ...data, status: 'submitted' as const };
    setData(submittedData);
    onSubmit?.(submittedData);
    alert('Декларация подана');
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>НДС Декларация</h1>
        <p>Период: {data.period} | Статус: {data.status}</p>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Период отчета:</label>
        <input
          type="month"
          value={data.period}
          onChange={(e) => handleInputChange('period', e.target.value)}
          style={styles.input}
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Общий доход (грн):</label>
        <input
          type="number"
          value={data.totalIncome}
          onChange={(e) => handleInputChange('totalIncome', Number(e.target.value))}
          style={styles.input}
          placeholder="0.00"
        />
      </div>

      <div style={styles.summary}>
        <h3>Расчет НДС</h3>
        <p>Общий доход: {data.totalIncome.toLocaleString('uk-UA')} грн</p>
        <p>НДС к доплате (20%): <strong>{data.vatAmount.toLocaleString('uk-UA')} грн</strong></p>
        <p>Общая сумма: <strong>{(data.totalIncome + data.vatAmount).toLocaleString('uk-UA')} грн</strong></p>
      </div>

      <div style={styles.buttonGroup}>
        <button
          onClick={handleSave}
          style={{...styles.button, ...styles.saveButton}}
          disabled={data.status === 'submitted'}
        >
          Сохранить черновик
        </button>
        <button
          onClick={handleSubmit}
          style={{...styles.button, ...styles.submitButton}}
          disabled={data.status === 'submitted'}
        >
          Подать декларацию
        </button>
      </div>
    </div>
  );
};

export default VatDashboardAdapter;
```

## 🔌 5. Подключение адаптеров к страницам

**Обновить: `src/app/(products)/translator/page.tsx`**

```typescript
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { TextAreaAdapter } from '@/components/legacy/translator/TextAreaAdapter';
import { ButtonAdapter } from '@/components/legacy/shared/ButtonAdapter';
import { translationLogic } from '@/components/legacy/translator/TranslationLogicAdapter';

export default function TranslatorPage() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleTranslate = async () => {
    // Валидация через legacy адаптер
    const validation = translationLogic.validateText(inputText);
    if (!validation.isValid) {
      alert(validation.error);
      return;
    }

    setIsLoading(true);
    try {
      const result = await translationLogic.translateText({
        text: inputText,
        from: 'uk',
        to: 'en',
      });
      
      setOutputText(translationLogic.formatTranslationResult(result));
    } catch (error) {
      alert('Ошибка перевода');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main style={{ padding: '40px 24px', maxWidth: '1000px', margin: '0 auto' }}>
      <Link href="/">← Назад к главной</Link>
      
      <h1>🌐 Translator Module</h1>
      
      <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: '1fr 1fr' }}>
        <TextAreaAdapter
          value={inputText}
          onChange={setInputText}
          label="Исходный текст"
          placeholder="Введите текст для перевода..."
          maxLength={5000}
        />
        
        <TextAreaAdapter
          value={outputText}
          onChange={() => {}} // read-only
          label="Перевод"
          placeholder="Здесь появится перевод..."
          disabled={true}
        />
      </div>
      
      <ButtonAdapter
        onClick={handleTranslate}
        disabled={isLoading}
        variant="primary"
      >
        {isLoading ? 'Переводим...' : 'Перевести'}
      </ButtonAdapter>
    </main>
  );
}
```

**Обновить: `src/app/(products)/vat/page.tsx`**

```typescript
'use client';

import React from 'react';
import Link from 'next/link';
import { VatDashboardAdapter } from '@/components/legacy/vat/VatDashboardAdapter';

export default function VatPage() {
  const handleSave = (data: any) => {
    console.log('Saving VAT data:', data);
    // Здесь будет API вызов для сохранения
  };

  const handleSubmit = (data: any) => {
    console.log('Submitting VAT data:', data);
    // Здесь будет API вызов для подачи декларации
  };

  return (
    <main style={{ padding: '40px 24px', maxWidth: '1200px', margin: '0 auto' }}>
      <Link href="/">← Назад к главной</Link>
      
      <VatDashboardAdapter
        onSave={handleSave}
        onSubmit={handleSubmit}
      />
    </main>
  );
}
```

## 📋 6. Задачи для Клауди (с готовыми адаптерами)

### Задача 1: Перенос кнопки
```
Заголовок: UI: перенести старую кнопку через ButtonAdapter

Шаги:
1. Найти кнопку в старом проекте
2. Скопировать стили в ButtonAdapter (src/components/legacy/shared/ButtonAdapter.tsx)
3. Адаптировать пропсы под TypeScript
4. Подключить в нужной странице
5. Протестировать все варианты (primary, secondary, disabled)

DoD:
- Кнопка работает во всех состояниях
- Нет ошибок TypeScript
- Стили соответствуют оригиналу
```

### Задача 2: Перенос формы
```
Заголовок: Form: адаптировать текстовое поле через TextAreaAdapter

Шаги:
1. Положить исходную форму в _source/
2. Адаптировать логику в TextAreaAdapter
3. Добавить валидацию из старого кода
4. Подключить к странице translator
5. Добавить демо с вводом/выводом

DoD:
- Форма валидирует данные
- Счетчик символов работает
- Стили адаптированы
- Нет ошибок в консоли
```

---

🎉 **Теперь у вас есть:**

✅ **Готовые шаблоны** для любых типов компонентов  
✅ **Типизированные интерфейсы** для всех адаптеров  
✅ **Примеры подключения** к страницам  
✅ **Четкие задачи** для Клауди  

**Один адаптер = один PR = контролируемый перенос!**