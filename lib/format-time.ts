const SESSION_DATE_FORMAT = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

export function formatSessionDate(iso: string): string {
  return SESSION_DATE_FORMAT.format(new Date(iso));
}
