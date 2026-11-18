.PHONY: build test generate web-dev up down

build:
	go build -o bin/ ./cmd/...

test:
	go test ./...

generate:
	go tool sqlc generate

web-dev:
	cd web && bun run dev

up:
	docker compose up -d --build

down:
	docker compose down
