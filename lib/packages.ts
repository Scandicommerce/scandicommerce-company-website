export interface IncludedCategory {
  category: string
  items: string[]
}

export interface ProcessStep {
  week: string
  title: string
  description: string
}

export interface Package {
  slug: string
  title: string
  subtitle: string
  price: string
  priceType: string
  timeline: string
  rating: number
  ratingValue: string
  reviewCount: number
  description: string
  bestFor: string[]
  included: string[]
  includedCategories?: IncludedCategory[]
  highlights: string[]
  moreDeliverablesCount?: number
  idealFor: string[]
  process?: string[]
  processSteps?: ProcessStep[]
  faq?: { question: string; answer: string }[]
  reviews?: { name: string; rating: number; comment: string; date?: string; title?: string }[]
  heroButtons?: {
    primaryButtonText?: string
    primaryButtonLink?: string
    secondaryButtonText?: string
    secondaryButtonLink?: string
  }
}

export const packages: Package[] = [
  {
    slug: 'foundation',
    title: 'Foundation',
    subtitle: 'Everything you need to launch your Shopify store',
    price: '89.000 kr',
    priceType: 'one-time payment',
    timeline: '6-8 weeks',
    rating: 4.9,
    ratingValue: '4.9',
    reviewCount: 23,
    description: 'Perfect for new brands ready to launch their first Shopify store. The Foundation package includes everything you need to go live with a professional, conversion-optimized store.',
    bestFor: [
      'New brands launching D2C',
      'Simple product catalogs',
      'Migrating from basic platforms',
    ],
    idealFor: [
      'New brands launching D2C',
      'Businesses with 10-50 products',
      'Migrating from Wix, Squarespace, or basic WooCommerce',
      'Brands ready to invest in growth',
    ],
    included: [
      'Kick-off workshop & brand discovery',
      'Competitor analysis',
      'User journey mapping',
      'Conversion strategy',
      'Custom Shopify theme setup',
      'Mobile-responsive design',
      'Up to 50 product imports',
      'Basic SEO optimization',
      'Payment & shipping setup',
      '2 weeks post-launch support',
    ],
    includedCategories: [
      {
        category: 'Strategy',
        items: [
          'Kick-off workshop & brand discovery',
          'Competitor analysis',
          'User journey mapping',
          'Conversion strategy',
        ],
      },
      {
        category: 'Build',
        items: [
          'Custom Shopify theme configuration',
          'Mobile-responsive design',
          'Up to 50 product imports with SEO',
          'Collection & navigation setup',
          'Custom homepage, product & collection templates',
          'Shopping cart & checkout optimization',
        ],
      },
      {
        category: 'Launch',
        items: [
          'Payment gateway integration',
          'Shipping & tax configuration',
          'Domain connection',
          'Google Analytics 4 setup',
          'Basic SEO optimization',
          'SSL & security setup',
        ],
      },
      {
        category: 'Support',
        items: [
          '2 weeks post-launch support',
          'Training documentation',
          'Email support',
        ],
      },
    ],
    highlights: [
      'Kick-off workshop & brand discovery',
      'Competitor analysis',
      'User journey mapping',
      'Conversion strategy',
    ],
    process: [
      'Discovery & Planning (Week 1)',
      'Design & Development (Weeks 2-5)',
      'Testing & Optimization (Week 6)',
      'Launch & Support (Weeks 7-8)',
    ],
    processSteps: [
      {
        week: 'Week 1-2',
        title: 'Discovery & Planning',
        description: 'Workshop, strategy, and design direction',
      },
      {
        week: 'Week 3-4',
        title: 'Design & Build',
        description: 'Theme setup, customization, and content',
      },
      {
        week: 'Week 5-6',
        title: 'Content & Testing',
        description: 'Product import, QA, and optimization',
      },
      {
        week: 'Week 7-8',
        title: 'Launch & Support',
        description: 'Go live and post-launch support',
      },
    ],
    faq: [
      {
        question: 'What if I have more than 50 products?',
        answer: 'We can accommodate larger catalogs with an additional fee of 100 kr per product. Or consider our Growth package which includes up to 200 products.',
      },
      {
        question: 'Can I use my own design?',
        answer: "Yes! If you have existing designs or brand guidelines, we'll adapt them to Shopify best practices.",
      },
      {
        question: "What's included in post-launch support?",
        answer: '2 weeks of email support for bug fixes, minor adjustments, and questions about managing your store.',
      },
    ],
    reviews: [
      {
        name: 'Maria Hansen',
        rating: 5,
        comment: 'ScandiCommerce delivered exactly what they promised, on time and on budget. Our store launched flawlessly.',
        title: 'Founder, Nordic Beauty Co.',
      },
      {
        name: 'Erik Johansson',
        rating: 5,
        comment: 'The team was professional, responsive, and really understood our brand. Highly recommend!',
        title: 'CEO, Scandinavian Design Co.',
      },
      {
        name: 'Anna Lindberg',
        rating: 5,
        comment: 'Smooth migration from our old platform. The store looks amazing and conversion rates improved immediately.',
        title: 'Marketing Director, Nordic Fashion',
      },
    ],
  },
  {
    slug: 'growth',
    title: 'Growth',
    subtitle: 'Scale your existing store',
    price: '149.000 kr',
    priceType: 'one-time payment',
    timeline: '8-10 weeks',
    rating: 5,
    ratingValue: '5',
    reviewCount: 15,
    description: 'Perfect for growing brands that need advanced customization and optimization.',
    bestFor: [
      'Growing brands',
      'Advanced customization needs',
      'Multiple sales channels',
    ],
    idealFor: [
      'Growing brands',
      'Businesses with 50-200 products',
      'Brands needing advanced features',
      'Multi-channel sellers',
    ],
    included: [
      'Everything in Foundation',
      'Custom feature development',
      'CRO optimization & testing',
      'Advanced integrations (Klaviyo, etc.)',
      'Performance optimization',
      '4 weeks post-launch support',
    ],
    includedCategories: [
      {
        category: 'Strategy',
        items: [
          'Everything in Foundation',
          'Advanced competitor analysis',
          'Conversion rate optimization audit',
          'Multi-channel strategy',
        ],
      },
      {
        category: 'Build',
        items: [
          'Custom feature development',
          'Advanced theme customization',
          'Multi-currency support',
          'Advanced filtering & search',
          'Custom product configurators',
          'Wishlist & favorites',
        ],
      },
      {
        category: 'Integrate',
        items: [
          'Klaviyo email marketing',
          'Advanced analytics setup',
          'Inventory management system',
          'Customer review platform',
          'Social media integrations',
          'CRM integration',
        ],
      },
      {
        category: 'Support',
        items: [
          '4 weeks post-launch support',
          'Performance optimization',
          'Priority email & chat support',
          'Monthly performance reports',
        ],
      },
    ],
    highlights: [
      'Everything in Foundation',
      'Custom feature development',
      'CRO optimization & testing',
      'Advanced integrations',
    ],
    processSteps: [
      {
        week: 'Week 1-2',
        title: 'Discovery & Planning',
        description: 'Advanced strategy, CRO audit, and custom feature planning',
      },
      {
        week: 'Week 3-5',
        title: 'Design & Build',
        description: 'Custom development, integrations, and advanced customization',
      },
      {
        week: 'Week 6-7',
        title: 'Content & Testing',
        description: 'Product import, performance optimization, and QA',
      },
      {
        week: 'Week 8-10',
        title: 'Launch & Support',
        description: 'Go live, optimization, and extended post-launch support',
      },
    ],
    faq: [
      {
        question: 'What if I have more than 200 products?',
        answer: 'We can handle larger catalogs with custom pricing. Contact us for a quote, or consider our Premium package which is designed for extensive product catalogs.',
      },
      {
        question: 'Can you integrate with my existing systems?',
        answer: 'Yes! The Growth package includes integrations with popular platforms like Klaviyo, CRM systems, and inventory management tools. We can discuss custom integrations during the discovery phase.',
      },
      {
        question: "What's included in the 4 weeks post-launch support?",
        answer: 'You get priority email and chat support for bug fixes, performance optimization, minor adjustments, and guidance on managing your advanced features. We also provide monthly performance reports.',
      },
    ],
    reviews: [
      {
        name: 'Lars Andersen',
        rating: 5,
        comment: 'The custom features and integrations transformed our store. Sales increased by 40% in the first quarter after launch.',
        title: 'Founder, Nordic Tech Solutions',
      },
      {
        name: 'Sofia Berg',
        rating: 5,
        comment: 'Excellent CRO work and the Klaviyo integration is seamless. The team really understands e-commerce growth.',
        title: 'E-commerce Director, Scandinavian Style',
      },
      {
        name: 'Thomas Nilsson',
        rating: 5,
        comment: 'Professional service from start to finish. The advanced customization options exceeded our expectations.',
        title: 'CEO, Nordic Home & Living',
      },
    ],
  },
  {
    slug: 'premium',
    title: 'Premium',
    subtitle: 'Complex e-commerce solutions',
    price: '249.000 kr',
    priceType: 'one-time payment',
    timeline: '10-14 weeks',
    rating: 4.9,
    ratingValue: '4.9',
    reviewCount: 8,
    description: 'For established brands with complex workflows and requirements.',
    bestFor: [
      'Established brands',
      'Complex workflows',
      'B2B + B2C needs',
    ],
    idealFor: [
      'Established brands',
      'Businesses with 200+ products',
      'B2B + B2C operations',
      'Complex integration needs',
    ],
    included: [
      'Everything in Growth',
      'Full theme customization',
      'B2B commerce features',
      'Custom app development',
      'Headless commerce options',
      '8 weeks post-launch support',
    ],
    includedCategories: [
      {
        category: 'Strategy',
        items: [
          'Everything in Growth',
          'B2B commerce strategy',
          'International expansion planning',
          'Custom workflow design',
        ],
      },
      {
        category: 'Build',
        items: [
          'Full theme customization',
          'B2B customer portals',
          'Custom app development',
          'Headless commerce setup',
          'Advanced product bundles',
          'Subscription commerce',
        ],
      },
      {
        category: 'Integrate',
        items: [
          'ERP system integration',
          'Advanced B2B pricing',
          'Custom API development',
          'Warehouse management',
          'Multi-location inventory',
          'Advanced automation',
        ],
      },
      {
        category: 'Support',
        items: [
          '8 weeks post-launch support',
          'Dedicated account manager',
          'Priority support channel',
          'Quarterly business reviews',
        ],
      },
    ],
    highlights: [
      'Everything in Growth',
      'Full theme customization',
      'B2B commerce features',
      'Custom app development',
    ],
    processSteps: [
      {
        week: 'Week 1-2',
        title: 'Discovery & Planning',
        description: 'B2B strategy, enterprise architecture, and custom workflow design',
      },
      {
        week: 'Week 3-6',
        title: 'Design & Build',
        description: 'Custom app development, B2B portals, and headless setup',
      },
      {
        week: 'Week 7-9',
        title: 'Content & Testing',
        description: 'Enterprise integrations, ERP setup, and comprehensive QA',
      },
      {
        week: 'Week 10-14',
        title: 'Launch & Support',
        description: 'Go live, enterprise support, and dedicated account management',
      },
    ],
    faq: [
      {
        question: 'Can you build custom Shopify apps?',
        answer: 'Yes! The Premium package includes custom app development for unique features that aren\'t available in the Shopify app store. We\'ll work with you to design and build exactly what you need.',
      },
      {
        question: 'What is headless commerce and do I need it?',
        answer: 'Headless commerce separates the frontend from the backend, giving you more flexibility. It\'s ideal for brands needing custom experiences across multiple channels. We\'ll discuss if it\'s right for your business during planning.',
      },
      {
        question: "What's included in the 8 weeks post-launch support?",
        answer: 'You get a dedicated account manager, priority support channel, quarterly business reviews, and ongoing optimization. We ensure your complex setup runs smoothly and continues to perform.',
      },
    ],
    reviews: [
      {
        name: 'Kristin Dahl',
        rating: 5,
        comment: 'The B2B portal and custom app development were game-changers. Our enterprise customers love the new experience.',
        title: 'VP of E-commerce, Nordic Enterprise Group',
      },
      {
        name: 'Magnus Larsson',
        rating: 5,
        comment: 'Headless commerce setup was complex but ScandiCommerce handled it perfectly. Our multi-channel strategy is now seamless.',
        title: 'CTO, Scandinavian Retail Corp',
      },
      {
        name: 'Ingrid Söderberg',
        rating: 5,
        comment: 'Outstanding work on our complex B2B + B2C setup. The dedicated account manager made all the difference.',
        title: 'Head of Digital, Nordic Fashion Group',
      },
    ],
  },
  {
    slug: 'enterprise',
    title: 'Enterprise',
    subtitle: 'For large-scale operations',
    price: 'Custom',
    priceType: 'one-time',
    timeline: '8-10 weeks',
    rating: 5,
    ratingValue: '5',
    reviewCount: 5,
    description: 'For large-scale operations requiring dedicated resources.',
    bestFor: [
      'Multi-store operations',
      'International expansion',
      'High-volume businesses',
    ],
    idealFor: [
      'Multi-store operations',
      'International expansion',
      'High-volume businesses',
      'Enterprise-level needs',
    ],
    included: [
      'Everything in Premium',
      'Dedicated project team',
      'Multi-store architecture',
      'Enterprise integrations',
      'White-glove migration',
      'Ongoing support retainer',
    ],
    includedCategories: [
      {
        category: 'Strategy',
        items: [
          'Everything in Premium',
          'Enterprise architecture planning',
          'Global expansion strategy',
          'Custom SLA agreements',
        ],
      },
      {
        category: 'Build',
        items: [
          'Multi-store architecture',
          'Custom enterprise features',
          'Advanced B2B portals',
          'Marketplace integrations',
          'Custom mobile apps',
          'Advanced personalization',
        ],
      },
      {
        category: 'Integrate',
        items: [
          'Enterprise ERP integration',
          'Custom middleware development',
          'Advanced security protocols',
          'SSO & enterprise auth',
          'Data warehouse integration',
          'BI & reporting tools',
        ],
      },
      {
        category: 'Support',
        items: [
          'Ongoing support retainer',
          'Dedicated project team',
          '24/7 priority support',
          'Monthly strategic reviews',
          'White-glove migration',
          'Continuous optimization',
        ],
      },
    ],
    highlights: [
      'Everything in Premium',
      'Dedicated project team',
      'Multi-store architecture',
      'Enterprise integrations',
    ],
    processSteps: [
      {
        week: 'Week 1-2',
        title: 'Discovery & Planning',
        description: 'Enterprise architecture, multi-store strategy, and custom SLA agreements',
      },
      {
        week: 'Week 3-5',
        title: 'Design & Build',
        description: 'Multi-store setup, custom enterprise features, and marketplace integrations',
      },
      {
        week: 'Week 6-7',
        title: 'Content & Testing',
        description: 'Enterprise integrations, security protocols, and comprehensive testing',
      },
      {
        week: 'Week 8-10',
        title: 'Launch & Support',
        description: 'White-glove launch, dedicated team support, and ongoing optimization',
      },
    ],
    faq: [
      {
        question: 'How does multi-store architecture work?',
        answer: 'We set up and manage multiple Shopify stores that can share inventory, customer data, and content. Perfect for international expansion, different brands, or B2B/B2C separation.',
      },
      {
        question: 'What does "dedicated project team" mean?',
        answer: 'You get a dedicated team of specialists assigned exclusively to your project - project manager, developers, designers, and QA. They work full-time on your store until launch and remain available for ongoing support.',
      },
      {
        question: "What's included in the ongoing support retainer?",
        answer: '24/7 priority support, monthly strategic reviews, continuous optimization, white-glove migration assistance, and dedicated team availability. We act as your long-term e-commerce partner.',
      },
    ],
    reviews: [
      {
        name: 'Henrik Jansson',
        rating: 5,
        comment: 'The multi-store architecture and dedicated team approach was exactly what we needed. ScandiCommerce is now our trusted e-commerce partner.',
        title: 'Global E-commerce Director, Nordic International',
      },
      {
        name: 'Emma Lindqvist',
        rating: 5,
        comment: 'White-glove service from day one. The team handled our complex international expansion flawlessly. Highly professional.',
        title: 'CEO, Scandinavian Luxury Brands',
      },
      {
        name: 'Anders Persson',
        rating: 5,
        comment: 'Enterprise-level expertise and support. The ongoing optimization has continuously improved our performance metrics.',
        title: 'VP of Operations, Nordic Retail Enterprise',
      },
    ],
  },
]

export function getPackageBySlug(slug: string): Package | undefined {
  return packages.find((pkg) => pkg.slug === slug)
}

