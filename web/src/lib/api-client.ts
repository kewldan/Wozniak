import type { components } from "./api-types";
import { mockJobs, mockRuns } from "./mocks";

type Schemas = components["schemas"];
const useMocks = process.env.NEXT_PUBLIC_API_MODE !== "real";
const jobsPath = "/api/v1/jobs";

export class ApiError extends Error {
  constructor(public readonly status: number) {
    super(`HTTP ${status}`);
  }
}

async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(path, {
    headers: { Accept: "application/json" },
  });
  if (!response.ok) {
    throw new ApiError(response.status);
  }
  return response.json();
}

export async function getJobs(): Promise<Schemas["JobList"]> {
  return useMocks ? mockJobs : getJson(jobsPath);
}

export async function getJob(jobId: string): Promise<Schemas["Job"]> {
  if (!useMocks) {
    return getJson(`${jobsPath}/${encodeURIComponent(jobId)}`);
  }

  const job = mockJobs.items.find((item) => item.id === jobId);
  if (!job) {
    throw new ApiError(404);
  }
  return job;
}

export async function getJobRuns(
  jobId: string,
  cursor: string | null,
): Promise<Schemas["RunPage"]> {
  if (!useMocks) {
    const path = `${jobsPath}/${encodeURIComponent(jobId)}/runs`;
    return getJson(
      cursor ? `${path}?${new URLSearchParams({ cursor })}` : path,
    );
  }

  await getJob(jobId);
  if (cursor !== null) {
    throw new ApiError(400);
  }
  return {
    items: mockRuns.filter((run) => run.job_id === jobId),
    next_cursor: null,
  };
}

export async function getRun(runId: string): Promise<Schemas["RunDetail"]> {
  if (!useMocks) {
    return getJson(`/api/v1/runs/${encodeURIComponent(runId)}`);
  }

  const run = mockRuns.find((item) => item.run_id === runId);
  if (!run) {
    throw new ApiError(404);
  }
  return run;
}
