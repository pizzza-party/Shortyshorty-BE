.PHONY: all up down

all: up

up:
	docker-compose -f docker-compose.dev.yaml up --build -d

down:
	docker-compose -f docker-compose.dev.yaml down --rmi all
