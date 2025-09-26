`````md
# Dashka Next.js Core Template

Чистое ядро Next.js для быстрого старта продуктовых проектов.

## Возможности

- ✅ Next.js 15 + TypeScript + App Router
- ✅ API роуты (health check, echo)
- ✅ Структура под продуктовые модули
- ✅ ESLint + Prettier + Husky
- ✅ CI/CD pipeline
- ✅ Команда и процессы

## Быстрый старт

`````bash
# Использовать как template в GitHub или клонировать
git clone <this-repo>
cd project-name

# Настройка и запуск
cp .env.example .env.local
pnpm install
pnpm dev


Next.js Core Files - Ready to Copy
📁 Структура папок (выполните команды)
bash# Создаем структуру папок
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

Отлично! Базовая настройка прошла успешно. Теперь создадим все необходимые файлы и структуру для вашего ядра Next.js.Next.js Core Files SetupDocument # Next.js Core Files - Ready to Copy

## 📁 Структура папок (выполните команды)

````bash
# Создаем структуру папок
mkdir -p src/app/api/health
mkdir -p src/app/api/echo
mkdir -p "src/app/(products)/translator"
mkdir -p "src/app/(products)/vat"
mkdir Создал полное руководство с готовыми файлами! Теперь вы можете:
🚀 Следующие шаги:

Скопируйте все файлы из артефакта выше в нужные места
Выполните команды для создания папок и настройки
Запустите проект командой pnpm dev

🔥 Что получится:

✅ Рабочее ядро с красивым UI
✅ Health check API (/api/health)
✅ Echo API для тестов (/api/echo)
✅ Заготовки страниц под продукты
✅ Типизация с TypeScript + Zod
✅ Настроенный линтер и prettier
✅ Pre-commit хуки

📋 После создания всех файлов:
bash# Первый запуск
cp .env.example .env.local
pnpm dev
Откроется красивая главная страница с навигацией по всем модулям!
🎯 Главное преимущество:
Теперь у Клауди есть стабильная база, куда он может добавлять по одному файлу из старых проектов через адаптеры, не ломая основное ядро.
Хотите, чтобы я создал дополнительно шаблоны адаптеров для разных типов компонентов (UI, логика, API)?RetryClaude can make mistakes. Please double-check responses.

Отлично! Проект успешно создан. Вижу, что Next.js установился с новой версией 15.5.4 и всё настроено правильно. Теперь продолжаем по чек-листу.
Следующие шаги:
🔧 Добавим зависимости для качества кода
bash# Вернитесь в корень проекта
cd ../..

# Добавим основные зависимости
pnpm add zod
pnpm add -D prettier @trivago/prettier-plugin-sort-imports husky lint-staged

# Настроим husky
pnpm dlx husky init
📝 Настроим конфигурационные файлы
После выполнения команд выше, нужно создать/обновить несколько файлов:

Обновите .husky/pre-commit:

bash#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"
pnpm lint-staged

Добавьте в package.json (в секцию scripts и в конец файла):

json{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "lint-staged": {
    "*.{ts,tsx,js,jsx}": ["eslint --fix"],
    "*.{ts,tsx,js,jsx,css,md,json}": ["prettier --write"]
  }
}
🗂️ Создаем структуру папок
Нужно создать следующие папки и файлы:
bash# В корне проекта создать:
mkdir -p src/app/api/health
mkdir -p src/app/api/echo
mkdir -p src/app/\(products\)/translator
mkdir -p src/app/\(products\)/vat
mkdir -p src/components/ui
mkdir -p src/components/legacy
mkdir -p src/lib

# Создать базовые файлы
touch .env.example
touch src/middleware.ts
Хотите, чтобы я создал артефакт с готовым содержимым всех нужных файлов, которые вы сможете скопировать? Или предпочитаете продолжать пошагово?
Также заметил, что у вас установился Tailwind несмотря на флаг --tailwind=false. Это нормально - можете его оставить или удалить позже, это не критично для нашего ядра.


