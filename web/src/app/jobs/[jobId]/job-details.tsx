"use client";

import Link from "next/link";
import { useState } from "react";
import {
  PageMessage,
  RequestError,
  StatusBadge,
} from "@/components/monitoring";
import { Button } from "@/components/ui/button";
import { useJob, useJobRuns } from "@/lib/api-hooks";
import { formatDuration, formatTime } from "@/lib/format-monitoring";

export function JobDetails({ jobId }: { jobId: string }) {
  const { data: job, error, isLoading, mutate } = useJob(jobId);

  return (
    <div className="space-y-5">
      <Link href="/" className="text-sm text-blue-800 hover:underline">
        ← Все задачи
      </Link>

      {isLoading && <PageMessage>Загрузка задачи…</PageMessage>}
      {error && (
        <RequestError
          error={error}
          notFound="Задача не найдена."
          retry={() => void mutate()}
        />
      )}
      {job && (
        <>
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-semibold tracking-tight">
                {job.name}
              </h1>
              <StatusBadge state={job.state} />
            </div>
            <p className="mt-1 text-sm text-slate-600">{job.id}</p>
          </div>

          <RunHistory key={jobId} jobId={jobId} />
        </>
      )}
    </div>
  );
}

function RunHistory({ jobId }: { jobId: string }) {
  const [cursors, setCursors] = useState<string[]>([]);
  const cursor = cursors.at(-1) ?? null;
  const { data, error, isLoading, mutate } = useJobRuns(jobId, cursor);
  const nextCursor = data?.next_cursor;

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">История запусков</h2>
      {isLoading && <PageMessage>Загрузка истории…</PageMessage>}
      {error && <RequestError error={error} retry={() => void mutate()} />}
      {data && data.items.length === 0 && (
        <PageMessage>У этой задачи пока нет запусков.</PageMessage>
      )}
      {data && data.items.length > 0 && (
        <div className="overflow-x-auto rounded-xl border bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-slate-50 text-slate-600">
              <tr>
                <th scope="col" className="px-5 py-3 font-medium">
                  Старт (UTC)
                </th>
                <th scope="col" className="px-5 py-3 font-medium">
                  Результат
                </th>
                <th scope="col" className="px-5 py-3 font-medium">
                  Завершение (UTC)
                </th>
                <th scope="col" className="px-5 py-3 font-medium">
                  Длительность
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {data.items.map((run) => (
                <tr key={run.run_id} className="hover:bg-slate-50">
                  <th
                    scope="row"
                    className="px-5 py-4 text-left whitespace-nowrap"
                  >
                    <Link
                      href={`/runs/${encodeURIComponent(run.run_id)}`}
                      className="font-semibold text-blue-800 tabular-nums hover:underline"
                    >
                      {run.started_at
                        ? formatTime(run.started_at)
                        : "Старт не получен"}
                    </Link>
                  </th>
                  <td className="px-5 py-4">
                    <StatusBadge state={run.status} />
                    {run.late && run.finished_at && (
                      <div className="mt-1 text-xs text-amber-900">
                        С опозданием
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap tabular-nums">
                    {formatTime(run.finished_at)}
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap tabular-nums">
                    {formatDuration(run.duration_ms)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {(cursor !== null || nextCursor) && (
        <nav aria-label="Страницы истории" className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={cursor === null}
            onClick={() => setCursors(cursors.slice(0, -1))}
          >
            Назад
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={!nextCursor}
            onClick={() => nextCursor && setCursors([...cursors, nextCursor])}
          >
            Дальше
          </Button>
        </nav>
      )}
    </section>
  );
}
