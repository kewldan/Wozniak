.PHONY: build test generate generate-api generate-db api-lint web-dev up down

build:
	go build -o bin/ ./cmd/...

test:
	go test ./...

generate: generate-api generate-db

generate-api:
	go tool oapi-codegen -config api/oapi-codegen.yaml api/openapi.yaml

generate-db:
	go tool sqlc generate

api-lint:
	bunx @redocly/cli@2.82.0 lint api/openapi.yaml

web-dev:
	cd web && bun run dev

up:
	docker compose up -d --build

down:
	docker compose down
