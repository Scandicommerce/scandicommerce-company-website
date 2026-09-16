const { fetchRedirects } = require('./lib/sanity/fetchRedirects')
const { legacyRedirects } = require('./lib/seo/legacyRedirects')

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
  // TECHNICAL-SEO-SPEC Task 10: never a trailing slash (canonicals, sitemap and links agree).
  trailingSlash: false,
  async headers() {
    // TECHNICAL-SEO-SPEC Task 5 (D8): preview / development deployments must never be indexed.
    // robots.txt alone does not drop already-indexed *.vercel.app URLs; the header does.
    const isProduction = process.env.VERCEL_ENV ? process.env.VERCEL_ENV === 'production' : true
    if (isProduction) return []
    return [
      {
        source: '/:path*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
    ]
  },
  async redirects() {
    // 1. Generated, host-scoped 308s for every renamed URL and every legacy
    //    Shopify-storefront path (lib/seo/legacyRedirects.js, url-plan.json).
    const legacy = legacyRedirects()

    // 2. Sanity-managed redirects (editorial). Fail-safe: returns [] on any
    //    error so the build can never break because of CMS issues. A Sanity
    //    entry whose `source` matches a generated one loses — generated
    //    entries are host-aware and never chain.
    const fromSanity = await fetchRedirects()
    const legacySources = new Set(legacy.map((r) => r.source.toLowerCase()))
    const merged = [
      ...legacy,
      ...fromSanity.filter((r) => !legacySources.has(r.source.toLowerCase())),
    ]
    return merged
  },
}

module.exports = nextConfig
