# Next.js Core Files - Ready to Copy

## 📁 Структура папок (выполните команды)

```bash
# Создаем структуру папок
mkdir -p src/app/api/health
mkdir -p src/app/api/echo
mkdir -p "src/app/(products)/translator"
mkdir -p "src/app/(products)/vat"
mkdir -p src/components/ui
mkdir -p src/components/legacy
mkdir -p src/lib

# Создаем базовые файлы
touch .env.example
touch src/middleware.ts
```

## 🔧 1. Обновляем package.json (добавить/заменить секции)

```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "eslint . --fix",
    "format": "prettier --write ."
  },
  "lint-staged": {
    "*.{ts,tsx,js,jsx}": ["eslint --fix"],
    "*.{ts,tsx,js,jsx,css,md,json}": ["prettier --write"]
  }
}
```

## 🔧 2. Настройка pre-commit хука

**Файл: `.husky/pre-commit`** (заменить содержимое)
```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"
pnpm lint-staged
```

## 🔧 3. Environment файлы

**Файл: `.env.example`**
```env
# Public
NEXT_PUBLIC_APP_NAME=DashkaNext

# Development
NODE_ENV=development
```

## 📂 4. Library файлы

**Файл: `src/lib/env.ts`**
```typescript
import { z } from 'zod';

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  NEXT_PUBLIC_APP_NAME: z.string().default('DashkaNext'),
});

const parsed = EnvSchema.safeParse({
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
});

if (!parsed.success) {
  console.warn('ENV validation warnings:', parsed.error.flatten().fieldErrors);
}

export const ENV = parsed.success
  ? parsed.data
  : { 
      NODE_ENV: process.env.NODE_ENV ?? 'development', 
      NEXT_PUBLIC_APP_NAME: 'DashkaNext' 
    };
```

**Файл: `src/lib/logger.ts`**
```typescript
export const log = {
  info: (...args: unknown[]) => console.log('[INFO]', ...args),
  warn: (...args: unknown[]) => console.warn('[WARN]', ...args),
  error: (...args: unknown[]) => console.error('[ERROR]', ...args),
};
```

**Файл: `src/lib/types.ts`**
```typescript
export interface ApiResponse<T = unknown> {
  ok: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

export interface HealthResponse {
  ok: boolean;
  service: string;
  ts: string;
}
```

## 🚀 5. API Routes

**Файл: `src/app/api/health/route.ts`**
```typescript
import { NextResponse } from 'next/server';
import type { HealthResponse } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  const response: HealthResponse = {
    ok: true,
    service: 'dashka-next-core',
    ts: new Date().toISOString(),
  };
  
  return NextResponse.json(response);
}
```

**Файл: `src/app/api/echo/route.ts`**
```typescript
import { NextRequest, NextResponse } from 'next/server';
import type { ApiResponse } from '@/lib/types';

export async function GET() {
  const response: ApiResponse = {
    ok: true,
    data: { method: 'GET', message: 'Echo endpoint is working' },
    timestamp: new Date().toISOString(),
  };
  
  return NextResponse.json(response);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    
    const response: ApiResponse = {
      ok: true,
      data: { 
        method: 'POST',
        received: body,
        message: 'Data echoed successfully' 
      },
      timestamp: new Date().toISOString(),
    };
    
    return NextResponse.json(response);
  } catch (error) {
    const errorResponse: ApiResponse = {
      ok: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    };
    
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
```

## 🎨 6. Layout и главная страница

**Файл: `src/app/layout.tsx`** (заменить содержимое)
```typescript
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Dashka • Next Entry Point',
  description: 'Clean Next.js core for product modules',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body style={{
        margin: 0,
        fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
        backgroundColor: '#f8fafc',
        minHeight: '100vh',
      }}>
        {children}
      </body>
    </html>
  );
}
```

