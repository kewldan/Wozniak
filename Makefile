.PHONY: build test generate web-dev up down

build:
	go build -o bin/ ./cmd/...

test:
	go test ./...

generate:
	go tool sqlc generate

web-dev:
	pnpm --dir web dev

up:
	docker compose up -d --build

down:
	docker compose down
