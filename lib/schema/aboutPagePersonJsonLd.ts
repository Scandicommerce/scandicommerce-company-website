import type { Image as SanityImage } from 'sanity'
import { urlFor } from '@/sanity/lib/image'
import { buildPersonSchemasForTeam } from './person'
import type { TeamMemberForSchema } from './person'
import type { JsonLdObject } from './types'

/** Person JSON-LD when Sanity has no team rows yet. */
export const FALLBACK_TEAM_FOR_PERSON_SCHEMA: TeamMemberForSchema[] = [
  {
    name: 'Christian Fredrik Konow',
    role: 'Founder & CEO',
    specialties: 'E-commerce strategy, Business Strategy, Partner management',
  },
  {
    name: 'Chris Willy Jensen',
    role: 'Co-founder & CTO',
    specialties:
      'Performance Optimization, CRO, Technical SEO, Solution Architecture, Headless Commerce',
  },
  {
    name: 'Tim Teigen',
    role: 'Ecommerce Advisor',
    specialties: 'Shopify, CRO',
  },
  {
    name: 'Adrian Fjeld Hansen',
    role: 'Lead SEO and Shopify',
    specialties: 'Shopify, SEO, WordPress',
  },
]

export interface MeetTheTeamForPersonSchema {
  teamMembers?: {
    name?: string
    role?: string
    specialties?: string
    funFact?: string
    imageUrl?: string
    image?: SanityImage
  }[]
}

export function teamMembersForPersonSchema(
  meetTheTeam: MeetTheTeamForPersonSchema | null | undefined
): TeamMemberForSchema[] {
  const cms =
    meetTheTeam?.teamMembers?.filter((m) => m.name?.trim()) ?? []
  if (cms.length > 0) {
    return cms.map((member) => ({
      name: member.name,
      role: member.role,
      specialties: member.specialties,
      imageUrl: member.image
        ? urlFor(member.image as SanityImage).width(800).url()
        : member.imageUrl,
    }))
  }
  return FALLBACK_TEAM_FOR_PERSON_SCHEMA
}

export function buildAboutPagePersonJsonLd(
  meetTheTeam: MeetTheTeamForPersonSchema | null | undefined,
  options: { origin: string; personListingPageUrl: string }
): JsonLdObject[] {
  const team = teamMembersForPersonSchema(meetTheTeam)
  return buildPersonSchemasForTeam(team, options)
}
