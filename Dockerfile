# syntax=docker/dockerfile:1

FROM golang:1.27.4-alpine3.24 AS build
WORKDIR /src
COPY go.mod go.sum ./
RUN --mount=type=cache,target=/go/pkg/mod go mod download
COPY . .
RUN --mount=type=cache,target=/go/pkg/mod \
    --mount=type=cache,target=/root/.cache/go-build \
    CGO_ENABLED=0 go build -trimpath -ldflags="-s -w" -o /out/server ./cmd/server

FROM alpine:3.24.4
RUN apk add --no-cache ca-certificates tzdata \
 && adduser -D -H -u 10001 wozniak
USER wozniak
COPY --from=build /out/server /usr/local/bin/server
EXPOSE 8080
ENTRYPOINT ["/usr/local/bin/server"]
