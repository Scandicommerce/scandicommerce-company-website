/**
 * Placeholder content for landing page builder blocks.
 * - defineType `initialValue`: prefills when adding a block or embedding the type.
 * - `defaultLandingPageSectionsForNewDocument`: prefills new landingPage documents.
 */

export const heroSectionInitialValue = {
  heroBadge: "Badge line above the headline",
  heroTitle: {
    text: "Main headline with an optional",
    highlight: "highlight",
  },
  heroDescription:
    "Supporting paragraph — replace with your positioning and value proposition.",
  heroTagline: "Short line · Under · Buttons",
  heroButtons: [
    {
      _type: "button",
      text: "Primary CTA",
      link: "/tjenester/alle-pakker",
      variant: "primary",
    },
    {
      _type: "button",
      text: "Secondary CTA",
      link: "/kontakt",
      variant: "secondary",
    },
  ],
  heroPackages: [
    { _type: "package", title: "Foundation", price: "From … kr" },
    { _type: "package", title: "Growth", price: "From … kr" },
    { _type: "package", title: "Premium", price: "From … kr" },
    { _type: "package", title: "Enterprise", price: "Custom" },
  ],
};

export const trustedBySectionInitialValue = {
  title: "Trusted by leading brands",
  brands: [],
};

export const painPointsSectionInitialValue = {
  painPointsTitle: {
    text: "Section title with a highlighted phrase in the middle",
    highlight: "highlighted phrase",
  },
  painPointsItems: [
    { _type: "item", text: "First pain point — edit or remove" },
    { _type: "item", text: "Second pain point — edit or remove" },
    { _type: "item", text: "Third pain point — edit or remove" },
  ],
  painPointsBottomText: "Closing line under the grid.",
  painPointsCta: {
    text: "Link label",
    url: "/tjenester/alle-pakker",
  },
};

export const servicesShowcaseSectionInitialValue = {
  title: {
    text: "Services packaged as products",
    highlight: "products",
  },
  subtitle: "Subtitle — explain how packages work.",
  categories: [
    {
      _type: "category",
      title: "Build",
      icon: "cart",
      description: "Stores, migrations, custom work",
      price: "From … kr",
      link: "/kontakt",
      linkText: "Contact us",
    },
    {
      _type: "category",
      title: "Optimize",
      icon: "chart",
      description: "CRO, speed, analytics",
      price: "From … kr",
      link: "/kontakt",
      linkText: "Contact us",
    },
    {
      _type: "category",
      title: "Support",
      icon: "chat",
      description: "Retainers and ongoing help",
      price: "From … /mo",
      link: "/kontakt",
      linkText: "Contact us",
    },
  ],
  packages: [
    {
      _type: "package",
      title: "Foundation",
      subtitle: "Short package subtitle",
      price: "—",
      priceType: "one-time",
      timeline: "6–8 weeks",
      rating: 5,
      ratingValue: "5",
      bestFor: ["SMB", "Simple catalog"],
      buttonText: "View details",
      buttonLink: "/tjenester/alle-pakker/foundation",
    },
    {
      _type: "package",
      title: "Growth",
      subtitle: "Short package subtitle",
      price: "—",
      priceType: "one-time",
      timeline: "8–10 weeks",
      rating: 5,
      ratingValue: "5",
      bestFor: ["Scaling brands"],
      buttonText: "View details",
      buttonLink: "/tjenester/alle-pakker/growth",
    },
    {
      _type: "package",
      title: "Premium",
      subtitle: "Short package subtitle",
      price: "—",
      priceType: "one-time",
      timeline: "10–14 weeks",
      rating: 5,
      ratingValue: "5",
      bestFor: ["Complex commerce"],
      buttonText: "View details",
      buttonLink: "/tjenester/alle-pakker/premium",
    },
    {
      _type: "package",
      title: "Enterprise",
      subtitle: "Short package subtitle",
      price: "Custom",
      priceType: "one-time",
      timeline: "Custom",
      rating: 5,
      ratingValue: "5",
      bestFor: ["High volume", "Multi-store"],
      buttonText: "View details",
      buttonLink: "/tjenester/alle-pakker/enterprise",
    },
  ],
};

