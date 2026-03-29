function jsonLdReplacer(_key: string, value: unknown): unknown {
  if (typeof value === 'number' && !Number.isFinite(value)) return undefined
  return value
}

/** Serialize for `<script type="application/ld+json">`; strip non-finite numbers, escape `<` in output. */
export function safeJsonLdStringify(data: unknown): string {
  return JSON.stringify(data, jsonLdReplacer).replace(/</g, '\\u003c')
}
