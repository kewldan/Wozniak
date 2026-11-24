import type { ReactNode } from "react";
import { ApiError } from "@/lib/api-client";
import type { components } from "@/lib/api-types";

type State = components["schemas"]["JobState"] | components["schemas"]["RunStatus"];

const statuses: Record<State, { label: string; color: string }> = {
  pending: { label: "Ожидает запуска", color: "bg-slate-100 text-slate-700" },
  running: { label: "Выполняется", color: "bg-blue-50 text-blue-800" },
  succeeded: { label: "Успешно", color: "bg-emerald-50 text-emerald-800" },
  failed: { label: "Ошибка", color: "bg-rose-50 text-rose-800" },
  finish_overdue: {
    label: "Завершение просрочено",
    color: "bg-amber-50 text-amber-900",
  },
  start_overdue: {
    label: "Старт просрочен",
    color: "bg-amber-50 text-amber-900",
  },
};

export function StatusBadge({ state }: { state: State }) {
  const { label, color } = statuses[state];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-medium text-xs ${color}`}>
      <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
      {label}
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
    <p role={role} className="rounded-xl border bg-white p-5 text-slate-700">
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
        className="font-medium text-blue-800 underline underline-offset-4"
        onClick={retry}
      >
        Повторить
      </button>
    </PageMessage>
  );
}
