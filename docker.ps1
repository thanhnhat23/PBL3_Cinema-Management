# Docker Management Script cho Cinema Management
# Usage: .\docker.ps1 [command]

param(
    [Parameter(Position = 0)]
    [string]$Command = "help"
)

function Show-Help {
    Write-Host "Cinema Management - Docker Commands" -ForegroundColor Cyan
    Write-Host "=====================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Usage: .\docker.ps1 [command]" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Commands:" -ForegroundColor Green
    Write-Host "  up              - Start tất cả services"
    Write-Host "  down            - Dừng tất cả services"
    Write-Host "  build           - Build lại tất cả services"
    Write-Host "  rebuild         - Build lại và khởi động"
    Write-Host "  logs            - Xem logs của tất cả services"
    Write-Host "  logs-api        - Xem logs của API"
    Write-Host "  logs-client     - Xem logs của Client"
    Write-Host "  restart         - Restart tất cả services"
    Write-Host "  restart-api     - Restart API"
    Write-Host "  restart-client  - Restart Client"
    Write-Host "  clean           - Dừng và xóa volumes"
    Write-Host "  db              - Start chỉ MySQL và Redis"
    Write-Host "  ps              - Xem trạng thái các services"
    Write-Host "  shell-api       - Truy cập shell của API container"
    Write-Host "  shell-mysql     - Truy cập MySQL CLI"
    Write-Host "  migrate         - Chạy database migrations"
    Write-Host "  help            - Hiển thị help"
    Write-Host ""
}

function Start-Services {
    Write-Host "Starting all services..." -ForegroundColor Green
    docker-compose up -d
    Write-Host "Services started! Check http://localhost:3000" -ForegroundColor Green
}

function Stop-Services {
    Write-Host "Stopping all services..." -ForegroundColor Yellow
    docker-compose down
}

function Build-Services {
    Write-Host "Building all services..." -ForegroundColor Cyan
    docker-compose build
}

function Rebuild-Services {
    Write-Host "Rebuilding and starting services..." -ForegroundColor Cyan
    docker-compose up -d --build
}

function Show-Logs {
    docker-compose logs -f
}

function Show-ApiLogs {
    docker-compose logs -f api
}

function Show-ClientLogs {
    docker-compose logs -f client
}

function Restart-Services {
    Write-Host "Restarting all services..." -ForegroundColor Yellow
    docker-compose restart
}

function Restart-Api {
    Write-Host "Restarting API..." -ForegroundColor Yellow
    docker-compose restart api
}

function Restart-Client {
    Write-Host "Restarting Client..." -ForegroundColor Yellow
    docker-compose restart client
}

function Clean-All {
    Write-Host "Stopping and removing all containers and volumes..." -ForegroundColor Red
    $confirm = Read-Host "Are you sure? This will delete all data! (yes/no)"
    if ($confirm -eq "yes") {
        docker-compose down -v
        Write-Host "Cleaned!" -ForegroundColor Green
    }
    else {
        Write-Host "Cancelled" -ForegroundColor Yellow
    }
}

function Start-DbOnly {
    Write-Host "Starting MySQL and Redis..." -ForegroundColor Cyan
    docker-compose up -d mysql redis
}

function Show-Status {
    docker-compose ps
}

function Shell-Api {
    Write-Host "Entering API container shell..." -ForegroundColor Cyan
    docker-compose exec api /bin/bash
}

function Shell-Mysql {
    Write-Host "Entering MySQL CLI..." -ForegroundColor Cyan
    docker-compose exec mysql mysql -u root -p
}

function Run-Migrations {
    Write-Host "Running migrations..." -ForegroundColor Cyan
    docker-compose exec api dotnet ef database update
}

# Command routing
switch ($Command.ToLower()) {
    "up" { Start-Services }
    "down" { Stop-Services }
    "build" { Build-Services }
    "rebuild" { Rebuild-Services }
    "logs" { Show-Logs }
    "logs-api" { Show-ApiLogs }
    "logs-client" { Show-ClientLogs }
    "restart" { Restart-Services }
    "restart-api" { Restart-Api }
    "restart-client" { Restart-Client }
    "clean" { Clean-All }
    "db" { Start-DbOnly }
    "ps" { Show-Status }
    "shell-api" { Shell-Api }
    "shell-mysql" { Shell-Mysql }
    "migrate" { Run-Migrations }
    "help" { Show-Help }
    default {
        Write-Host "Unknown command: $Command" -ForegroundColor Red
        Write-Host ""
        Show-Help
    }
}
