/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  transpilePackages: ['@sanity/ui', 'sanity', 'motion'],
  images: {
    domains: [],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.myshopify.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  async redirects() {
    return [
      // Products (old /products/*) → merch or package pages
      { source: '/products/premium-unisex-pullover-hoodie-justhoods-jh001', destination: '/merch/premium-unisex-pullover-hoodie-justhoods-jh001', permanent: true },
      { source: '/products/organic-unisex-crewneck-sweatshirt', destination: '/merch/organic-unisex-crewneck-sweatshirt', permanent: true },
      { source: '/products/polycotton-unisex-crewneck-t-shirt', destination: '/merch/polycotton-unisex-crewneck-t-shirt', permanent: true },
      { source: '/products/premium-unisex-crewneck-t-shirt-bella-canvas-3001', destination: '/merch/premium-unisex-crewneck-t-shirt-bella-canvas-3001', permanent: true },
      { source: '/products/classic-baby-long-sleeve-bodysuit', destination: '/merch/classic-baby-long-sleeve-bodysuit', permanent: true },
      { source: '/products/classic-unisex-crewneck-t-shirt-gildan-64000', destination: '/merch/classic-unisex-crewneck-t-shirt-gildan-64000', permanent: true },
      { source: '/products/premium-unisex-pullover-hoodie-laneseven-ls13001', destination: '/merch/premium-unisex-pullover-hoodie-laneseven-ls13001', permanent: true },
      { source: '/products/classic-baby-short-sleeve-bodysuit', destination: '/merch/classic-baby-short-sleeve-bodysuit', permanent: true },
      { source: '/products/organic-baby-short-sleeve-bodysuit-sols-organic-bambino-01192', destination: '/merch/organic-baby-short-sleeve-bodysuit-sols-organic-bambino-01192', permanent: true },
      { source: '/products/premium-unisex-v-neck-t-shirt', destination: '/merch/premium-unisex-v-neck-t-shirt', permanent: true },
      { source: '/products/white-17oz-stainless-steel-water-bottle', destination: '/merch/white-17oz-stainless-steel-water-bottle', permanent: true },
      { source: '/products/flexi-case', destination: '/merch/flexi-case', permanent: true },
      { source: '/products/classic-unisex-pullover-hoodie-gildan-18500', destination: '/merch/classic-unisex-pullover-hoodie-gildan-18500', permanent: true },
      { source: '/products/heavyweight-unisex-crewneck-t-shirt-gildan-5000', destination: '/merch/heavyweight-unisex-crewneck-t-shirt-gildan-5000', permanent: true },
      { source: '/products/white-15oz-stainless-steel-travel-mug', destination: '/merch/white-15oz-stainless-steel-travel-mug', permanent: true },
      { source: '/products/classic-unisex-crewneck-sweatshirt-gildan-18000', destination: '/merch/classic-unisex-crewneck-sweatshirt-gildan-18000', permanent: true },
      { source: '/products/11oz-ceramic-mug', destination: '/merch/11oz-ceramic-mug', permanent: true },
      { source: '/products/foundation', destination: '/tjenester/alle-pakker/foundation', permanent: true },
      { source: '/products/growth', destination: '/tjenester/alle-pakker/growth', permanent: true },
      { source: '/products/premium', destination: '/tjenester/alle-pakker/premium', permanent: true },
      { source: '/products/enterprise', destination: '/tjenester/alle-pakker/enterprise', permanent: true },
      // Pages (old /pages/*)
      { source: '/pages/contact', destination: '/kontakt', permanent: true },
      { source: '/pages/why-shopify', destination: '/shopify/hvorfor_shopify', permanent: true },
      { source: '/pages/shopify-x-ai', destination: '/shopify/shopify_x_KI', permanent: true },
      { source: '/pages/partners', destination: '/partnere', permanent: true },
      { source: '/pages/shopify-x-pim', destination: '/partnere', permanent: true },
      { source: '/pages/projects', destination: '/tjenester/alle-pakker', permanent: true },
      { source: '/pages/services', destination: '/tjenester/alle-pakker', permanent: true },
      { source: '/pages/shopify-tco-calculator', destination: '/shopify/shopify_TCO_kalkulator', permanent: true },
      { source: '/pages/about-us', destination: '/om-oss', permanent: true },
      { source: '/pages/apa-nzpa', destination: '/om-oss', permanent: true },
      { source: '/pages/canadian-laws-compliance', destination: '/om-oss', permanent: true },
      { source: '/pages/gdpr', destination: '/om-oss', permanent: true },
      { source: '/pages/us-laws-compliance', destination: '/om-oss', permanent: true },
      { source: '/pages/articles', destination: '/blogg', permanent: true },
      { source: '/pages/shopify-pos', destination: '/shopify/shopify-POS', permanent: true },
      { source: '/pages/shopify', destination: '/tjenester/utvikling', permanent: true },
      { source: '/pages/shopify-migration', destination: '/tjenester/shopify_migrering', permanent: true },
      { source: '/pages/pos-venteliste', destination: '/tjenester/shopify_pos', permanent: true },
      { source: '/pages/vipps-express', destination: '/shopify/vipps-hurtigkasse', permanent: true },
      // Collections (old /collections/*)
      { source: '/collections/frontpage', destination: '/tjenester/alle-pakker', permanent: true },
      { source: '/collections/packages', destination: '/tjenester/alle-pakker', permanent: true },
      { source: '/collections/merch', destination: '/merch', permanent: true },
      // Blogs (old /blogs/*) → /blogg (all blog paths go to blog index)
      { source: '/blogs/news', destination: '/blogg', permanent: true },
      { source: '/blogs/shopify-optimization-performance', destination: '/blogg', permanent: true },
      { source: '/blogs/cro', destination: '/blogg', permanent: true },
      { source: '/blogs/e-commerce-strategy-growth', destination: '/blogg', permanent: true },
      { source: '/blogs/how-we-work', destination: '/blogg', permanent: true },
      { source: '/blogs/shopify-optimization-performance/shopify-plus-vs-standard-when-to-upgrade-your-store-2025-guide', destination: '/blogg', permanent: true },
      { source: '/blogs/shopify-optimization-performance/shopify-functions-vs-apps-why-merchants-are-making-the-wrong-choice-2025', destination: '/blogg', permanent: true },
      { source: '/blogs/cro/5-checkout-optimization-tricks-that-boost-your-sales', destination: '/blogg', permanent: true },
      { source: '/blogs/e-commerce-strategy-growth/headed-vs-headless-commerce-why-most-businesses-should-think-twice-about-going-headless', destination: '/blogg', permanent: true },
      { source: '/blogs/how-we-work/fra-24nettbutikk-og-wix-til-effektiv-b2b-drift-pa-shopify', destination: '/blogg', permanent: true },
      { source: '/blogs/how-we-work/level-up-fra-hobby-til-utfordrer', destination: '/blogg', permanent: true },
      { source: '/blogs/how-we-work/slik-jobber-vi-med-shopify-plus-kunder', destination: '/blogg', permanent: true },
    ]
  },
}

module.exports = nextConfig
