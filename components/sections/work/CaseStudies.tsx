'use client'

import CaseStudy from './CaseStudy'

interface Result {
  value?: string
  label?: string
}

interface Study {
  title?: string
  category?: string
  tags?: string[]
  challenge?: string
  solution?: string
  results?: Result[]
  imageUrl?: string
  imageAlt?: string
  link?: string
}

interface CaseStudiesData {
  studies?: Study[]
}

interface CaseStudiesProps {
  caseStudies?: CaseStudiesData
}

// Default case studies
const defaultStudies: Study[] = [
  {
    title: 'Nordic Fashion Co.',
    category: 'Fashion & Apparel',
    tags: ['Migration', 'Growth Package'],
    challenge: 'Slow WooCommerce site with poor mobile experience',
    solution: 'Migrated to Shopify with custom theme and CRO optimization',
    results: [
      { value: '+156%', label: 'Conversion rate' },
      { value: '-68%', label: 'Page load time' },
      { value: '+2.1M kr', label: 'Additional revenue' },
    ],
    imageUrl: '/images/work/caseStudies/nordic.png',
    imageAlt: 'Nordic Fashion Co. store interior',
  },
  {
    title: 'Oslo Electronics',
    category: 'Consumer Electronics',
    tags: ['Premium Package', 'B2B'],
    challenge: 'Complex product catalog with poor search and filtering',
    solution: 'Custom Shopify Plus build with advanced search and B2B portal',
    results: [
      { value: '+89%', label: 'Search usage' },
      { value: '3x', label: 'AOV increase' },
      { value: '+127%', label: 'B2B orders' },
    ],
    imageUrl: '/images/work/caseStudies/oslo.jpg',
    imageAlt: 'Oslo Electronics store',
  },
  {
    title: 'Bergen Home Goods',
    category: 'Home & Living',
    tags: ['Foundation Package', 'Launch'],
    challenge: 'Launching D2C brand from scratch',
    solution: 'Foundation package with brand-focused design and SEO',
    results: [
      { value: '€450k', label: 'Year 1 revenue' },
      { value: '2.8%', label: 'Conversion rate' },
      { value: '12k', label: 'Email subscribers' },
    ],
    imageUrl: '/images/work/caseStudies/bergen.png',
    imageAlt: 'Bergen Home Goods showroom',
  },
]

export default function CaseStudies({ caseStudies }: CaseStudiesProps) {
  const studies = caseStudies?.studies && caseStudies.studies.length > 0
    ? caseStudies.studies
    : defaultStudies

  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="section_container mx-auto page-padding-x">
        {studies.map((study, index) => (
          <CaseStudy
            key={index}
            title={study.title || ''}
            category={study.category || ''}
            tags={study.tags || []}
            challenge={study.challenge || ''}
            solution={study.solution || ''}
            results={study.results?.map(r => ({
              value: r.value || '',
              label: r.label || ''
            })) || []}
            image={study.imageUrl || ''}
            imageAlt={study.imageAlt || ''}
            imagePosition={index % 2 === 0 ? 'left' : 'right'}
            link={study.link}
          />
        ))}
      </div>
    </section>
  )
}
