import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

/** Fallback if middleware didn't run: same domain-based default as middleware */
function getDefaultLocale(host: string): string {
  return host.includes('scandicommerce.no') ? 'no' : 'en'
}

export default async function RootPage() {
  const headersList = await headers()
  const host = headersList.get('host') || ''
  redirect(`/${getDefaultLocale(host)}`)
}
