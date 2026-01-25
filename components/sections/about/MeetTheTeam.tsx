'use client'

import Image from 'next/image'
import Link from 'next/link'

interface TeamMember {
  name?: string
  role?: string
  specialties?: string
  funFact?: string
  imageUrl?: string
}

interface MeetTheTeamData {
  title?: string
  subtitle?: string
  teamMembers?: TeamMember[]
  buttonText?: string
  buttonLink?: string
}

interface MeetTheTeamProps {
  meetTheTeam?: MeetTheTeamData
}

// Default team members
const defaultTeamMembers: TeamMember[] = [
  {
    name: 'Erik Johansen',
    role: 'Founder & Strategy',
    specialties: 'E-commerce strategy, CRO',
    funFact: 'Former retail buyer',
    imageUrl: '/images/about/team/erik.png',
  },
  {
    name: 'Maria Berg',
    role: 'Lead Developer',
    specialties: 'Shopify Plus, custom apps',
    funFact: 'Coffee enthusiast',
    imageUrl: '/images/about/team/maria.png',
  },
  {
    name: 'Lars Hansen',
    role: 'Design Lead',
    specialties: 'UI/UX, conversion design',
    funFact: 'Minimalist architect background',
    imageUrl: '/images/about/team/lars.png',
  },
  {
    name: 'Kristine Olsen',
    role: 'Project Manager',
    specialties: 'Client success, operations',
    funFact: 'Marathon runner',
    imageUrl: '/images/about/team/kristine.png',
  },
]

export default function MeetTheTeam({ meetTheTeam }: MeetTheTeamProps) {
  const title = meetTheTeam?.title || 'Meet the team'
  const subtitle = meetTheTeam?.subtitle || 'The people behind your Shopify success'
  const teamMembers = meetTheTeam?.teamMembers && meetTheTeam.teamMembers.length > 0 ? meetTheTeam.teamMembers : defaultTeamMembers
  const buttonText = meetTheTeam?.buttonText || 'View Full Team'
  const buttonLink = meetTheTeam?.buttonLink || '/team'

  return (
    <section className="bg-black py-16 lg:py-24">
      <div className="w-full">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            {title}
          </h2>
          <p className="text-lg lg:text-2xl text-white">
            {subtitle}
          </p>
        </div>

        {/* Team Members */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-12 lg:mb-16">
          {teamMembers.map((member, index) => (
            <div key={index} className="relative group overflow-hidden">
              {/* Portrait Image */}
              <div className="relative w-full h-[130vw] sm:h-[600px] md:h-[650px] lg:h-[500px] xl:h-[600px] 2xl:h-[700px] bg-gray-200">
                <Image
                  src={member.imageUrl || '/images/about/team/placeholder.png'}
                  alt={member.name || 'Team member'}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              </div>

              {/* Overlay with Info */}
              <div className="absolute bottom-0 left-0 right-0 bg-[#11111180] backdrop-blur-[10px] p-4 lg:p-6 flex flex-col items-center justify-between">
                <h3 className="text-xl lg:text-2xl font-bold text-white mb-2">
                  {member.name}
                </h3>
                <p className="text-[10px] lg:text-[11px] xl:text-sm text-white mb-2">
                  {member.role}
                </p>
                <p className="text-[10px] lg:text-[11px] xl:text-sm text-white/90 mb-2">
                  Specialties: {member.specialties}
                </p>
                <p className="text-[10px] lg:text-[11px] xl:text-sm text-white/80">
                  {member.funFact}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <Link
            href={buttonLink}
            className="inline-block bg-white text-gray-900 px-8 py-3 lg:px-[110px] lg:py-4 font-semibold hover:bg-gray-100 transition-colors"
          >
            {buttonText}
          </Link>
        </div>
      </div>
    </section>
  )
}
