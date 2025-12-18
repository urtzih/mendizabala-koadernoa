Write-Host "🚀 Iniciando Frontend y Backend..." -ForegroundColor Cyan
Start-Job -ScriptBlock { cd backend; npm run dev } -Name "Backend"
Start-Job -ScriptBlock { npm run dev } -Name "Frontend"
Write-Host "✅ Ambos servidores en ejecución" -ForegroundColor Green
Write-Host "Usa: Get-Job | Stop-Job para detener" -ForegroundColor Gray
Get-Job