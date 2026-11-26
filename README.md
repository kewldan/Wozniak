# Wozniak — scheduled job run monitoring

Wozniak tells you whether periodic jobs (backups, data exports, reports) run
on time and succeed.

A small wrapper (`jobrun`) runs a command, reports its start and finish to a
central server, and keeps the command's exit code. The server stores the run
history and detects failures, missing finish confirmations and missed starts.
A web panel shows the current state of every job.

> Work in progress. Sections below are filled in as the project grows.

## Architecture

```
 Ubuntu VM                                    Docker Compose
┌──────────────────────────┐                ┌──────────────────────────────────┐
│ systemd timer            │                │ nginx ──/api──▶ server (Go)       │
│   └─ flock jobrun ──────────HTTP + token──▶│   │               │               │
│        └─ command        │   start/finish │   └──/──▶ web     ▼               │
└──────────────────────────┘                │       (Next.js)  PostgreSQL       │
                                            │                  + TimescaleDB    │
                                            └──────────────────────────────────┘
```

| Component | Path | Stack |
|-----------|------|-------|
| Wrapper   | `cmd/jobrun` | Go, standard library |
| Server    | `cmd/server`, `internal/` | Go, `net/http`, pgx, sqlc, goose |
| Database  | `db/` | PostgreSQL + TimescaleDB |
| Web panel | `web/` | Next.js, Tailwind CSS v4, shadcn/ui (Base UI), SWR |
| Proxy     | `deploy/nginx` | nginx |

## Repository layout

```
api/            HTTP API contract (OpenAPI) and request examples
cmd/            entry points (server, jobrun)
internal/       server and wrapper packages
db/             SQL migrations and sqlc queries
docs/           design documents (configuration, state model)
web/            web panel
deploy/         nginx config, systemd units
examples/       sample job commands
config/         example configuration (no secrets)
```

## Development

The development environment runs in a Dev Container (Docker + VS Code).
[CONTRIBUTING.md](CONTRIBUTING.md) walks through the setup on macOS, Windows
and Linux, and describes the branch, commit and pull request workflow.

- `main` is protected: changes land only through pull requests with green CI.
- Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/).

## Team

| Name          | GitHub nickname | Responsibility scope |
| ------------- | --------------- | -------------------- |
| Fedor Fomenko | MrFome14        | Frontend development      |
| Petr Khrapov | k7ndcat        | Backend development     |
