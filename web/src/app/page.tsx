"use client";

import Link from "next/link";
import {
  PageMessage,
  RequestError,
  RunStatusText,
  StatusBadge,
} from "@/components/monitoring";
import { useJobs } from "@/lib/api-hooks";
import {
  formatCompactTime,
  formatDuration,
  formatTime,
} from "@/lib/format-monitoring";

export default function Home() {
  const { data, error, isLoading, mutate } = useJobs();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
        Задачи
      </h1>

      {isLoading && <PageMessage>Загрузка списка задач…</PageMessage>}
      {error && <RequestError error={error} retry={() => void mutate()} />}
      {data && data.items.length === 0 && (
        <PageMessage>Задачи пока не настроены.</PageMessage>
      )}
      {data && data.items.length > 0 && (
        <div className="bg-card overflow-x-auto rounded-xl border">
          <table className="w-full min-w-[46rem] text-left text-sm">
            <thead className="bg-muted border-b">
              <tr>
                <th scope="col" className="w-[27%] px-5 py-3.5 font-semibold">
                  Задача
                </th>
                <th scope="col" className="w-1/4 px-5 py-3.5 font-semibold">
                  Статус
                </th>
                <th scope="col" className="w-1/4 px-5 py-3.5 font-semibold">
                  Последний запуск<span className="sr-only"> (UTC)</span>
                </th>
                <th scope="col" className="px-5 py-3.5 font-semibold">
                  Следующий старт<span className="sr-only"> (UTC)</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-border divide-y">
              {data.items.map((job) => {
                const run = job.last_run;

                return (
                  <tr key={job.id} className="hover:bg-muted/60">
                    <th scope="row" className="px-5 py-3.5 font-normal">
                      <Link
                        href={`/jobs/${encodeURIComponent(job.id)}`}
                        className="text-link decoration-link/35 hover:decoration-link font-semibold underline underline-offset-4"
                      >
                        {job.name}
                      </Link>
                      <div className="text-muted-foreground mt-1 font-mono text-xs">
                        {job.id}
                      </div>
                    </th>
                    <td className="px-5 py-3.5">
                      <StatusBadge state={job.state} />
                    </td>
                    <td className="px-5 py-3.5">
                      {run ? (
                        <div className="space-y-0.5">
                          <div className="whitespace-nowrap">
                            {run.started_at === null && "Завершение: "}
                            <CompactTimestamp
                              value={run.started_at ?? run.finished_at}
                              serverTime={data.server_time}
                            />
                          </div>
                          <div className="text-muted-foreground text-xs tabular-nums">
                            <RunStatusText state={run.status} />
                            {run.duration_ms !== null &&
                              ` · ${formatDuration(run.duration_ms)}`}
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">
                          Запусков пока нет
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <CompactTimestamp
                        value={job.next_start_due_at}
                        serverTime={data.server_time}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function CompactTimestamp({
  value,
  serverTime,
}: {
  value: string | null;
  serverTime: string;
}) {
  if (value === null) {
    return "—";
  }

  return (
    <time
      dateTime={value}
      title={`${formatTime(value)} UTC`}
      className="tabular-nums"
    >
      {formatCompactTime(value, serverTime)}
    </time>
  );
}
