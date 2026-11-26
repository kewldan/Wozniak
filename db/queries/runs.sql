-- name: GetRun :one
SELECT * FROM runs WHERE run_id = $1;

-- name: ListRunsByJob :many
-- Newest first. Pass the last row's first_seen_at and run_id as the cursor.
SELECT * FROM runs
WHERE job_id = sqlc.arg(job_id)
  AND (sqlc.narg(before_seen_at)::timestamptz IS NULL
    OR (first_seen_at, run_id)
      < (sqlc.narg(before_seen_at)::timestamptz, sqlc.narg(before_run_id)::uuid))
ORDER BY first_seen_at DESC, run_id DESC
LIMIT sqlc.arg(row_limit);

-- name: ListLatestRuns :many
SELECT DISTINCT ON (job_id) * FROM runs
ORDER BY job_id, first_seen_at DESC, run_id DESC;
