import type { ReactNode } from "react";
import { ApiError } from "@/lib/api-client";
import type { components } from "@/lib/api-types";

type RunStatus = components["schemas"]["RunStatus"];
type State = components["schemas"]["JobState"] | RunStatus;

const statuses: Record<
  State,
  { label: string; text: string; background: string }
> = {
  pending: {
    label: "Ожидает запуска",
    text: "text-slate-700 dark:text-slate-200",
    background: "bg-slate-100 dark:bg-slate-400/15",
  },
  running: {
    label: "Выполняется",
    text: "text-blue-800 dark:text-blue-200",
    background: "bg-blue-100/75 dark:bg-blue-400/15",
  },
  succeeded: {
    label: "Успешно",
    text: "text-emerald-800 dark:text-emerald-200",
    background: "bg-emerald-100/75 dark:bg-emerald-400/15",
  },
  failed: {
    label: "Ошибка",
    text: "text-rose-800 dark:text-rose-200",
    background: "bg-rose-100/75 dark:bg-rose-400/15",
  },
  finish_overdue: {
    label: "нет подтверждения завершения в срок",
    text: "text-amber-900 dark:text-amber-200",
    background: "bg-amber-100/75 dark:bg-amber-400/15",
  },
  start_overdue: {
    label: "нет ожидаемого запуска",
    text: "text-amber-900 dark:text-amber-200",
    background: "bg-amber-100/75 dark:bg-amber-400/15",
  },
};

export function StatusBadge({ state }: { state: State }) {
  const { label, text, background } = statuses[state];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium ${text} ${background}`}
    >
      <span
        aria-hidden="true"
        className="size-1.5 shrink-0 rounded-full bg-current"
      />
      {label}
    </span>
  );
}

export function RunStatusText({ state }: { state: RunStatus }) {
  const { label, text } = statuses[state];
  return (
    <span
      className={`font-medium ${text}`}
      title={state === "finish_overdue" ? label : undefined}
    >
      {state === "finish_overdue" ? "Нет подтверждения" : label}
    </span>
  );
}

export function PageMessage({
  children,
  role = "status",
}: {
  children: ReactNode;
  role?: "status" | "alert";
}) {
  return (
    <p
      role={role}
      className="bg-card text-muted-foreground rounded-xl border p-5"
    >
      {children}
    </p>
  );
}

export function RequestError({
  error,
  notFound,
  retry,
}: {
  error: unknown;
  notFound?: string;
  retry: () => void;
}) {
  if (error instanceof ApiError && error.status === 404 && notFound) {
    return <PageMessage role="alert">{notFound}</PageMessage>;
  }

  return (
    <PageMessage role="alert">
      Не удалось загрузить данные.{" "}
      <button
        type="button"
        className="text-link font-medium underline underline-offset-4"
        onClick={retry}
      >
        Повторить
      </button>
    </PageMessage>
  );
}
