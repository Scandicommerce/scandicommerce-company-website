/** ISO 8601 only; omit invalid / empty input. */
export function toSchemaDateTime(value: string | null | undefined): string | undefined {
  if (value == null || !String(value).trim()) return undefined
  const ms = Date.parse(String(value))
  if (!Number.isFinite(ms)) return undefined
  return new Date(ms).toISOString()
}
