"use client";

import Link from "next/link";
import {
  PageMessage,
  RequestError,
  StatusBadge,
} from "@/components/monitoring";
import { useJobs } from "@/lib/api-hooks";
import { formatTime } from "@/lib/format-monitoring";

export default function Home() {
  const { data, error, isLoading, mutate } = useJobs();

  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-semibold tracking-tight">Задачи</h1>

      {isLoading && <PageMessage>Загрузка списка задач…</PageMessage>}
      {error && <RequestError error={error} retry={() => void mutate()} />}
      {data && data.items.length === 0 && (
        <PageMessage>Задачи пока не настроены.</PageMessage>
      )}
      {data && data.items.length > 0 && (
        <div className="overflow-x-auto rounded-xl border bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-slate-50 text-slate-600">
              <tr>
                <th scope="col" className="px-5 py-3 font-medium">
                  Задача
                </th>
                <th scope="col" className="px-5 py-3 font-medium">
                  Статус
                </th>
                <th scope="col" className="px-5 py-3 font-medium">
                  Последний старт (UTC)
                </th>
                <th scope="col" className="px-5 py-3 font-medium">
                  Срок следующего старта (UTC)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {data.items.map((job) => (
                <tr key={job.id} className="hover:bg-slate-50">
                  <th scope="row" className="px-5 py-4 font-normal">
                    <Link
                      href={`/jobs/${encodeURIComponent(job.id)}`}
                      className="font-semibold text-blue-800 hover:underline"
                    >
                      {job.name}
                    </Link>
                    <div className="mt-0.5 text-xs text-slate-500">
                      {job.id}
                    </div>
                  </th>
                  <td className="px-5 py-4">
                    <StatusBadge state={job.state} />
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap tabular-nums">
                    {formatTime(job.last_run?.started_at ?? null)}
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap tabular-nums">
                    {formatTime(job.next_start_due_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
