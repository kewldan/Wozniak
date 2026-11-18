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
cmd/            entry points (server, jobrun)
internal/       server and wrapper packages
db/             SQL migrations and sqlc queries
web/            web panel
deploy/         nginx config, systemd units
examples/       sample job commands
config/         example configuration (no secrets)
```

## Development workflow

- Work happens on short-lived branches (`feat/…`, `fix/…`, `docs/…`) merged
  into `main` through pull requests.
- Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/).
