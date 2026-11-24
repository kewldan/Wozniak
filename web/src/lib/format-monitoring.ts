const utcTime = new Intl.DateTimeFormat("ru-RU", {
  dateStyle: "medium",
  timeStyle: "medium",
  timeZone: "UTC",
});

const seconds = new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 3 });

export function formatTime(value: string | null) {
  return value === null ? "—" : utcTime.format(new Date(value));
}

export function formatDuration(milliseconds: number | null) {
  return milliseconds === null ? "—" : `${seconds.format(milliseconds / 1000)} с`;
}
