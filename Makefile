.PHONY: help start stop restart logs status database reset build clean

# Colors for output
GREEN  := \033[0;32m
YELLOW := \033[0;33m
RED    := \033[0;31m
NC     := \033[0m # No Color

help:
	@echo "$(GREEN)SmartScan+ Admin Portal - Docker Commands$(NC)"
	@echo ""
	@echo "$(YELLOW)Usage:$(NC)"
	@echo "  make start        - Start all services"
	@echo "  make stop         - Stop all services"
	@echo "  make restart      - Restart all services"
	@echo "  make logs         - View logs (follow mode)"
	@echo "  make status       - Show running services"
	@echo "  make database     - Connect to PostgreSQL database"
	@echo "  make reset        - Remove all containers and volumes"
	@echo "  make build        - Build images"
	@echo "  make clean        - Clean up unused Docker resources"
	@echo ""

start:
	@echo "$(GREEN)Starting SmartScan+ Admin Portal...$(NC)"
	docker-compose up -d
	@echo ""
	@echo "$(GREEN)[SUCCESS] Services started!$(NC)"
	@echo ""
	@echo "Access the application at:"
	@echo "  http://localhost:3000/auth/login"
	@echo ""
	@echo "Default credentials:"
	@echo "  Email: admin@smartscan.com"
	@echo "  Password: smartscan123"
	@echo ""

stop:
	@echo "$(YELLOW)Stopping services...$(NC)"
	docker-compose stop
	@echo "$(GREEN)[SUCCESS] Services stopped!$(NC)"

restart:
	@echo "$(YELLOW)Restarting services...$(NC)"
	docker-compose restart
	@echo "$(GREEN)[SUCCESS] Services restarted!$(NC)"
	@echo "Access at: http://localhost:3000/auth/login"

logs:
	@echo "$(YELLOW)Showing live logs (Ctrl+C to exit)...$(NC)"
	docker-compose logs -f

status:
	@echo "$(YELLOW)Running services:$(NC)"
	docker-compose ps
	@echo ""
	@echo "$(YELLOW)Docker stats:$(NC)"
	docker stats --no-stream

database:
	@echo "$(YELLOW)Connecting to PostgreSQL...$(NC)"
	docker exec -it smartscan_postgres psql -U admin -d smartscan_db

build:
	@echo "$(YELLOW)Building images...$(NC)"
	docker-compose build

reset:
	@echo "$(RED)WARNING: This will delete all data!$(NC)"
	@read -p "Are you sure? (y/N) " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		echo "$(YELLOW)Removing all containers and volumes...$(NC)"; \
		docker-compose down -v; \
		echo "$(GREEN)[SUCCESS] Everything removed!$(NC)"; \
	else \
		echo "$(YELLOW)Cancelled.$(NC)"; \
	fi

clean:
	@echo "$(YELLOW)Cleaning up unused Docker resources...$(NC)"
	docker system prune -f
	@echo "$(GREEN)[SUCCESS] Cleanup complete!$(NC)"

# Development targets
dev:
	@echo "$(YELLOW)Starting in development mode...$(NC)"
	docker-compose up

dev-build:
	@echo "$(YELLOW)Building for development...$(NC)"
	docker-compose build --no-cache

shell:
	@echo "$(YELLOW)Opening shell in app container...$(NC)"
	docker-compose exec admin_web sh

logs-app:
	@echo "$(YELLOW)Showing app logs...$(NC)"
	docker-compose logs -f admin_web

logs-db:
	@echo "$(YELLOW)Showing database logs...$(NC)"
	docker-compose logs -f postgres

backup:
	@echo "$(YELLOW)Creating database backup...$(NC)"
	docker exec smartscan_postgres pg_dump -U admin smartscan_db > smartscan_backup_$(shell date +%Y%m%d_%H%M%S).sql
	@echo "$(GREEN)[SUCCESS] Backup created!$(NC)"

ps:
	@docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

version:
	@echo "Checking versions..."
	@echo -n "Docker: "; docker --version
	@echo -n "Docker Compose: "; docker-compose --version
	@echo -n "Node.js: "; docker-compose exec admin_web node --version 2>/dev/null || echo "Not available"

.DEFAULT_GOAL := help
