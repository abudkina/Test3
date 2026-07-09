# ЮрКабинет — CRM для юристов

Прототип дашборда для управления клиентами юридической практики.

## Возможности

- Таблица клиентов (имя, телефон, статус, дата)
- Добавление нового клиента
- Изменение статуса дела: **Новый** → **В работе** → **Закрыт**
- Счётчики клиентов по каждому статусу
- Автоматизация: уведомление юристу на **Email** или **Telegram** при добавлении клиента
- Данные сохраняются в localStorage браузера

## Запуск локально

```bash
npm install
npm run dev
```

## Деплой на GitHub Pages

```powershell
# 1. Установите GitHub CLI (если нет): winget install GitHub.cli
# 2. Запустите скрипт деплоя:
.\deploy.ps1
```

Или вручную:

```bash
gh auth login
git remote add origin https://github.com/abudkina/Test3.git
git push -u origin main
```

После push GitHub Actions автоматически задеплоит сайт.  
URL: `https://abudkina.github.io/Test3/`

В настройках репозитория: **Settings → Pages → Source: GitHub Actions**.