**Файл: `src/app/page.tsx`** (заменить содержимое)
```typescript
import Link from 'next/link';

export default function HomePage() {
  return (
    <main style={{ 
      padding: '40px 24px',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <div style={{
        background: 'white',
        padding: '32px',
        borderRadius: '16px',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
      }}>
        <h1 style={{ 
          color: '#1e293b',
          marginBottom: '8px',
          fontSize: '2.5rem',
          fontWeight: '700'
        }}>
          Dashka • Next.js Core
        </h1>
        <p style={{ 
          color: '#64748b',
          marginBottom: '32px',
          fontSize: '1.1rem'
        }}>
          Чистое ядро Next.js готово. Теперь дозированно добавляем продукт-модули.
        </p>
        
        <div style={{ 
          display: 'grid',
          gap: '16px',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))'
        }}>
          <div style={{
            padding: '20px',
            background: '#f1f5f9',
            borderRadius: '12px',
            border: '1px solid #e2e8f0'
          }}>
            <h3 style={{ color: '#475569', marginBottom: '12px' }}>🔍 System Health</h3>
            <Link 
              href="/api/health" 
              target="_blank"
              style={{
                color: '#3b82f6',
                textDecoration: 'none',
                fontWeight: '500'
              }}
            >
              /api/health →
            </Link>
          </div>
          
          <div style={{
            padding: '20px',
            background: '#f1f5f9',
            borderRadius: '12px',
            border: '1px solid #e2e8f0'
          }}>
            <h3 style={{ color: '#475569', marginBottom: '12px' }}>🔄 Echo API</h3>
            <Link 
              href="/api/echo" 
              target="_blank"
              style={{
                color: '#3b82f6',
                textDecoration: 'none',
                fontWeight: '500'
              }}
            >
              /api/echo →
            </Link>
          </div>
          
          <div style={{
            padding: '20px',
            background: '#fef3c7',
            borderRadius: '12px',
            border: '1px solid #fcd34d'
          }}>
            <h3 style={{ color: '#92400e', marginBottom: '12px' }}>🌐 Translator</h3>
            <Link 
              href="/translator" 
              style={{
                color: '#d97706',
                textDecoration: 'none',
                fontWeight: '500'
              }}
            >
              /translator →
            </Link>
            <p style={{ 
              fontSize: '0.875rem',
              color: '#92400e',
              marginTop: '8px',
              margin: 0
            }}>
              Готов для модулей
            </p>
          </div>
          
          <div style={{
            padding: '20px',
            background: '#ecfdf5',
            borderRadius: '12px',
            border: '1px solid #6ee7b7'
          }}>
            <h3 style={{ color: '#065f46', marginBottom: '12px' }}>📊 VAT System</h3>
            <Link 
              href="/vat" 
              style={{
                color: '#059669',
                textDecoration: 'none',
                fontWeight: '500'
              }}
            >
              /vat →
            </Link>
            <p style={{ 
              fontSize: '0.875rem',
              color: '#065f46',
              marginTop: '8px',
              margin: 0
            }}>
              Готов для модулей
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
```

## 📄 7. Product Pages (заготовки)

**Файл: `src/app/(products)/translator/page.tsx`**
```typescript
'use client';

import Link from 'next/link';

export default function TranslatorPage() {
  return (
    <main style={{ 
      padding: '40px 24px',
      maxWidth: '1000px',
      margin: '0 auto'
    }}>
      <div style={{
        background: 'white',
        padding: '32px',
        borderRadius: '16px',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
        marginBottom: '24px'
      }}>
        <div style={{ marginBottom: '24px' }}>
          <Link href="/" style={{ 
            color: '#6366f1', 
            textDecoration: 'none',
            fontSize: '0.9rem',
            fontWeight: '500'
          }}>
            ← Назад к главной
          </Link>
        </div>
        
        <h1 style={{ 
          color: '#1e293b',
          marginBottom: '8px',
          fontSize: '2rem',
          fontWeight: '700'
        }}>
          🌐 Translator Module
        </h1>
        
        <p style={{ 
          color: '#64748b',
          marginBottom: '32px',
          fontSize: '1.1rem'
        }}>
          Каркас готов для подключения компонентов переводчика через адаптеры.
        </p>
        
        <div style={{
          background: '#fef3c7',
          border: '1px solid #fcd34d',
          borderRadius: '12px',
          padding: '20px'
        }}>
          <h3 style={{ color: '#92400e', marginBottom: '12px' }}>📋 Следующие шаги:</h3>
          <ol style={{ color: '#92400e', paddingLeft: '20px' }}>
            <li>Создать адаптер в <code>components/legacy/translator/</code></li>
            <li>Перенести один компонент из старого проекта</li>
            <li>Добавить типы TypeScript</li>
            <li>Подключить к этой странице</li>
          </ol>
        </div>
      </div>
    </main>
  );
}
```

