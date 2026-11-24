import type { components } from "./api-types";

type Schemas = components["schemas"];

const nightlyBackup: Schemas["Run"] = {
  run_id: "019aa1f0-7c3e-7d2a-9b1e-3f5c2a8d4e61",
  job_id: "nightly-backup",
  status: "succeeded",
  late: false,
  started_at: "2026-11-20T03:00:00.530Z",
  finished_at: "2026-11-20T03:02:42.010Z",
  finish_due_at: "2026-11-20T03:30:00.530Z",
  duration_ms: 161495,
  exit_code: 0,
};

const previousBackup: Schemas["Run"] = {
  run_id: "019a9c8a-2b11-7f05-8d3a-c1e47b90f2d8",
  job_id: "nightly-backup",
  status: "succeeded",
  late: true,
  started_at: "2026-11-19T03:00:00.480Z",
  finished_at: "2026-11-19T03:41:12.300Z",
  finish_due_at: "2026-11-19T03:30:00.480Z",
  duration_ms: 2471790,
  exit_code: 0,
};

const reportExport: Schemas["Run"] = {
  run_id: "019aa3b2-1d40-7e8f-a0c4-6b7e9d2f1a35",
  job_id: "report-export",
  status: "failed",
  late: false,
  started_at: "2026-11-20T10:10:00.000Z",
  finished_at: "2026-11-20T10:10:03.250Z",
  finish_due_at: "2026-11-20T10:15:00.000Z",
  duration_ms: 3180,
  exit_code: 1,
};

export const mockJobs: Schemas["JobList"] = {
  server_time: "2026-11-20T12:00:00.000Z",
  items: [
    {
      id: "daily-summary",
      name: "Дневная сводка",
      state: "pending",
      state_since: "2026-11-20T11:00:00.000Z",
      monitoring_since: "2026-11-20T11:00:00.000Z",
      settings: {
        start_interval_seconds: 86400,
        max_duration_seconds: 300,
        start_grace_seconds: 300,
      },
      next_start_due_at: "2026-11-21T11:05:00.000Z",
      last_run: null,
    },
    {
      id: "nightly-backup",
      name: "Ночной бэкап (тест)",
      state: "succeeded",
      state_since: "2026-11-20T03:02:42.010Z",
      monitoring_since: "2026-11-18T10:00:00.000Z",
      settings: {
        start_interval_seconds: 86400,
        max_duration_seconds: 1800,
        start_grace_seconds: 600,
      },
      next_start_due_at: "2026-11-21T03:10:00.530Z",
      last_run: nightlyBackup,
    },
    {
      id: "report-export",
      name: "Экспорт отчётов",
      state: "start_overdue",
      state_since: "2026-11-20T11:15:00.000Z",
      monitoring_since: "2026-11-18T10:00:00.000Z",
      settings: {
        start_interval_seconds: 3600,
        max_duration_seconds: 300,
        start_grace_seconds: 300,
      },
      next_start_due_at: "2026-11-20T11:15:00.000Z",
      last_run: reportExport,
    },
  ],
};

export const mockRuns: Schemas["RunDetail"][] = [
  nightlyBackup,
  previousBackup,
  reportExport,
].map((run) => ({
  ...run,
  start: run.started_at
    ? {
        occurred_at: run.started_at,
        received_at: run.started_at,
        host: "vm-01",
        message: null,
      }
    : null,
  finish:
    run.finished_at && run.duration_ms !== null
      ? {
          occurred_at: run.finished_at,
          received_at: run.finished_at,
          host: "vm-01",
          message: run.status === "failed" ? "Не удалось записать отчёт" : null,
          reported_duration_ms: run.duration_ms,
        }
      : null,
}));
