#!/usr/bin/env python3
"""Generate lib/seo/url-plan.json from a Sanity dataset dump.

Usage: python3 scripts/seo/generate-url-plan.py <dataset.json>
The dump is the `result` of `*[!(_id in path("drafts.**"))]` on fk1tt27l/production.
"""
import json, re, sys
docs = json.load(open(sys.argv[1]))['result']
LANGS = ['en', 'no', 'sv', 'da', 'de']; COUNTRY = {'se': 'sv', 'dk': 'da', 'de': 'de'}
BLOG = {'no': 'blogg', 'en': 'blog', 'sv': 'blog', 'da': 'blog', 'de': 'blog'}
WORK = {'no': 'kundecaser', 'en': 'work', 'sv': 'work', 'da': 'work', 'de': 'work'}

def strip(slug):
    segs = [s for s in slug.strip('/').split('/') if s]
    while segs and (segs[0] in LANGS or segs[0] in COUNTRY): segs.pop(0)
    return '/'.join(segs)

def clean(s): return re.sub(r'-{2,}', '-', s.lower().replace('_', '-'))

CASE_RENAME = {
    'Slikkepott-Case-study': 'slikkepott',
    'how-molsoft-unified-groupe-marcelle-s-brands-on-shopify-and-delivered-32-sales-growth': 'groupe-marcelle',
    'lanullva-shopify-case-study': 'lanullva',
    'lanullva-35-percent-sales-growth': 'lanullva',
}

def new_slug(t, lang, old):
    s = strip(old); last = s.split('/')[-1] if s else ''
    no = lang == 'no'
    if t == 'landingPage': return '/'
    if t == 'shopifyTcoCalculatorPage': return 'shopify-tco-kalkulator' if no else 'shopify-tco-calculator'
    if t == 'shopifyXPimPage': return 'shopify-pim'
    if t == 'whyShopifyPage': return 'hvorfor-shopify' if no else 'why-shopify'
    if t == 'shopifyPlatformPage': return 'shopify/shopify-plattformen' if no else 'shopify/shopify-platform'
    if t == 'shopifyPosInfoPage': return 'shopify/shopify-pos'
    if t == 'shopifyXAiPage': return 'shopify/shopify-x-ki' if no else 'shopify/shopify-x-ai'
    if t == 'vippsHurtigkassePage': return 'shopify/vipps-hurtigkasse'
    if t == 'shopifyPosPage': return 'tjenester/shopify-pos' if no else 'services/shopify-pos'
    if t == 'migratePage': return 'tjenester/shopify-migrering' if no else 'services/migrate'
    if t == 'shopifyDevelopmentPage': return 'tjenester/utvikling' if no else 'services/shopify-development'
    if t == 'allPackagesPage': return 'tjenester/alle-pakker' if no else 'services/all-packages'
    if t == 'packageDetailPage':
        if last in ('growth', 'premium', 'enterprise', 'foundation'):
            return f'tjenester/alle-pakker/{last}' if no else f'services/all-packages/{last}'
        return clean(s)
    if t == 'merchPage': return 'merch'
    if t == 'caseStudy': return CASE_RENAME.get(last, clean(last))
    if t in ('post', 'blogPost'): return clean(last)
    return clean(s)

def pub(lang, p):
    if lang in ('sv', 'da', 'de'): return f'/{lang}/{p}' if p else f'/{lang}'
    return f'/{p}' if p else '/'

def old_public_path(t, lang, old):
    """URL the pre-migration site served for this doc (prefix stripped, articles + cases under /resources/)."""
    s = strip(old); last = s.split('/')[-1] if s else ''
    if t == 'landingPage' or s in ('', 'home'): p = ''
    elif t in ('post', 'blogPost', 'caseStudy'): p = f'resources/{last}'
    elif t == 'author': p = f'team/{s}'
    elif t == 'legalPage': p = f'legal/{s}'
    else: p = s
    return pub(lang, p)

def doc_path(t, lang, slug):
    s = strip(slug); last = s.split('/')[-1] if s else ''
    if t == 'landingPage' or s in ('', 'home'): return ''
    if t in ('post', 'blogPost'): return f'{BLOG[lang]}/{last}'
    if t == 'caseStudy': return f'{WORK[lang]}/{last}'
    if t == 'author': return f'team/{s}'
    if t == 'legalPage': return f'legal/{s}'
    return s

groups = {}
for d in docs:
    if d['_type'] == 'translation.metadata':
        for tr in d.get('translations', []) or []:
            ref = (tr.get('value') or {}).get('_ref')
            if ref: groups[ref] = d['_id']

plan = []
for d in docs:
    slug = (d.get('slug') or {}).get('current')
    if not slug: continue
    t = d['_type']
    if t == 'author':
        ns = new_slug(t, 'en', slug)
        plan.append(dict(id=d['_id'], type=t, language=None, oldSlug=slug, newSlug=ns,
                         newPath=f'team/{ns}', oldPublicPath=f'/team/{strip(slug)}', newPublicPath=f'/team/{ns}', group=None))
        continue
    lang = d.get('language') or 'en'
    ns = new_slug(t, lang, slug)
    plan.append(dict(id=d['_id'], type=t, language=lang, oldSlug=slug, newSlug=ns,
                     newPath=doc_path(t, lang, ns), oldPublicPath=old_public_path(t, lang, slug),
                     newPublicPath=pub(lang, doc_path(t, lang, ns)), group=groups.get(d['_id'])))

plan.sort(key=lambda x: (x['type'], x['language'] or '', x['newSlug']))
changes = [p for p in plan if p['oldSlug'] != p['newSlug']]
print('docs with slug', len(plan), '| slug changes', len(changes), file=sys.stderr)
for p in changes:
    print(f"{p['type']:26} {(p['language'] or '-'):3} {p['oldSlug']:55} -> {p['newSlug']}", file=sys.stderr)

clusters = {}
for p in plan:
    if p['group'] and p['language']:
        clusters.setdefault(p['group'], {})[p['language']] = p['newPath']

seen = {}
for p in plan:
    k = (p['language'], p['newPath'])
    if k in seen: print('COLLISION', k, seen[k], p['id'], file=sys.stderr)
    seen[k] = p['id']

out = {'generatedFrom': 'sanity fk1tt27l/production, published documents, 2026-09-16',
       'documents': plan, 'clusters': clusters}
json.dump(out, open('lib/seo/url-plan.json', 'w'), indent=2, ensure_ascii=False)
print('clusters', len(clusters), file=sys.stderr)
