#!/bin/bash

# Docker Management Script cho Cinema Management
# Usage: ./docker.sh [command]

COMMAND=${1:-help}

show_help() {
    echo -e "\033[36mCinema Management - Docker Commands\033[0m"
    echo "====================================="
    echo ""
    echo -e "\033[33mUsage: ./docker.sh [command]\033[0m"
    echo ""
    echo -e "\033[32mCommands:\033[0m"
    echo "  up              - Start tất cả services"
    echo "  down            - Dừng tất cả services"
    echo "  build           - Build lại tất cả services"
    echo "  rebuild         - Build lại và khởi động"
    echo "  logs            - Xem logs của tất cả services"
    echo "  logs-api        - Xem logs của API"
    echo "  logs-client     - Xem logs của Client"
    echo "  restart         - Restart tất cả services"
    echo "  restart-api     - Restart API"
    echo "  restart-client  - Restart Client"
    echo "  clean           - Dừng và xóa volumes"
    echo "  db              - Start chỉ MySQL và Redis"
    echo "  ps              - Xem trạng thái các services"
    echo "  shell-api       - Truy cập shell của API container"
    echo "  shell-mysql     - Truy cập MySQL CLI"
    echo "  migrate         - Chạy database migrations"
    echo "  help            - Hiển thị help"
    echo ""
}

case $COMMAND in
    up)
        echo "Starting all services..."
        docker-compose up -d
        echo "Services started! Check http://localhost:3000"
        ;;
    down)
        echo "Stopping all services..."
        docker-compose down
        ;;
    build)
        echo "Building all services..."
        docker-compose build
        ;;
    rebuild)
        echo "Rebuilding and starting services..."
        docker-compose up -d --build
        ;;
    logs)
        docker-compose logs -f
        ;;
    logs-api)
        docker-compose logs -f api
        ;;
    logs-client)
        docker-compose logs -f client
        ;;
    restart)
        echo "Restarting all services..."
        docker-compose restart
        ;;
    restart-api)
        echo "Restarting API..."
        docker-compose restart api
        ;;
    restart-client)
        echo "Restarting Client..."
        docker-compose restart client
        ;;
    clean)
        echo "Stopping and removing all containers and volumes..."
        read -p "Are you sure? This will delete all data! (yes/no): " confirm
        if [ "$confirm" = "yes" ]; then
            docker-compose down -v
            echo "Cleaned!"
        else
            echo "Cancelled"
        fi
        ;;
    db)
        echo "Starting MySQL and Redis..."
        docker-compose up -d mysql redis
        ;;
    ps)
        docker-compose ps
        ;;
    shell-api)
        echo "Entering API container shell..."
        docker-compose exec api /bin/bash
        ;;
    shell-mysql)
        echo "Entering MySQL CLI..."
        docker-compose exec mysql mysql -u root -p
        ;;
    migrate)
        echo "Running migrations..."
        docker-compose exec api dotnet ef database update
        ;;
    help)
        show_help
        ;;
    *)
        echo "Unknown command: $COMMAND"
        echo ""
        show_help
        ;;
esac
