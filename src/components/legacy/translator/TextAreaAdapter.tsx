'use client';

import React from 'react';

interface TextAreaAdapterProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const TextAreaAdapter: React.FC<TextAreaAdapterProps> = ({
  value,
  onChange,
  placeholder = 'Введите текст...',
}) => {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: '100%',
        minHeight: '120px',
        padding: '12px',
        border: '1px solid #ccc',
        borderRadius: '6px',
        fontSize: '14px',
        fontFamily: 'inherit',
      }}
    />
  );
};

export default TextAreaAdapter;