export const resultsSectionInitialValue = {
  title: "Results, not promises",
  subtitle: "Replace with your subtitle",
  theme: "dark",
  items: [
    {
      _type: "result",
      clientName: "Client name",
      stat: "+0%",
      metricName: "Metric",
      description: "Short result description — add image in editor.",
      ctaText: "Read case study",
      ctaLink: "/blogg",
    },
  ],
};

export const processSectionInitialValue = {
  processTitle: "How we work",
  processSubtitle: "Simple, transparent, and effective",
  processSteps: [
    {
      _type: "step",
      number: 1,
      title: "Discover",
      description: "What happens in step 1",
    },
    {
      _type: "step",
      number: 2,
      title: "Choose",
      description: "What happens in step 2",
    },
    {
      _type: "step",
      number: 3,
      title: "Launch",
      description: "What happens in step 3",
    },
  ],
};

export const partnersSectionInitialValue = {
  partnersBadges: [
    { _type: "badge", text: "Browse services", link: "/tjenester" },
    { _type: "badge", text: "Partner program", link: "/partnere" },
  ],
  partnersDescription:
    "Short line about partnerships — e.g. official partner since …",
};

export const ctaSectionInitialValue = {
  title: "Ready to move forward?",
  subtitle: "Browse packages or book a short intro call.",
  backgroundColor: "primary",
  buttons: [
    {
      _type: "button",
      text: "Browse packages",
      link: "/tjenester/alle-pakker",
      variant: "primary",
    },
    {
      _type: "button",
      text: "Contact",
      link: "/kontakt",
      variant: "secondary",
    },
  ],
};

export const testimonialSectionInitialValue = {
  theme: "dark" as const,
  testimonials: [
    {
      quote: "Replace with a strong client quote — what changed for them working with you.",
      authorName: "Author name",
      authorRole: "Role / title",
      companyName: "Company",
    },
  ],
};

export const latestInsightsSectionInitialValue = {
  title: "Innsikt & ekspertise",
  subtitle: "",
  maxPosts: 3,
  filterByTag: "",
  ctaText: "Se alle artikler",
  ctaLink: "/blogg",
};

export const technicalDepthSectionInitialValue = {
  title: "Technical depth",
  subtitle: "Optional intro — what you excel at under the hood.",
  capabilities: [
    {
      icon: "API",
      title: "Integrations & APIs",
      description: "Describe integrations, ERP, PIM, or custom apps.",
      tags: ["Shopify", "APIs"],
    },
    {
      icon: "UX",
      title: "Performance & CRO",
      description: "Speed, UX, testing, and conversion work.",
      tags: ["CRO", "Performance"],
    },
    {
      icon: "DEV",
      title: "Custom development",
      description: "Liquid, React, Hydrogen, or app extensions.",
      tags: ["Theme", "Apps"],
    },
  ],
};

/** Full homepage stack for a brand-new `landingPage` document. */
export function defaultLandingPageSectionsForNewDocument() {
  return [
    { _type: "heroSection" as const, ...heroSectionInitialValue },
    { _type: "trustedBySection" as const, ...trustedBySectionInitialValue },
    { _type: "painPointsSection" as const, ...painPointsSectionInitialValue },
    {
      _type: "servicesShowcaseSection" as const,
      ...servicesShowcaseSectionInitialValue,
    },
    { _type: "resultsSection" as const, ...resultsSectionInitialValue },
    { _type: "processSection" as const, ...processSectionInitialValue },
    { _type: "partnersSection" as const, ...partnersSectionInitialValue },
    { _type: "ctaSection" as const, ...ctaSectionInitialValue },
  ];
}