<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Next.js Checklist - Dashka Team</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }

        .header {
            background: rgba(255, 255, 255, 0.95);
            border-radius: 20px;
            padding: 30px;
            margin-bottom: 30px;
            text-align: center;
            backdrop-filter: blur(10px);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }

        .header h1 {
            color: #667eea;
            font-size: 2.5rem;
            margin-bottom: 10px;
            background: linear-gradient(45deg, #667eea, #764ba2);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .warning {
            background: #fff3cd;
            border: 2px solid #ffc107;
            border-radius: 10px;
            padding: 20px;
            margin-bottom: 30px;
            font-weight: 600;
        }

        .tabs {
            display: flex;
            gap: 10px;
            margin-bottom: 30px;
            flex-wrap: wrap;
        }

        .tab {
            background: rgba(255, 255, 255, 0.2);
            border: none;
            padding: 12px 24px;
            border-radius: 50px;
            color: white;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
        }

        .tab.active {
            background: rgba(255, 255, 255, 0.9);
            color: #667eea;
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
        }

        .content {
            background: rgba(255, 255, 255, 0.95);
            border-radius: 20px;
            padding: 30px;
            backdrop-filter: blur(10px);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }

        .section {
            display: none;
        }

        .section.active {
            display: block;
        }

        .checklist-item {
            background: #f8f9ff;
            border: 2px solid #e9ecef;
            border-radius: 15px;
            padding: 20px;
            margin-bottom: 15px;
            transition: all 0.3s ease;
            cursor: pointer;
        }

        .checklist-item:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 30px rgba(102, 126, 234, 0.1);
        }

        .checklist-item.completed {
            background: #d4edda;
            border-color: #28a745;
            opacity: 0.8;
        }

        .checklist-item.completed .item-title {
            text-decoration: line-through;
        }

        .item-header {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
        }

        .checkbox {
            width: 20px;
            height: 20px;
            margin-right: 15px;
            cursor: pointer;
            accent-color: #667eea;
            transform: scale(1.5);
        }

        .item-title {
            font-weight: 700;
            color: #495057;
            font-size: 1.1rem;
        }

        .item-description {
            margin-left: 35px;
            color: #6c757d;
            margin-bottom: 10px;
        }

        .code-block {
            background: #2d3748;
            color: #e2e8f0;
            padding: 15px;
            border-radius: 10px;
            font-family: 'Consolas', 'Monaco', monospace;
            font-size: 0.9rem;
            margin: 10px 0;
            overflow-x: auto;
            position: relative;
        }

        .copy-btn {
            position: absolute;
            top: 10px;
            right: 10px;
            background: #667eea;
            border: none;
            color: white;
            padding: 5px 10px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 0.8rem;
            opacity: 0.7;
            transition: opacity 0.3s ease;
        }

        .copy-btn:hover {
            opacity: 1;
        }

        .file-content {
            background: #f8f9fa;
            border: 1px solid #dee2e6;
            border-radius: 10px;
            padding: 15px;
            margin: 10px 0;
            font-family: 'Consolas', 'Monaco', monospace;
            font-size: 0.9rem;
            overflow-x: auto;
        }

        .progress-bar {
            background: #e9ecef;
            border-radius: 10px;
            height: 20px;
            margin: 20px 0;
            overflow: hidden;
        }

        .progress-fill {
            background: linear-gradient(45deg, #28a745, #20c997);
            height: 100%;
            transition: width 0.5s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 600;
            font-size: 0.8rem;
        }

        .file-tree {
            background: #f8f9fa;
            border: 1px solid #dee2e6;
            border-radius: 10px;
            padding: 20px;
            margin: 15px 0;
            font-family: 'Consolas', 'Monaco', monospace;
        }

        .migration-rules {
            background: #fff3cd;
            border: 2px solid #ffc107;
            border-radius: 15px;
            padding: 20px;
            margin: 20px 0;
        }

        .migration-rules h3 {
            color: #856404;
            margin-bottom: 15px;
        }

        .dos-donts {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin: 20px 0;
        }

        .do, .dont {
            padding: 15px;
            border-radius: 10px;
        }

        .do {
            background: #d4edda;
            border: 2px solid #28a745;
        }

        .dont {
            background: #f8d7da;
            border: 2px solid #dc3545;
        }

        .do h4, .dont h4 {
            margin-bottom: 10px;
        }

        .template-task {
            background: #e7f3ff;
            border: 2px solid #0066cc;
            border-radius: 15px;
            padding: 20px;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Next.js Project Setup</h1>
            <p>Пошаговое руководство для создания чистого ядра Next.js</p>
        </div>

        <div class="warning">
            <strong>⚠️ ВАЖНО:</strong> Создаём чистое ядро Next.js СНАЧАЛА, а потом дозированно добавляем модули из старых продуктов через адаптеры!
        </div>

        <div class="progress-bar">
            <div class="progress-fill" id="progressFill" style="width: 0%">0%</div>
        </div>

        <div class="tabs">
            <button class="tab active" onclick="showSection('checklist')">Чек-лист</button>
            <button class="tab" onclick="showSection('files')">Файлы</button>
            <button class="tab" onclick="showSection('migration')">Миграция</button>
            <button class="tab" onclick="showSection('tasks')">Задачи для Клауди</button>
        </div>

        <div class="content">
            <!-- CHECKLIST SECTION -->
            <div id="checklist" class="section active">
                <h2>Основной чек-лист</h2>

                <div class="checklist-item" data-step="1">
                    <div class="item-header">
                        <input type="checkbox" class="checkbox">
                        <span class="item-title">1. Инициализация проекта</span>
                    </div>
                    <div class="item-description">Создать базовую структуру Next.js с TypeScript</div>
                    <div class="code-block">
                        <button class="copy-btn" onclick="copyCode(this)">Copy</button>
# Создать папку проекта
mkdir nextjs && cd nextjs

npm install -g pnpm

# Scaffold Next.js с TypeScript
pnpm dlx create-next-app@latest . --ts --eslint --src-dir --app --tailwind=false --import-alias "@/*"

# Основные зависимости
pnpm add zod
pnpm add -D prettier @trivago/prettier-plugin-sort-imports husky lint-staged
                    </div>
                </div>

                <div class="checklist-item" data-step="2">
                    <div class="item-header">
                        <input type="checkbox" class="checkbox">
                        <span class="item-title">2. Настройка качества кода</span>
                    </div>
                    <div class="item-description">Husky, lint-staged, prettier</div>
                    <div class="code-block">
                        <button class="copy-btn" onclick="copyCode(this)">Copy</button>
# Инициализировать husky
pnpm dlx husky init

# Содержимое .husky/pre-commit:
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"
pnpm lint-staged
                    </div>
                </div>

                <div class="checklist-item" data-step="3">
                    <div class="item-header">
                        <input type="checkbox" class="checkbox">
                        <span class="item-title">3. Базовые API роуты</span>
                    </div>
                    <div class="item-description">health check и echo endpoint</div>
                </div>

                <div class="checklist-item" data-step="4">
                    <div class="item-header">
                        <input type="checkbox" class="checkbox">
                        <span class="item-title">4. Каркас UI страниц</span>
                    </div>
                    <div class="item-description">Главная страница и заготовки под продукты</div>
                </div>

                <div class="checklist-item" data-step="5">
                    <div class="item-header">
                        <input type="checkbox" class="checkbox">
                        <span class="item-title">5. Структура продуктов</span>
                    </div>
                    <div class="item-description">Папки под translator, vat и другие модули</div>
                </div>

                <div class="checklist-item" data-step="6">
                    <div class="item-header">
                        <input type="checkbox" class="checkbox">
                        <span class="item-title">6. Middleware и конфиг</span>
                    </div>
                    <div class="item-description">Security заголовки и базовая конфигурация</div>
                </div>

                <div class="checklist-item" data-step="7">
                    <div class="item-header">
                        <input type="checkbox" class="checkbox">
                        <span class="item-title">7. Environment переменные</span>
                    </div>
                    <div class="item-description">Validation с Zod, .env.example</div>
                </div>

                <div class="checklist-item" data-step="8">
                    <div class="item-header">
                        <input type="checkbox" class="checkbox">
                        <span class="item-title">8. Тестирование локально</span>
                    </div>
                    <div class="item-description">Запуск dev сервера и проверка всех роутов</div>
                    <div class="code-block">
                        <button class="copy-btn" onclick="copyCode(this)">Copy</button>
# Первый запуск
cp .env.example .env.local
pnpm install
pnpm dev

# Проверить:
# http://localhost:3000/
# http://localhost:3000/api/health
# http://localhost:3000/translator
                    </div>
                </div>

                <div class="checklist-item" data-step="9">
                    <div class="item-header">
                        <input type="checkbox" class="checkbox">
                        <span class="item-title">9. Definition of Done проверка</span>
                    </div>
                    <div class="item-description">
                        ✅ Все роуты работают<br>
                        ✅ Нет ошибок в консоли<br>
                        ✅ Линтер зелёный<br>
                        ✅ Pre-commit хук работает
                    </div>
                </div>
            </div>

            <!-- FILES SECTION -->
            <div id="files" class="section">
                <h2>Структура файлов</h2>

                <div class="file-tree">
next-product/
├── app/
│   ├── api/
│   │   ├── health/route.ts
│   │   └── echo/route.ts
│   ├── (products)/
│   │   ├── translator/page.tsx
│   │   └── vat/page.tsx
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/Container.tsx
│   └── legacy/
│       └── (модули из старых проектов)
├── lib/
│   ├── env.ts
│   ├── logger.ts
│   └── types.ts
├── middleware.ts
├── .env.example
├── next.config.ts
└── package.json
                </div>

                <h3>Ключевые файлы для копирования:</h3>

                <details>
                    <summary><strong>app/layout.tsx</strong></summary>
                    <div class="file-content">
export const metadata = {
  title: 'Dashka • Next Entry',
  description: 'Minimal core'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    &lt;html lang="ru"&gt;
      &lt;body style={{
        margin: 0,
        fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto'
      }}&gt;
        {children}
      &lt;/body&gt;
    &lt;/html&gt;
  );
}
                    </div>
                </details>

                <details>
                    <summary><strong>app/api/health/route.ts</strong></summary>
                    <div class="file-content">
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export async function GET() {
  return NextResponse.json({
    ok: true,
    service: 'next-core',
    ts: new Date().toISOString()
  });
}
                    </div>
                </details>

                <details>
                    <summary><strong>lib/env.ts</strong></summary>
                    <div class="file-content">
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
                    </div>
                </details>
            </div>

            <!-- MIGRATION SECTION -->
            <div id="migration" class="section">
                <h2>Правила миграции файлов</h2>

                <div class="migration-rules">
                    <h3>🚨 Золотое правило</h3>
                    <p><strong>Никогда не тащи файлы из старых проектов "как есть" в app/</strong><br>
                    Всегда используй адаптеры в components/legacy/</p>
                </div>

                <div class="dos-donts">
                    <div class="do">
                        <h4>✅ ПРАВИЛЬНО</h4>
                        <ul>
                            <li>Создать адаптер в components/legacy/</li>
                            <li>Добавить типы к старому коду</li>
                            <li>Один файл = один PR</li>
                            <li>Тестировать каждый шаг</li>
                            <li>Следовать DoD</li>
                        </ul>
                    </div>
                    <div class="dont">
                        <h4>❌ НЕПРАВИЛЬНО</h4>
                        <ul>
                            <li>Копировать 20 файлов сразу</li>
                            <li>Менять ядро под старый код</li>
                            <li>Переписывать весь продукт сразу</li>
                            <li>Игнорировать типы TypeScript</li>
                            <li>Коммитить сломанный код</li>
                        </ul>
                    </div>
                </div>

                <h3>Пошаговый процесс миграции:</h3>
                <ol>
                    <li><strong>Выбери ОДИН файл</strong> из старого проекта</li>
                    <li><strong>Создай адаптер</strong> в components/legacy/&lt;feature&gt;/</li>
                    <li><strong>Добавь типы</strong> (Props interface)</li>
                    <li><strong>Подключи к странице</strong> в app/(products)/</li>
                    <li><strong>Протестируй</strong> - все работает?</li>
                    <li><strong>Коммит</strong> - один маленький PR</li>
                    <li><strong>Повтори</strong> для следующего файла</li>
                </ol>
            </div>

            <!-- TASKS SECTION -->
            <div id="tasks" class="section">
                <h2>Задачи для Клауди</h2>

                <div class="template-task">
                    <h3>📋 Шаблон задачи</h3>

                    <h4>Заголовок:</h4>
                    <code>Translator: перенести OldTextArea.js как LegacyTextAreaAdapter.tsx</code>

                    <h4>Шаги:</h4>
                    <ol>
                        <li>Положи исходник в components/legacy/translator/_source/ (read-only)</li>
                        <li>Создай components/legacy/translator/LegacyTextAreaAdapter.tsx с 'use client'</li>
                        <li>Приведи пропы к типам: value: string, onChange(v: string): void</li>
                        <li>Подключи в app/(products)/translator/page.tsx</li>
                        <li>Заведи демо: ввод текста — вывод под полем</li>
                    </ol>

                    <h4>Границы:</h4>
                    <ul>
                        <li>❌ Не трогать app/api/*</li>
                        <li>❌ Не трогать middleware.ts</li>
                        <li>❌ Не трогать конфиги</li>
                    </ul>

                    <h4>Definition of Done:</h4>
                    <ul>
                        <li>✅ Страница /translator открывается</li>
                        <li>✅ /api/health возвращает {ok: true}</li>
                        <li>✅ Нет ошибок в консоли</li>
                        <li>✅ Нет ESLint ошибок</li>
                        <li>✅ Коммит: feat(translator): add LegacyTextAreaAdapter</li>
                    </ul>
                </div>

                <h3>Другие типовые задачи:</h3>
                <ul>
                    <li><strong>UI компонент:</strong> перенести Button, Modal, Form</li>
                    <li><strong>Логика:</strong> перенести utils, api calls, formatters</li>
                    <li><strong>Страница:</strong> адаптировать целую HTML страницу в TSX</li>
                    <li><strong>API:</strong> создать новый endpoint (не переносить старый!)</li>
                </ul>

                <div class="warning">
                    <strong>💡 Помни:</strong> каждая задача = максимум 200 строк кода. Если больше — раздели на части!
                </div>
            </div>
        </div>
    </div>

    <script>
        function showSection(sectionId) {
            // Hide all sections
            const sections = document.querySelectorAll('.section');
            sections.forEach(section => section.classList.remove('active'));

            // Hide all tabs
            const tabs = document.querySelectorAll('.tab');
            tabs.forEach(tab => tab.classList.remove('active'));

            // Show selected section and tab
            document.getElementById(sectionId).classList.add('active');
            event.target.classList.add('active');
        }

        function copyCode(button) {
            const codeBlock = button.parentElement;
            const code = codeBlock.textContent.replace('Copy', '').trim();
            navigator.clipboard.writeText(code).then(() => {
                button.textContent = 'Copied!';
                setTimeout(() => {
                    button.textContent = 'Copy';
                }, 2000);
            });
        }

        function updateProgress() {
            const checkboxes = document.querySelectorAll('.checklist-item input[type="checkbox"]');
            const checkedBoxes = document.querySelectorAll('.checklist-item input[type="checkbox"]:checked');
            const progress = (checkedBoxes.length / checkboxes.length) * 100;

            const progressFill = document.getElementById('progressFill');
            progressFill.style.width = progress + '%';
            progressFill.textContent = Math.round(progress) + '%';
        }

        // Add event listeners to checkboxes
        document.addEventListener('DOMContentLoaded', function() {
            const checkboxes = document.querySelectorAll('.checklist-item input[type="checkbox"]');
            checkboxes.forEach(checkbox => {
                checkbox.addEventListener('change', function() {
                    const item = this.closest('.checklist-item');
                    if (this.checked) {
                        item.classList.add('completed');
                    } else {
                        item.classList.remove('completed');
                    }
                    updateProgress();
                });
            });
        });
    </script>
</body>
</html>



This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
`````
`````

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
# nextmybaby
# nextmybaby