**Файл: `src/app/(products)/vat/page.tsx`**
```typescript
import Link from 'next/link';

export default function VatPage() {
  return (
    <main style={{ 
      padding: '40px 24px',
      maxWidth: '1000px',
      margin: '0 auto'
    }}>
      <div style={{
        background: 'white',
        padding: '32px',
        borderRadius: '16px',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
        marginBottom: '24px'
      }}>
        <div style={{ marginBottom: '24px' }}>
          <Link href="/" style={{ 
            color: '#6366f1', 
            textDecoration: 'none',
            fontSize: '0.9rem',
            fontWeight: '500'
          }}>
            ← Назад к главной
          </Link>
        </div>
        
        <h1 style={{ 
          color: '#1e293b',
          marginBottom: '8px',
          fontSize: '2rem',
          fontWeight: '700'
        }}>
          📊 VAT System Module
        </h1>
        
        <p style={{ 
          color: '#64748b',
          marginBottom: '32px',
          fontSize: '1.1rem'
        }}>
          Пустая страница готова для подключения дашборда бухгалтерии.
        </p>
        
        <div style={{
          background: '#ecfdf5',
          border: '1px solid #6ee7b7',
          borderRadius: '12px',
          padding: '20px'
        }}>
          <h3 style={{ color: '#065f46', marginBottom: '12px' }}>📋 Следующие шаги:</h3>
          <ol style={{ color: '#065f46', paddingLeft: '20px' }}>
            <li>Создать адаптер в <code>components/legacy/vat/</code></li>
            <li>Перенести HTML страницу в TSX формат</li>
            <li>Добавить интерактивность</li>
            <li>Подключить к этой странице</li>
          </ol>
        </div>
      </div>
    </main>
  );
}
```

## 🛡️ 8. Middleware

**Файл: `src/middleware.ts`**
```typescript
import { NextResponse, NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Базовые security заголовки
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Применяем middleware ко всем путям кроме:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
```

## 🔧 9. Prettier конфигурация

**Файл: `.prettierrc`**
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "importOrder": [
    "^react",
    "^next",
    "^@/(.*)$",
    "^[./]"
  ],
  "importOrderSeparation": true,
  "importOrderSortSpecifiers": true,
  "plugins": ["@trivago/prettier-plugin-sort-imports"]
}
```

## ✅ 10. Первый запуск (команды)

```bash
# Скопировать environment файл
cp .env.example .env.local

# Установить зависимости (если не установлены)
pnpm install

# Запустить dev сервер
pnpm dev
```

## 🧪 11. Проверка работы

После запуска `pnpm dev` проверьте:

- ✅ http://localhost:3000/ - главная страница
- ✅ http://localhost:3000/api/health - health check
- ✅ http://localhost:3000/api/echo - echo API  
- ✅ http://localhost:3000/translator - страница переводчика
- ✅ http://localhost:3000/vat - страница VAT системы

## 📝 12. Первый коммит

```bash
git add .
git commit -m "feat: initial Next.js core setup

- Add health check and echo API endpoints  
- Set up product module structure (translator, vat)
- Configure TypeScript, ESLint, Prettier
- Add environment validation with Zod
- Set up middleware with security headers"
```

---

🎉 **Ваше ядро готово!** Теперь можно дозированно добавлять модули из старых проектов через адаптеры.