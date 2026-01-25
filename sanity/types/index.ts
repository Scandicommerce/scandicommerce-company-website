// ============================================
// Base Types
// ============================================

export interface SanityImage {
  asset?: {
    _id?: string;
    url?: string;
    metadata?: {
      dimensions?: {
        width: number;
        height: number;
      };
      lqip?: string;
    };
  };
  alt?: string;
}

// ============================================
// Hero Section
// ============================================

export interface HeroButton {
  text: string;
  link: string;
  variant?: "primary" | "secondary";
}

export interface HeroPackage {
  icon?: SanityImage;
  title: string;
  price?: string;
}

export interface HeroSection {
  badge?: string;
  title?: {
    text: string;
    highlight?: string;
  };
  description?: string;
  buttons?: HeroButton[];
  tagline?: string;
  packages?: HeroPackage[];
}

// ============================================
// Pain Points Section
// ============================================

export interface PainPointsSection {
  title?: {
    text: string;
    highlight?: string;
  };
  items?: {
    text: string;
  }[];
  bottomText?: string;
  ctaLink?: {
    text?: string;
    url?: string;
  };
}

// ============================================
// Services Showcase Section
// ============================================

export interface ServiceCategory {
  title: string;
  icon?: string;
  description?: string;
  price?: string;
  link?: string;
}

export interface ServicePackage {
  tier?: string;
  description?: string;
  price: string;
  features?: string[];
  buttonText?: string;
  buttonLink?: string;
  featured?: boolean;
}

export interface ServicesShowcaseSection {
  title?: {
    text: string;
    highlight?: string;
  };
  subtitle?: string;
  categories?: ServiceCategory[];
  packages?: ServicePackage[];
}

// ============================================
// Results Section
// ============================================

export interface ResultItem {
  clientImage?: SanityImage;
  clientName: string;
  stat: string;
  metricName?: string;
  description?: string;
  ctaText?: string;
  ctaLink?: string;
}

export interface ResultsSection {
  title?: string;
  subtitle?: string;
  items?: ResultItem[];
  theme?: "dark" | "light";
}

// ============================================
// Process Section
// ============================================

export interface ProcessStep {
  number?: number;
  title: string;
  description?: string;
}

export interface Partner {
  name?: string;
  logo?: SanityImage;
  link?: string;
}

export interface ProcessSection {
  title?: string;
  subtitle?: string;
  steps?: ProcessStep[];
  partners?: Partner[];
  footerText?: string;
}

// ============================================
// CTA Section
// ============================================

export interface CTAButton {
  text: string;
  link: string;
  variant?: "primary" | "secondary";
}

export interface CTASection {
  title?: string;
  subtitle?: string;
  buttons?: CTAButton[];
  backgroundColor?: "primary" | "dark";
}

// ============================================
// SEO
// ============================================

export interface SEO {
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: SanityImage;
}

// ============================================
// Landing Page
// ============================================

export interface LandingPage {
  _id: string;
  pageTitle: string;
  slug: string;
  isHomepage?: boolean;
  hero?: HeroSection;
  painPoints?: PainPointsSection;
  servicesShowcase?: ServicesShowcaseSection;
  results?: ResultsSection;
  process?: ProcessSection;
  cta?: CTASection;
  seo?: SEO;
}
