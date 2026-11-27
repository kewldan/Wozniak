"use client";

import Link from "next/link";
import {
  PageMessage,
  RequestError,
  StatusBadge,
} from "@/components/monitoring";
import { useRun } from "@/lib/api-hooks";
import type { components } from "@/lib/api-types";
import { formatDuration, formatTime } from "@/lib/format-monitoring";

export function RunDetails({ runId }: { runId: string }) {
  const { data: run, error, isLoading, mutate } = useRun(runId);

  return (
    <div className="space-y-5">
      {run && (
        <Link
          href={`/jobs/${encodeURIComponent(run.job_id)}`}
          className="text-link text-sm hover:underline"
        >
          ← К истории задачи
        </Link>
      )}

      <div>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-semibold tracking-tight">
            Детали запуска
          </h1>
          {run && <StatusBadge state={run.status} />}
        </div>
        <p className="text-muted-foreground mt-1 font-mono text-sm break-all">
          {runId}
        </p>
      </div>

      {isLoading && <PageMessage>Загрузка деталей запуска…</PageMessage>}
      {error && (
        <RequestError
          error={error}
          notFound="Запуск не найден."
          retry={() => void mutate()}
        />
      )}
      {run && (
        <>
          {run.late && run.finished_at && (
            <PageMessage>
              Подтверждение завершения получено с опозданием.
            </PageMessage>
          )}

          <DetailList
            fields={[
              ["Старт (UTC)", formatTime(run.started_at)],
              ["Завершение (UTC)", formatTime(run.finished_at)],
              ["Срок завершения (UTC)", formatTime(run.finish_due_at)],
              ["Длительность", formatDuration(run.duration_ms)],
              ["Код выхода", run.exit_code ?? "—"],
            ]}
          />

          <div className="grid gap-4 md:grid-cols-2">
            <RunEvent title="Событие старта" event={run.start} />
            <RunEvent title="Событие завершения" event={run.finish} />
          </div>
        </>
      )}
    </div>
  );
}

function DetailList({ fields }: { fields: [string, string | number][] }) {
  return (
    <dl className="bg-card grid gap-x-6 gap-y-4 rounded-xl border p-5 sm:grid-cols-2">
      {fields.map(([label, value]) => (
        <div key={label}>
          <dt className="text-muted-foreground text-sm">{label}</dt>
          <dd className="mt-1 font-medium wrap-break-word tabular-nums">
            {value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function RunEvent({
  title,
  event,
}: {
  title: string;
  event:
    | components["schemas"]["EventInfo"]
    | components["schemas"]["FinishEventInfo"]
    | null;
}) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">{title}</h2>
      {event ? (
        <DetailList
          fields={[
            ["Время события (UTC)", formatTime(event.occurred_at)],
            ["Получено сервером (UTC)", formatTime(event.received_at)],
            ["Машина", event.host ?? "—"],
            ["Сообщение", event.message ?? "—"],
            ...("reported_duration_ms" in event
              ? [
                  [
                    "Длительность по данным jobrun",
                    formatDuration(event.reported_duration_ms),
                  ] as [string, string],
                ]
              : []),
          ]}
        />
      ) : (
        <PageMessage>Событие пока не получено.</PageMessage>
      )}
    </section>
  );
}
