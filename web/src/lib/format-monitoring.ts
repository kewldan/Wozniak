const utcTime = new Intl.DateTimeFormat("ru-RU", {
  dateStyle: "medium",
  timeStyle: "medium",
  timeZone: "UTC",
});

const utcClock = new Intl.DateTimeFormat("ru-RU", {
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
  timeZone: "UTC",
});

const utcDay = new Intl.DateTimeFormat("ru-RU", {
  day: "numeric",
  month: "short",
  timeZone: "UTC",
});

const utcDayWithYear = new Intl.DateTimeFormat("ru-RU", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

const seconds = new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 3 });

export function formatUtcClock(date: Date) {
  return utcClock.format(date);
}

export function formatCompactTime(value: string, serverTime: string) {
  const date = new Date(value);
  const sameYear =
    date.getUTCFullYear() === new Date(serverTime).getUTCFullYear();
  const day = (sameYear ? utcDay : utcDayWithYear).format(date);
  return `${day} · ${formatUtcClock(date)}`;
}

export function formatTime(value: string | null) {
  return value === null ? "—" : utcTime.format(new Date(value));
}

export function formatDuration(milliseconds: number | null) {
  return milliseconds === null
    ? "—"
    : `${seconds.format(milliseconds / 1000)} с`;
}
