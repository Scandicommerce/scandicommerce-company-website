export interface TableOfContentsItem {
  id: string
  title: string
  number: number
}

export interface AppRecommendation {
  name: string
  category: string
  description: string
  features: string[]
}

export interface ArticleSection {
  id: string
  title: string
  content: string
  proTip?: {
    title: string
    content: string
  }
  apps?: AppRecommendation[]
}

export interface Author {
  name: string
  role: string
  image: string
  slug: string
}

export interface RelatedArticle {
  slug: string
  title: string
  category: string
  readTime: string
  image: string
}

export interface Article {
  id: number
  slug: string
  title: string
  titleHighlight: string
  description: string
  category: string
  date: string
  readTime: string
  image: string
  featuredImage: string
  author: Author
  tableOfContents: TableOfContentsItem[]
  introduction: string
  sections: ArticleSection[]
  relatedArticles: RelatedArticle[]
}

export const articles: Article[] = [
  {
    id: 1,
    slug: '10-essential-shopify-apps-norwegian-ecommerce-2025',
    title: '10 Essential Shopify Apps for Norwegian E-commerce in 2025',
    titleHighlight: '10 Essential',
    description: 'A comprehensive guide to the must-have Shopify apps for Norwegian businesses looking to scale.',
    category: 'Shopify Tips',
    date: 'Jan 15, 2025',
    readTime: '8 min read',
    image: '/images/resources/articles/1.jpg',
    featuredImage: '/images/resources/featured_article/banner.png',
    author: {
      name: 'Magnus Andersen',
      role: 'Lead Shopify Consultant at ScandiCommerce with 8+ years helping Norwegian brands scale their e-commerce operations.',
      image: '/images/about/team/lars.png',
      slug: 'magnus-andersen',
    },
    tableOfContents: [
      { id: 'why-apps-matter', title: 'Why the Right Apps Matter', number: 1 },
      { id: 'customer-service', title: 'Customer Service & Support', number: 2 },
      { id: 'marketing-conversion', title: 'Marketing & Conversion', number: 3 },
      { id: 'inventory-operations', title: 'Inventory & Operations', number: 4 },
      { id: 'analytics-insights', title: 'Analytics & Insights', number: 5 },
      { id: 'implementation-tips', title: 'Implementation Tips', number: 6 },
    ],
    introduction: "Choosing the right apps for your Shopify store can make the difference between struggling to grow and scaling effortlessly. In this comprehensive guide, we'll walk through the 10 essential apps that every Norwegian e-commerce business should consider in 2025.",
    sections: [
      {
        id: 'why-apps-matter',
        title: 'Why the Right Apps Matter',
        content: "The Shopify App Store contains over 8,000 apps, but most of them won't move the needle for your business. The key is finding apps that solve specific problems in your customer journey while maintaining a clean, fast storefront.\n\nWe've tested hundreds of apps with our Norwegian clients and identified the ones that consistently deliver ROI. These apps handle everything from customer service to inventory management, helping you focus on growth instead of operations.",
        proTip: {
          title: 'Pro Tip',
          content: "Start with 3-5 essential apps and add more only when you identify specific gaps in your operations. Too many apps can slow down your store and complicate your workflow.",
        },
      },
      {
        id: 'customer-service',
        title: 'Customer Service & Support',
        content: "Norwegian customers expect fast, helpful support. These apps help you deliver exceptional service without hiring a large support team.",
        apps: [
          {
            name: 'Gorgias',
            category: 'Customer Support',
            description: 'All-in-one helpdesk that centralizes customer conversations from email, chat, social media, and phone into one platform with deep Shopify integration.',
            features: [
              'Automated responses for common questions',
              'Order management directly from support tickets',
              'Revenue tracking per support interaction',
            ],
          },
        ],
      },
      {
        id: 'marketing-conversion',
        title: 'Marketing & Conversion',
        content: "Driving traffic is only half the battle. These apps help convert visitors into customers and increase your average order value.",
      },
      {
        id: 'inventory-operations',
        title: 'Inventory & Operations',
        content: "Efficient inventory management is crucial for Norwegian e-commerce, especially when dealing with multiple warehouses or dropshipping suppliers.",
      },
      {
        id: 'analytics-insights',
        title: 'Analytics & Insights',
        content: "Data-driven decisions are key to scaling your Shopify store. These analytics tools give you the insights you need.",
      },
      {
        id: 'implementation-tips',
        title: 'Implementation Tips',
        content: "Before installing any new app, consider these best practices to ensure smooth integration and optimal performance.",
      },
    ],
    relatedArticles: [
      {
        slug: 'shopify-pos-vs-traditional-retail-systems',
        title: 'Shopify POS Setup Guide',
        category: 'POS',
        readTime: '6 min read',
        image: '/images/resources/articles/2.png',
      },
      {
        slug: 'migrated-50000-products-magento-shopify',
        title: 'Migration Checklist 2025',
        category: 'Migration',
        readTime: '10 min read',
        image: '/images/resources/articles/1.jpg',
      },
      {
        slug: 'ai-powered-product-recommendations',
        title: 'AI Product Recommendations',
        category: 'AI',
        readTime: '8 min read',
        image: '/images/resources/articles/3.jpg',
      },
    ],
  },
  {
    id: 2,
    slug: 'migrated-50000-products-magento-shopify',
    title: 'How We Migrated 50,000 Products from Magento to Shopify in 2 Weeks',
    titleHighlight: '50,000 Products',
    description: 'A detailed case study of our largest migration project and the lessons we learned.',
    category: 'Migration',
    date: 'Jan 15, 2025',
    readTime: '12 min read',
    image: '/images/resources/articles/1.jpg',
    featuredImage: '/images/resources/featured_article/banner.png',
    author: {
      name: 'Magnus Andersen',
      role: 'Lead Shopify Consultant at ScandiCommerce with 8+ years helping Norwegian brands scale their e-commerce operations.',
      image: '/images/about/team/lars.png',
      slug: 'magnus-andersen',
    },
    tableOfContents: [
      { id: 'project-overview', title: 'Project Overview', number: 1 },
      { id: 'challenges', title: 'Key Challenges', number: 2 },
      { id: 'solution', title: 'Our Solution', number: 3 },
      { id: 'results', title: 'Results', number: 4 },
      { id: 'lessons-learned', title: 'Lessons Learned', number: 5 },
      { id: 'tips', title: 'Tips for Your Migration', number: 6 },
    ],
    introduction: "When a major Norwegian retailer approached us with the challenge of migrating 50,000 products from Magento to Shopify in just two weeks, we knew it would be our most ambitious project yet.",
    sections: [
      {
        id: 'project-overview',
        title: 'Project Overview',
        content: "Our client, a leading Norwegian fashion retailer, was experiencing performance issues with their aging Magento 1 installation. With Magento 1 reaching end of life, they needed to migrate quickly while maintaining their holiday shopping season.",
      },
      {
        id: 'challenges',
        title: 'Key Challenges',
        content: "The migration presented several unique challenges that required creative solutions.",
      },
      {
        id: 'solution',
        title: 'Our Solution',
        content: "We developed a custom migration pipeline that could handle the volume while ensuring data integrity.",
      },
      {
        id: 'results',
        title: 'Results',
        content: "The migration was completed on time with zero data loss and minimal downtime.",
      },
      {
        id: 'lessons-learned',
        title: 'Lessons Learned',
        content: "Every migration project teaches us something new. Here are the key takeaways.",
      },
      {
        id: 'tips',
        title: 'Tips for Your Migration',
        content: "If you're planning a migration, keep these best practices in mind.",
      },
    ],
    relatedArticles: [
      {
        slug: 'shopify-pos-vs-traditional-retail-systems',
        title: 'Shopify POS Setup Guide',
        category: 'POS',
        readTime: '6 min read',
        image: '/images/resources/articles/2.png',
      },
      {
        slug: '10-essential-shopify-apps-norwegian-ecommerce-2025',
        title: '10 Essential Shopify Apps',
        category: 'Shopify Tips',
        readTime: '8 min read',
        image: '/images/resources/articles/1.jpg',
      },
      {
        slug: 'ai-powered-product-recommendations',
        title: 'AI Product Recommendations',
        category: 'AI',
        readTime: '8 min read',
        image: '/images/resources/articles/3.jpg',
      },
    ],
  },
  {
    id: 3,
    slug: 'shopify-pos-vs-traditional-retail-systems',
    title: 'Shopify POS vs Traditional Retail Systems: Complete Comparison',
    titleHighlight: 'Complete Comparison',
    description: 'Everything you need to know about choosing the right POS system for your retail business.',
    category: 'POS',
    date: 'Jan 10, 2025',
    readTime: '10 min read',
    image: '/images/resources/articles/2.png',
    featuredImage: '/images/resources/articles/2.png',
    author: {
      name: 'Magnus Andersen',
      role: 'Lead Shopify Consultant at ScandiCommerce with 8+ years helping Norwegian brands scale their e-commerce operations.',
      image: '/images/about/team/lars.png',
      slug: 'magnus-andersen',
    },
    tableOfContents: [
      { id: 'introduction', title: 'Introduction', number: 1 },
      { id: 'shopify-pos-overview', title: 'Shopify POS Overview', number: 2 },
      { id: 'traditional-systems', title: 'Traditional Systems', number: 3 },
      { id: 'comparison', title: 'Feature Comparison', number: 4 },
      { id: 'pricing', title: 'Pricing Analysis', number: 5 },
      { id: 'recommendation', title: 'Our Recommendation', number: 6 },
    ],
    introduction: "Choosing the right point-of-sale system is one of the most important decisions for any retail business. In this guide, we compare Shopify POS with traditional retail systems.",
    sections: [
      {
        id: 'introduction',
        title: 'Introduction',
        content: "The retail landscape has evolved dramatically, and your POS system needs to keep up.",
      },
      {
        id: 'shopify-pos-overview',
        title: 'Shopify POS Overview',
        content: "Shopify POS is a unified commerce solution that connects your online and offline sales channels.",
      },
      {
        id: 'traditional-systems',
        title: 'Traditional Systems',
        content: "Traditional POS systems have been the backbone of retail for decades.",
      },
      {
        id: 'comparison',
        title: 'Feature Comparison',
        content: "Let's compare the key features of both systems side by side.",
      },
      {
        id: 'pricing',
        title: 'Pricing Analysis',
        content: "Understanding the total cost of ownership is crucial for making the right decision.",
      },
      {
        id: 'recommendation',
        title: 'Our Recommendation',
        content: "Based on our experience with Norwegian retailers, here's our recommendation.",
      },
    ],
    relatedArticles: [
      {
        slug: '10-essential-shopify-apps-norwegian-ecommerce-2025',
        title: '10 Essential Shopify Apps',
        category: 'Shopify Tips',
        readTime: '8 min read',
        image: '/images/resources/articles/1.jpg',
      },
      {
        slug: 'migrated-50000-products-magento-shopify',
        title: 'Magento to Shopify Migration',
        category: 'Migration',
        readTime: '12 min read',
        image: '/images/resources/articles/4.jpg',
      },
      {
        slug: 'ai-powered-product-recommendations',
        title: 'AI Product Recommendations',
        category: 'AI',
        readTime: '8 min read',
        image: '/images/resources/articles/3.jpg',
      },
    ],
  },
  {
    id: 4,
    slug: 'ai-powered-product-recommendations',
    title: 'AI-Powered Product Recommendations: Increase AOV by 40%',
    titleHighlight: 'Increase AOV by 40%',
    description: 'Learn how to implement AI-driven product recommendations and boost your average order value.',
    category: 'AI & Automation',
    date: 'Jan 8, 2025',
    readTime: '6 min read',
    image: '/images/resources/articles/3.jpg',
    featuredImage: '/images/resources/articles/3.jpg',
    author: {
      name: 'Magnus Andersen',
      role: 'Lead Shopify Consultant at ScandiCommerce with 8+ years helping Norwegian brands scale their e-commerce operations.',
      image: '/images/about/team/lars.png',
      slug: 'magnus-andersen',
    },
    tableOfContents: [
      { id: 'what-is-ai-recommendations', title: 'What are AI Recommendations?', number: 1 },
      { id: 'benefits', title: 'Key Benefits', number: 2 },
      { id: 'implementation', title: 'Implementation Guide', number: 3 },
      { id: 'best-practices', title: 'Best Practices', number: 4 },
      { id: 'case-study', title: 'Case Study', number: 5 },
      { id: 'getting-started', title: 'Getting Started', number: 6 },
    ],
    introduction: "AI-powered product recommendations have revolutionized e-commerce personalization. Learn how to leverage this technology to significantly increase your average order value.",
    sections: [
      {
        id: 'what-is-ai-recommendations',
        title: 'What are AI Recommendations?',
        content: "AI-powered product recommendations use machine learning algorithms to suggest relevant products to customers based on their behavior and preferences.",
      },
      {
        id: 'benefits',
        title: 'Key Benefits',
        content: "Implementing AI recommendations can transform your e-commerce performance.",
      },
      {
        id: 'implementation',
        title: 'Implementation Guide',
        content: "Here's how to implement AI recommendations in your Shopify store.",
      },
      {
        id: 'best-practices',
        title: 'Best Practices',
        content: "Follow these best practices to maximize the effectiveness of your recommendations.",
      },
      {
        id: 'case-study',
        title: 'Case Study',
        content: "See how a Norwegian fashion brand increased their AOV by 40% with AI recommendations.",
      },
      {
        id: 'getting-started',
        title: 'Getting Started',
        content: "Ready to implement AI recommendations? Here's how to get started.",
      },
    ],
    relatedArticles: [
      {
        slug: 'shopify-pos-vs-traditional-retail-systems',
        title: 'Shopify POS Setup Guide',
        category: 'POS',
        readTime: '10 min read',
        image: '/images/resources/articles/2.png',
      },
      {
        slug: 'migrated-50000-products-magento-shopify',
        title: 'Magento to Shopify Migration',
        category: 'Migration',
        readTime: '12 min read',
        image: '/images/resources/articles/4.jpg',
      },
      {
        slug: '10-essential-shopify-apps-norwegian-ecommerce-2025',
        title: '10 Essential Shopify Apps',
        category: 'Shopify Tips',
        readTime: '8 min read',
        image: '/images/resources/articles/1.jpg',
      },
    ],
  },
  {
    id: 5,
    slug: 'zero-to-1m-nok-fashion-brand-shopify',
    title: 'From Zero to 1M NOK: Building a Fashion Brand on Shopify',
    titleHighlight: 'Zero to 1M NOK',
    description: 'A complete case study showing how we helped a Norwegian fashion brand achieve their first million.',
    category: 'Case Studies',
    date: 'Jan 5, 2025',
    readTime: '15 min read',
    image: '/images/resources/articles/4.jpg',
    featuredImage: '/images/resources/articles/4.jpg',
    author: {
      name: 'Magnus Andersen',
      role: 'Lead Shopify Consultant at ScandiCommerce with 8+ years helping Norwegian brands scale their e-commerce operations.',
      image: '/images/about/team/lars.png',
      slug: 'magnus-andersen',
    },
    tableOfContents: [
      { id: 'the-challenge', title: 'The Challenge', number: 1 },
      { id: 'strategy', title: 'Our Strategy', number: 2 },
      { id: 'execution', title: 'Execution', number: 3 },
      { id: 'results', title: 'Results', number: 4 },
      { id: 'key-learnings', title: 'Key Learnings', number: 5 },
      { id: 'next-steps', title: 'Next Steps', number: 6 },
    ],
    introduction: "This is the story of how we helped a Norwegian fashion startup go from zero to 1 million NOK in revenue within their first year on Shopify.",
    sections: [
      {
        id: 'the-challenge',
        title: 'The Challenge',
        content: "Our client came to us with a vision but limited e-commerce experience.",
      },
      {
        id: 'strategy',
        title: 'Our Strategy',
        content: "We developed a comprehensive go-to-market strategy tailored to the Norwegian market.",
      },
      {
        id: 'execution',
        title: 'Execution',
        content: "Here's how we brought the strategy to life.",
      },
      {
        id: 'results',
        title: 'Results',
        content: "The results exceeded all expectations.",
      },
      {
        id: 'key-learnings',
        title: 'Key Learnings',
        content: "Every success story has valuable lessons to share.",
      },
      {
        id: 'next-steps',
        title: 'Next Steps',
        content: "The journey doesn't end at 1M NOK.",
      },
    ],
    relatedArticles: [
      {
        slug: 'shopify-pos-vs-traditional-retail-systems',
        title: 'Shopify POS Comparison',
        category: 'POS',
        readTime: '10 min read',
        image: '/images/resources/articles/2.png',
      },
      {
        slug: 'migrated-50000-products-magento-shopify',
        title: 'Magento to Shopify Migration',
        category: 'Migration',
        readTime: '12 min read',
        image: '/images/resources/articles/1.jpg',
      },
      {
        slug: 'ai-powered-product-recommendations',
        title: 'AI Product Recommendations',
        category: 'AI',
        readTime: '6 min read',
        image: '/images/resources/articles/3.jpg',
      },
    ],
  },
  {
    id: 6,
    slug: 'shopify-markets-nordic-ecommerce-guide',
    title: 'Complete Guide to Shopify Markets for Nordic E-commerce',
    titleHighlight: 'Complete Guide',
    description: 'Master multi-market selling with Shopify Markets and expand across the Nordic region.',
    category: 'Shopify Tips',
    date: 'Jan 3, 2025',
    readTime: '9 min read',
    image: '/images/resources/articles/5.jpg',
    featuredImage: '/images/resources/articles/5.jpg',
    author: {
      name: 'Magnus Andersen',
      role: 'Lead Shopify Consultant at ScandiCommerce with 8+ years helping Norwegian brands scale their e-commerce operations.',
      image: '/images/about/team/lars.png',
      slug: 'magnus-andersen',
    },
    tableOfContents: [
      { id: 'what-is-shopify-markets', title: 'What is Shopify Markets?', number: 1 },
      { id: 'nordic-expansion', title: 'Nordic Expansion Strategy', number: 2 },
      { id: 'setup-guide', title: 'Setup Guide', number: 3 },
      { id: 'localization', title: 'Localization Tips', number: 4 },
      { id: 'pricing-strategy', title: 'Pricing Strategy', number: 5 },
      { id: 'success-metrics', title: 'Success Metrics', number: 6 },
    ],
    introduction: "Shopify Markets makes it easier than ever to sell across borders. Learn how to leverage this feature to expand your Norwegian business across the Nordic region.",
    sections: [
      {
        id: 'what-is-shopify-markets',
        title: 'What is Shopify Markets?',
        content: "Shopify Markets is a cross-border management tool that helps you sell internationally from a single store.",
      },
      {
        id: 'nordic-expansion',
        title: 'Nordic Expansion Strategy',
        content: "The Nordic region offers significant opportunities for Norwegian e-commerce businesses.",
      },
      {
        id: 'setup-guide',
        title: 'Setup Guide',
        content: "Follow these steps to configure Shopify Markets for Nordic expansion.",
      },
      {
        id: 'localization',
        title: 'Localization Tips',
        content: "Successful international selling requires more than just currency conversion.",
      },
      {
        id: 'pricing-strategy',
        title: 'Pricing Strategy',
        content: "Pricing across different Nordic markets requires careful consideration.",
      },
      {
        id: 'success-metrics',
        title: 'Success Metrics',
        content: "Track these KPIs to measure your international expansion success.",
      },
    ],
    relatedArticles: [
      {
        slug: 'shopify-pos-vs-traditional-retail-systems',
        title: 'Shopify POS Comparison',
        category: 'POS',
        readTime: '10 min read',
        image: '/images/resources/articles/2.png',
      },
      {
        slug: 'zero-to-1m-nok-fashion-brand-shopify',
        title: 'Zero to 1M NOK Fashion Brand',
        category: 'Case Studies',
        readTime: '15 min read',
        image: '/images/resources/articles/4.jpg',
      },
      {
        slug: 'ai-powered-product-recommendations',
        title: 'AI Product Recommendations',
        category: 'AI',
        readTime: '6 min read',
        image: '/images/resources/articles/3.jpg',
      },
    ],
  },
]

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((article) => article.slug === slug)
}

export function getAllArticleSlugs(): string[] {
  return articles.map((article) => article.slug)
}

