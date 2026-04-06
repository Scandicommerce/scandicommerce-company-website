import Hero from '@/components/layout/Hero'
import Platforms from '@/components/sections/services/migrate/Platforms'
import RisksAndProtection from '@/components/sections/services/migrate/RisksAndProtection'
import MigrationProcess from '@/components/sections/services/migrate/MigrationProcess'
import RealMigrationResults from '@/components/sections/services/migrate/RealMigrationResults'
import MigrationCTA from '@/components/sections/services/migrate/MigrationCTA'
import { Button } from '@/components/ui'
import type { SanitySectionItem } from '@/lib/sanity/normalizeDocumentSections'

export function MigratePageSectionRenderer({ sections }: { sections: SanitySectionItem[] }) {
  return (
    <>
      {sections.map((section) => {
        const { _type, _key, ...rest } = section
        switch (_type) {
          case 'migratePageHeroSection': {
            const hero = rest as {
              heroTitle?: { text?: string; highlight?: string }
              heroDescription?: string
              heroButtons?: Array<{ text: string; link: string; variant?: string }>
            }
            return (
              <Hero key={_key} hero={hero}>
                <div className="grid sm:grid-cols-2 grid-cols-1 lg:gap-4 gap-2">
                  {hero.heroButtons?.map((button, index) => (
                    <Button key={index} type={button.variant === 'primary' ? 'primary' : 'default'} href={button.link}>
                      {button.text}
                    </Button>
                  ))}
                </div>
              </Hero>
            )
          }
          case 'migratePagePlatformsSection':
            return <Platforms key={_key} platforms={rest as Parameters<typeof Platforms>[0]['platforms']} />
          case 'migratePageRisksProtectionSection':
            return <RisksAndProtection key={_key} risksProtection={rest as Parameters<typeof RisksAndProtection>[0]['risksProtection']} />
          case 'migratePageProcessSection':
            return <MigrationProcess key={_key} process={rest as Parameters<typeof MigrationProcess>[0]['process']} />
          case 'migratePageResultsSection':
            return <RealMigrationResults key={_key} results={rest as Parameters<typeof RealMigrationResults>[0]['results']} />
          case 'migratePageCtaSection':
            return <MigrationCTA key={_key} cta={rest as Parameters<typeof MigrationCTA>[0]['cta']} />
          default:
            return null
        }
      })}
    </>
  )
}
