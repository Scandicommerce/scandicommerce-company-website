/** Strip tags and collapse whitespace before capping length (FAQ, descriptions). */
export function toPlainTextForSchema(value: string, maxLength: number): string {
  const t = value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  return t.slice(0, maxLength)
}
