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

const cacheRefresh: Schemas["Run"] = {
  run_id: "019aa3e3-9bc0-7af3-8f47-87007664f398",
  job_id: "cache-refresh",
  status: "running",
  late: false,
  started_at: "2026-11-20T11:58:00.000Z",
  finished_at: null,
  finish_due_at: "2026-11-20T12:03:00.000Z",
  duration_ms: null,
  exit_code: null,
};

const dataSync: Schemas["Run"] = {
  run_id: "019aa3d4-f600-70d3-a85a-13960a7c5a8c",
  job_id: "data-sync",
  status: "failed",
  late: false,
  started_at: "2026-11-20T11:42:00.000Z",
  finished_at: "2026-11-20T11:42:12.000Z",
  finish_due_at: "2026-11-20T11:47:00.000Z",
  duration_ms: 12000,
  exit_code: 2,
};

const snapshotUpload: Schemas["Run"] = {
  run_id: "019aa3d3-2140-727c-b997-8dc3b4689901",
  job_id: "snapshot-upload",
  status: "finish_overdue",
  late: true,
  started_at: "2026-11-20T11:40:00.000Z",
  finished_at: null,
  finish_due_at: "2026-11-20T11:41:00.000Z",
  duration_ms: null,
  exit_code: null,
};

export const mockJobs: Schemas["JobList"] = {
  server_time: "2026-11-20T12:00:00.000Z",
  items: [
    {
      id: "cache-refresh",
      name: "Обновление кеша",
      state: "running",
      state_since: "2026-11-20T11:58:00.000Z",
      monitoring_since: "2026-11-18T10:00:00.000Z",
      settings: {
        start_interval_seconds: 900,
        max_duration_seconds: 300,
        start_grace_seconds: 60,
      },
      next_start_due_at: "2026-11-20T12:14:00.000Z",
      last_run: cacheRefresh,
    },
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
      id: "data-sync",
      name: "Синхронизация данных",
      state: "failed",
      state_since: "2026-11-20T11:42:12.000Z",
      monitoring_since: "2026-11-18T10:00:00.000Z",
      settings: {
        start_interval_seconds: 3600,
        max_duration_seconds: 300,
        start_grace_seconds: 300,
      },
      next_start_due_at: "2026-11-20T12:47:00.000Z",
      last_run: dataSync,
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
    {
      id: "snapshot-upload",
      name: "Загрузка снимка базы",
      state: "finish_overdue",
      state_since: "2026-11-20T11:41:00.000Z",
      monitoring_since: "2026-11-18T10:00:00.000Z",
      settings: {
        start_interval_seconds: 900,
        max_duration_seconds: 60,
        start_grace_seconds: 60,
      },
      next_start_due_at: "2026-11-20T11:56:00.000Z",
      last_run: snapshotUpload,
    },
  ],
};

export const mockRuns: Schemas["RunDetail"][] = [
  cacheRefresh,
  dataSync,
  nightlyBackup,
  previousBackup,
  reportExport,
  snapshotUpload,
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
          message:
            run.run_id === reportExport.run_id
              ? "Не удалось записать отчёт"
              : null,
          reported_duration_ms: run.duration_ms,
        }
      : null,
}));
