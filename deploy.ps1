# Деплой на GitHub Pages
# Запустите в PowerShell из папки проекта

$owner = "abudkina"
$repoName = "Test3"

# 1. Авторизация (один раз)
gh auth login

# 2. Привязать удалённый репозиторий и запушить
git remote remove origin 2>$null
git remote add origin "https://github.com/$owner/$repoName.git"
git push -u origin main

# 3. Включить GitHub Pages (Actions)
gh api repos/$owner/$repoName/pages -X POST -f build_type=workflow

Write-Host ""
Write-Host "Готово! Сайт появится через 1-2 минуты:"
Write-Host "https://$owner.github.io/$repoName/"
