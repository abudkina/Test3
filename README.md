# ЮрКабинет — CRM для юристов

Прототип дашборда для управления клиентами юридической практики.

## Возможности

- Таблица клиентов (имя, телефон, статус, дата)
- Добавление нового клиента
- Изменение статуса дела: **Новый** → **В работе** → **Закрыт**
- Счётчики клиентов по каждому статусу
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
gh repo create lawyer-client-dashboard --public --source=. --remote=origin --push
```

После push GitHub Actions автоматически задеплоит сайт.  
URL: `https://<ваш-username>.github.io/lawyer-client-dashboard/`

В настройках репозитория: **Settings → Pages → Source: GitHub Actions**.

