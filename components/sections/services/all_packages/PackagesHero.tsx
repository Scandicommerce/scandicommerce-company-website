import ServiceHero from '@/components/sections/services/ServiceHero'

interface HeroData {
  heroTitle?: { text?: string; highlight?: string }
  heroDescription?: string
  stats?: Array<{ value?: string; label?: string }>
}

/**
 * Hero for the all-packages page, on the same ServiceHero the other Tjenester
 * pages use. Replaces the cyan liquid-blob hero. Stats from Sanity become the
 * proof-point row under the copy.
 */
export default function PackagesHero({ hero, eyebrow = 'Pakker' }: { hero?: HeroData; eyebrow?: string }) {
  const title = hero?.heroTitle?.text ?? ''
  const highlights = (hero?.stats ?? [])
    .filter((s) => s?.value || s?.label)
    .map((s) => [s.value, s.label].filter(Boolean).join(' '))
  return <ServiceHero eyebrow={eyebrow} title={title} highlight={hero?.heroTitle?.highlight} description={hero?.heroDescription} highlights={highlights} />
}
