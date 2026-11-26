# Configuration

Secrets stay out of Git: `.env`, `config/jobs.yaml` and
`/etc/wozniak/jobrun.env` are ignored. Examples:
[`.env.example`](../.env.example),
[`config/jobs.example.yaml`](../config/jobs.example.yaml),
[`config/jobrun.env.example`](../config/jobrun.env.example).

## Server

| Variable | Default | Meaning |
|----------|---------|---------|
| `WOZNIAK_DATABASE_URL` | required | PostgreSQL URL |
| `WOZNIAK_TOKEN` | required | Sender token, at least 32 characters |
| `WOZNIAK_JOBS_FILE` | `/etc/wozniak/jobs.yaml` | Jobs file |
| `WOZNIAK_LISTEN_ADDR` | `:8080` | HTTP address |

The server does not start if a required variable is missing. Compose mounts
`config/` at `/etc/wozniak`. The Dev Container already sets dev values.

## Jobs

```yaml
jobs:
  - id: nightly-backup
    name: Nightly database backup
    start_interval: 24h
    max_duration: 30m
    start_grace: 10m
```

| Field | Required | Meaning |
|-------|----------|---------|
| `id` | yes | `[a-z0-9][a-z0-9_-]{0,62}`; also the systemd instance name |
| `name` | no | Panel name, defaults to `id` |
| `start_interval` | yes | Max time between run starts |
| `max_duration` | yes | Max time from start to finish |
| `start_grace` | no | Margin before "no expected start", default `1m` |

Durations are Go durations in whole seconds (`30s`, `5m`, `24h`). Unknown
fields, duplicate IDs and an empty list stop the server at startup.

The file is read at startup only; restart the server after editing it.

- New `id`: monitoring starts now (`monitoring_since`).
- Changed settings: apply from now; history stays.
- Removed `id`: hidden from the panel, history kept, events get
  `422 unknown_job`. If it comes back, monitoring starts over.

## Sender token

One token for all jobs: there is one machine and one team. Generate it with
`openssl rand -hex 32` and set the same value on the server (`.env`) and in
`/etc/wozniak/jobrun.env`. To rotate, change both and restart the server.

## jobrun

`/etc/wozniak/jobrun.env` (root, `0600`), loaded by
[`jobrun@.service`](../deploy/systemd/jobrun@.service):

| Variable | Meaning |
|----------|---------|
| `WOZNIAK_URL` | Server URL, for example `http://192.0.2.10:8080` |
| `WOZNIAK_TOKEN` | Sender token |
