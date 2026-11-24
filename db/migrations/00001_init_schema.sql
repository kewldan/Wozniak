-- +goose Up
CREATE EXTENSION IF NOT EXISTS timescaledb;

-- Jobs from jobs.yaml. A removed job keeps its history with removed_at set.
CREATE TABLE jobs (
  id                     text PRIMARY KEY
                           CHECK (id ~ '^[a-z0-9][a-z0-9_-]{0,62}$'),
  name                   text NOT NULL CHECK (char_length(name) <= 200),
  start_interval_seconds integer NOT NULL CHECK (start_interval_seconds > 0),
  max_duration_seconds   integer NOT NULL CHECK (max_duration_seconds > 0),
  start_grace_seconds    integer NOT NULL CHECK (start_grace_seconds >= 0),
  monitoring_since       timestamptz NOT NULL,
  removed_at             timestamptz
);

-- One row per run; either event may arrive first. *_received_at is server
-- time, *_occurred_at is the wrapper clock (display only).
CREATE TABLE runs (
  run_id               uuid PRIMARY KEY,
  job_id               text NOT NULL REFERENCES jobs (id),
  first_seen_at        timestamptz NOT NULL,

  start_received_at    timestamptz,
  start_occurred_at    timestamptz,
  start_host           text,
  start_message        text,

  finish_received_at   timestamptz,
  finish_occurred_at   timestamptz,
  finish_host          text,
  finish_message       text,
  exit_code            smallint CHECK (exit_code BETWEEN 0 AND 255),
  reported_duration_ms bigint CHECK (reported_duration_ms >= 0),
  -- Finish came after start + max_duration; fixed when the finish arrives.
  late                 boolean NOT NULL DEFAULT false,

  CHECK ((start_received_at IS NULL) = (start_occurred_at IS NULL)),
  CHECK (
    (finish_received_at IS NULL
      AND finish_occurred_at IS NULL
      AND exit_code IS NULL
      AND reported_duration_ms IS NULL
      AND NOT late)
    OR (finish_received_at IS NOT NULL
      AND finish_occurred_at IS NOT NULL
      AND exit_code IS NOT NULL
      AND reported_duration_ms IS NOT NULL)
  ),
  CHECK (start_received_at IS NOT NULL OR finish_received_at IS NOT NULL)
);

CREATE INDEX runs_job_id_first_seen_at_idx
  ON runs (job_id, first_seen_at DESC, run_id DESC);

-- Raw log of accepted events, duplicates included. History only: run
-- uniqueness lives in runs, since hypertable unique keys need the time column.
CREATE TABLE events (
  received_at timestamptz NOT NULL,
  run_id      uuid NOT NULL,
  job_id      text NOT NULL,
  type        text NOT NULL CHECK (type IN ('start', 'finish')),
  duplicate   boolean NOT NULL,
  payload     jsonb NOT NULL
);

SELECT create_hypertable('events', by_range('received_at', INTERVAL '7 days'));

CREATE INDEX events_run_id_idx ON events (run_id, received_at DESC);

-- +goose Down
DROP TABLE events;
DROP TABLE runs;
DROP TABLE jobs;
