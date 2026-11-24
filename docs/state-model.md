# State model

How the server turns events and deadlines into run statuses and job states.
Names match `RunStatus` and `JobState` in [`api/openapi.yaml`](../api/openapi.yaml).

## Clocks

- Deadlines and states use **server time**: `received_at` of each event and
  the current time `now`.
- `occurred_at` from jobrun is for display only.
- `duration_ms` is measured by jobrun.

## Inputs

| Name | Meaning |
|------|---------|
| `I`, `D`, `G` | Job settings: `start_interval`, `max_duration`, `start_grace` |
| `M` | `monitoring_since`: when the server started watching the job |
| `S`, `F` | `received_at` of a run's start and finish; either may be missing |

## Run status

`finish_due_at = S + D` (none without a start).

| Start | Finish | Status | `late` |
|-------|--------|--------|--------|
| yes | no, `now <= S + D` | `running` | false |
| yes | no, `now > S + D` | `finish_overdue` | true |
| any | yes, exit 0 | `succeeded` | `F > S + D` (false without a start) |
| any | yes, exit ≠ 0 | `failed` | same |

- A finish always wins: a `finish_overdue` run becomes `succeeded`/`failed`
  with `late: true`.
- `duration_ms` is shown only when both events exist.
- A run without a finish stays `finish_overdue` forever: a missing finish
  does not prove the command is still running.

## Job state

The latest run `L` is the one first seen last. The last activity `A` is the
latest `S` among runs, or `F` for runs without a start: a lost start does
not prove the command did not run.

`next_start_due_at = (A or M) + I + G`

The first matching rule wins:

1. `L` is `finish_overdue` → `finish_overdue`
2. `now > next_start_due_at` → `start_overdue`
3. no runs → `pending`
4. otherwise → status of `L` (`running`, `succeeded`, `failed`)

Rule 1 beats rule 2: a hung run blocks the next starts (`flock`), so the
hang is the root cause.

`state_since` is the moment the state changed: `received_at` for an event,
the deadline itself for a time-based change. A restart does not change it:
states are recomputed from the database with the same rules.

Settings changes apply to all deadlines from the next evaluation.

## Examples

All with `I = 5m`, `D = 1m`, `G = 1m`, `M = 10:00:00`. Times are server
times. Each row is one test: apply the events, evaluate at `now`.

| # | Events | `now` | Run | `late` | Job | `next_start_due_at` |
|---|--------|-------|-----|--------|-----|---------------------|
| 1 | — | 10:06:00 | — | — | `pending` | 10:06:00 |
| 2 | — | 10:06:01 | — | — | `start_overdue` since 10:06:00 | 10:06:00 |
| 3 | start 10:03 | 10:03:30 | `running` | false | `running` | 10:09:00 |
| 4 | start 10:03, finish 10:03:40 exit 0 | 10:04 | `succeeded` | false | `succeeded` | 10:09:00 |
| 5 | start 10:03, finish 10:03:40 exit 2 | 10:04 | `failed` | false | `failed` | 10:09:00 |
| 6 | start 10:03 | 10:04:00 | `running` | false | `running` | 10:09:00 |
| 7 | start 10:03 | 10:04:01 | `finish_overdue` | true | `finish_overdue` since 10:04:00 | 10:09:00 |
| 8 | start 10:03, finish 10:05 exit 0 | 10:05 | `succeeded` | true | `succeeded` | 10:09:00 |
| 9 | start 10:03 | 10:09:01 | `finish_overdue` | true | `finish_overdue` (rule 1) | 10:09:00 |
| 10 | start 10:03, finish 10:03:40 exit 0 | 10:09:01 | `succeeded` | false | `start_overdue` since 10:09:00 | 10:09:00 |
| 11 | as 10, then start 10:10 | 10:10 | new run `running` | false | `running` | 10:16:00 |
| 12 | finish 10:08 exit 0, no start | 10:08 | `succeeded`, no duration | false | `succeeded` | 10:14:00 |
| 13 | finish 10:03:05 exit 0, then start 10:03:06 | 10:04 | `succeeded` | false | `succeeded` | 10:09:06 |
| 14 | as 4, plus a repeated finish 10:03:45 | 10:04 | unchanged | false | `succeeded` | 10:09:00 |
| 15 | as 7, server down 10:03:30–10:05 | 10:05 | `finish_overdue` | true | `finish_overdue` since 10:04:00 | 10:09:00 |
