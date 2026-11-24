import useSWR from "swr";
import { ApiError, getJob, getJobRuns, getJobs, getRun } from "./api-client";

const options = {
  shouldRetryOnError: (error: unknown) =>
    !(error instanceof ApiError && error.status >= 400 && error.status < 500),
};

export function useJobs() {
  return useSWR("jobs", getJobs, options);
}

export function useJob(jobId: string) {
  return useSWR(["job", jobId], ([, id]) => getJob(id), options);
}

export function useJobRuns(jobId: string, cursor: string | null) {
  return useSWR(
    ["job-runs", jobId, cursor],
    ([, id, pageCursor]) => getJobRuns(id, pageCursor),
    options,
  );
}

export function useRun(runId: string) {
  return useSWR(["run", runId], ([, id]) => getRun(id), options);
}
