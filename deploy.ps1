# Деплой на GitHub Pages
# Запустите в PowerShell из папки проекта

$repoName = "lawyer-client-dashboard"

# 1. Авторизация (один раз)
gh auth login

# 2. Создать public репозиторий и запушить
gh repo create $repoName --public --source=. --remote=origin --push

# 3. Включить GitHub Pages (Actions)
gh api repos/{owner}/$repoName/pages -X POST -f build_type=workflow

Write-Host ""
Write-Host "Готово! Сайт появится через 1-2 минуты:"
Write-Host "https://$(gh api user -q .login).github.io/$repoName/"
