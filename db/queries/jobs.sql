-- name: UpsertJob :one
-- A job that comes back after removal starts monitoring over.
INSERT INTO jobs (
  id, name, start_interval_seconds, max_duration_seconds,
  start_grace_seconds, monitoring_since
) VALUES ($1, $2, $3, $4, $5, $6)
ON CONFLICT (id) DO UPDATE SET
  name = excluded.name,
  start_interval_seconds = excluded.start_interval_seconds,
  max_duration_seconds = excluded.max_duration_seconds,
  start_grace_seconds = excluded.start_grace_seconds,
  monitoring_since = CASE
    WHEN jobs.removed_at IS NULL THEN jobs.monitoring_since
    ELSE excluded.monitoring_since
  END,
  removed_at = NULL
RETURNING *;

-- name: RemoveJobsExcept :execrows
UPDATE jobs SET removed_at = sqlc.arg(removed_at)
WHERE removed_at IS NULL AND NOT (id = ANY (sqlc.arg(keep_ids)::text[]));

-- name: ListJobs :many
SELECT * FROM jobs WHERE removed_at IS NULL ORDER BY id;

-- name: GetJob :one
SELECT * FROM jobs WHERE id = $1 AND removed_at IS NULL;
