# Final Template Files Package

## 1. CI/CD Pipeline

**Файл: `.github/workflows/ci.yml`**
```yml
name: CI
on:
  pull_request:
    branches: [ main ]
  push:
    branches: [ main ]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: 'pnpm' }
      - run: corepack enable
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm typecheck
      - run: pnpm build
```

## 2. PR Template

**Файл: `.github/pull_request_template.md`**
```md
## Что сделано
- [ ] Краткое описание изменений

## Тест-чеклист
- [ ] `/api/health` возвращает 200 OK
- [ ] Страница модуля открывается без ошибок
- [ ] ESLint/TypeScript проверки проходят
- [ ] Build собирается успешно

## Риски/обратная совместимость
- Указать потенциальные breaking changes
- Влияние на существующий функционал

## Скрины/видео (если применимо)
- Приложить визуальные демонстрации изменений
```

## 3. Code Owners

**Файл: `.github/CODEOWNERS`**
```
# Ядро системы
/src/app/api/*                 @Solarpaletten
/src/lib/*                     @Solarpaletten
/src/middleware.ts             @Solarpaletten

# Продуктовые модули  
/src/app/(products)/translator/*  @Solarpaletten @reviewer
/src/app/(products)/vat/*         @Solarpaletten @reviewer

# Конфигурация
/.github/*                     @Solarpaletten
/package.json                  @Solarpaletten
```

## 4. Project Kickoff Guide

**Файл: `docs/PROJECT_KICKOFF.md`**
```md
# PROJECT KICKOFF

## Быстрый старт нового проекта

### 1. Клонирование и настройка
```bash
# Клонировать новый репозиторий
git clone <new-repo-url>
cd <project-name>

# Настройка окружения
cp .env.example .env.local
pnpm install

# Первый запуск
pnpm dev
```

### 2. Обязательная проверка
- [ ] http://localhost:3000/ - главная страница
- [ ] http://localhost:3000/api/health - health check
- [ ] http://localhost:3000/translator - модуль translator
- [ ] http://localhost:3000/vat - модуль vat

### 3. Создание feature-ветки
```bash
git checkout -b feature/<task-name>
# Разработка...
git add .
git commit -m "feat(scope): description"
git push -u origin feature/<task-name>
```

### 4. Definition of Done
- [ ] Все роуты работают
- [ ] Нет ошибок в консоли
- [ ] ESLint/TypeScript чистые
- [ ] Build проходит успешно
- [ ] Изменения ≤ 200 строк
- [ ] PR создан и прошел review

### 5. Командное взаимодействие
См. `docs/TEAM_GUIDE.md` для полного описания ролей и процессов.

## Структура проекта
```
project-name/
├── docs/
│   ├── TEAM_GUIDE.md
│   ├── PROJECT_KICKOFF.md
│   └── CHANGELOG.md
├── .github/
│   ├── workflows/ci.yml
│   ├── pull_request_template.md
│   └── CODEOWNERS
├── src/
│   ├── app/
│   ├── components/
│   └── lib/
└── package.json
```
```

## 5. README Template

**Файл: `README.md` (обновить)**
```md
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

```bash
# Использовать как template в GitHub или клонировать
git clone <this-repo>
cd project-name

# Настройка и запуск
cp .env.example .env.local
pnpm install
pnpm dev
```

## Документация

- [`docs/TEAM_GUIDE.md`](docs/TEAM_GUIDE.md) - Командное взаимодействие
- [`docs/PROJECT_KICKOFF.md`](docs/PROJECT_KICKOFF.md) - Быстрый старт проекта

## Структура

- `/src/app/(products)/` - Продуктовые модули
- `/src/components/legacy/` - Адаптеры старого кода  
- `/src/lib/` - Утилиты и типы
- `/docs/` - Документация команды

## Версии

- **v1.0.0** - Базовое ядро Next.js
- **v1.1.0** - + MVP адаптер + командные процессы

## Команда

Работаем по единому протоколу:
- **Dashka /** - координатор и стратегия
- **Claude /** - техническое планирование
- **Leanid /** - архитектор и реализация
```

## 6. Changelog Template

**Файл: `docs/CHANGELOG.md`**
```md
# Changelog

## [1.1.0] - 2025-01-XX

### Added
- MVP TextAreaAdapter для translator модуля
- TEAM_GUIDE.md с командными процессами
- CI/CD pipeline с проверками
- PR template и CODEOWNERS
- PROJECT_KICKOFF.md для быстрого старта

### Changed
- Обновлен package.json с typecheck командой
- Улучшена документация в README.md

## [1.0.0] - 2025-01-XX

### Added
- Базовое ядро Next.js 15 с TypeScript
- API роуты /api/health и /api/echo
- Структура (products) для модулей
- Настроенные ESLint, Prettier, Husky
- Environment validation с Zod
- Middleware с security заголовками

### Documentation
- Полное руководство по структуре проекта
- Примеры адаптеров для legacy кода
```

## 7. Команды для финализации

```bash
# В корне шаблона добавить все файлы
mkdir -p .github/workflows
mkdir -p docs

# Создать все файлы из артефакта выше

# Коммит и тег
git add .
git commit -m "feat: add CI/CD, docs and team processes"
git tag -a v1.1.0 -m "v1.1.0 – Complete template with team processes"
git push origin main
git push origin v1.1.0
```

## 8. Настройка GitHub

1. **Settings → General → Template repository** ✅ 
2. **Settings → Branches → Add rule for main**:
   - Require pull request reviews
   - Require status checks (CI)
3. **Settings → Actions** - Enable actions

---

**Шаблон готов для production use!**