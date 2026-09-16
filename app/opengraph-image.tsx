import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { headers } from 'next/headers'
import { siteForHost } from '@/lib/site-config'

/**
 * Branded 1200×630 fallback social image (TECHNICAL-SEO-SPEC §12.3) served at
 * /opengraph-image on both origins. Pages with a CMS og:image override it.
 */
export const runtime = 'nodejs'
export const alt = 'scandicommerce – Shopify Plus agency'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OpenGraphImage() {
  const h = await headers()
  const site = siteForHost(h.get('x-forwarded-host') ?? h.get('host'))
  const isNo = site.key === 'no'
  const markPath = path.join(process.cwd(), 'public', 'images', 'brand', 'scandicommerce-mark-512.png')
  let markSrc: string | null = null
  try {
    const buf = await readFile(markPath)
    markSrc = `data:image/png;base64,${buf.toString('base64')}`
  } catch {
    markSrc = null
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
          background: 'linear-gradient(135deg, #0b1220 0%, #10233a 100%)',
          color: '#ffffff',
          fontFamily: 'Helvetica, Arial, sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          {markSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={markSrc} width={96} height={96} alt="" />
          ) : null}
          <div style={{ fontSize: 44, fontWeight: 700, letterSpacing: -1 }}>scandicommerce</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ fontSize: 60, fontWeight: 700, lineHeight: 1.1, letterSpacing: -2, maxWidth: 980 }}>
            {isNo ? 'Shopify Plus-byrå i Oslo' : 'Shopify Plus partner agency in Oslo, Norway'}
          </div>
          <div style={{ fontSize: 28, color: '#8fe9f0', maxWidth: 980 }}>
            {isNo
              ? 'Fastpris. Integrasjoner mot Vipps, 24SevenOffice, Tripletex og Bring.'
              : 'Headed and headless Shopify builds, migrations and Nordic integrations.'}
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 24, color: '#9aa7b4' }}>
          <span>{site.host}</span>
          <span>Drammensveien 167, Oslo</span>
        </div>
      </div>
    ),
    { ...size }
  )
}
