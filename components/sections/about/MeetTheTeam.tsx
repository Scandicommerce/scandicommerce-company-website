import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'
import { ui } from '@/components/integrations/labels'
import type { Image as SanityImage } from 'sanity'

interface TeamMember {
  name?: string
  role?: string
  specialties?: string
  funFact?: string
  imageUrl?: string
  image?: SanityImage
}

interface MeetTheTeamData {
  title?: string
  subtitle?: string
  teamMembers?: TeamMember[]
}

/** Team on an ink band: portrait cards with role, specialties as chips and the fun fact in mono. */
export default function MeetTheTeam({ meetTheTeam, lang = 'no' }: { meetTheTeam?: MeetTheTeamData; lang?: string }) {
  const members = (meetTheTeam?.teamMembers ?? []).filter((m) => m?.name)
  if (members.length === 0) return null
  return (
    <section id="team" className="scroll-mt-24 bg-sc-ink-900 py-16 text-white lg:py-20">
      <div className={`${ui.container} flex flex-col gap-10`}>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
          <div className="flex flex-col gap-2.5">
            <div className="text-xs font-semibold uppercase tracking-[0.12em] text-sc-cyan-300">{lang === 'no' ? 'Teamet' : 'The team'}</div>
            {meetTheTeam?.title && <h2 className="m-0 text-[32px] font-bold leading-[1.25] tracking-[-0.02em] lg:text-[44px]">{meetTheTeam.title}</h2>}
          </div>
          {meetTheTeam?.subtitle && <p className="m-0 max-w-[520px] text-base leading-relaxed text-sc-ink-200 lg:text-lg">{meetTheTeam.subtitle}</p>}
        </div>
        <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {members.map((m, i) => {
            const src = m.image && (m.image as { asset?: unknown }).asset ? urlFor(m.image).width(900).height(1100).fit('crop').url() : m.imageUrl
            const specialties = (m.specialties ?? '').split(/,\s*/).filter(Boolean)
            return (
              <li key={i} className="flex flex-col overflow-hidden rounded-lg border border-sc-ink-700 bg-sc-ink-800">
                <div className="relative aspect-[4/5] bg-sc-ink-700">
                  {src && <Image src={src} alt={m.name ?? ''} fill className="object-cover object-top" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 350px" />}
                </div>
                <div className="flex flex-col gap-3 p-5">
                  <div>
                    <h3 className="m-0 text-[20px] font-bold leading-tight">{m.name}</h3>
                    {m.role && <div className="mt-1 text-[14px] text-sc-cyan-300">{m.role}</div>}
                  </div>
                  {specialties.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {specialties.map((s) => <span key={s} className="inline-flex items-center rounded-full border border-sc-ink-600 px-2.5 py-1 text-xs text-sc-ink-200">{s}</span>)}
                    </div>
                  )}
                  {m.funFact && <div className="font-mono text-[13px] text-sc-ink-300">{m.funFact}</div>}
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
