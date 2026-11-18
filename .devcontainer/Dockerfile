FROM oven/bun:1.4.4-debian AS bun

FROM mcr.microsoft.com/devcontainers/go:2-1.27-trixie

COPY --from=bun /usr/local/bin/bun /usr/local/bin/bun
RUN ln -s /usr/local/bin/bun /usr/local/bin/bunx \
 && apt-get update \
 && apt-get install -y --no-install-recommends postgresql-client \
 && rm -rf /var/lib/apt/lists/*
