.PHONY: all up down

# Alias
DC=docker-compose
DCFILE=docker-compose.dev.yaml

# Command
all: up

up:
	$(DC) -f $(DCFILE) up --build -d

down:
	$(DC) -f $(DCFILE) down --rmi all

log-app:
	$(DC) logs app --follow
