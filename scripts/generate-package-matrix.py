#!/usr/bin/env python3
"""Generate lib/packageMatrix.ts from the package-matrix spreadsheet.

Usage:
    python3 scripts/generate-package-matrix.py <Scandicommerce_ny_pakkematrise_forslag_vN.xlsx>

The spreadsheet is the source of truth for which services belong to which
package. It is not in the repo (it lives in Google Drive), so re-run this when
it changes rather than editing lib/packageMatrix.ts by hand.

Two columns need care:

  Kundetekst   customer-facing, used verbatim.
  Avgrensning  mixes customer-facing scope with internal working notes. Only
               the customer-facing clauses are emitted — see SANITISE below.
               Hour references are dropped: how many hours a service consumes
               is internal and must not reach the page.
"""
import re
import sys
import zipfile
from xml.etree import ElementTree as ET

NS = "{http://schemas.openxmlformats.org/spreadsheetml/2006/main}"
RNS = "{http://schemas.openxmlformats.org/officeDocument/2006/relationships}"

TIERS = {"Growth": "growth", "Premium": "premium", "Enterprise": "enterprise"}
SECTION_ORDER = ["Strategi og vekst", "Bygg", "Integrer og data", "Drift og støtte"]

# Hour accounting is internal. These phrases are excised from within a clause
# rather than dropping it, so "Engangsarbeid i oppstart, trekkes fra timene"
# keeps the part that is genuine customer-facing scope.
HOUR_PHRASES = [
    r",?\s*trekkes fra(?: de)?(?: \d+)? timene?",
    r",?\s*innenfor timene",
    r"\u2248?\s*\d+\s*timer per m\u00e5ned",
    r"Antatt ca\.\s*\d+\s*t per \w+,?\s*",
]

# Clause-level patterns that mark an Avgrensning fragment as internal. A limit
# is split on sentence boundaries and any clause matching these is dropped; if
# nothing survives, the service ships with no scope line at all.
SANITISE = [
    r"\btimer?\b|\btimene\b",  # any remaining hour accounting
    r"\b\d+\s*t\b",            # "12 t per revisjon"
    r"^bekreft",               # open question for the authors
    r"^ny$",                   # "NY." marker on a new row
    r"^antatt",                # stated assumption
    r"^overlapper med",        # cross-reference to another row
    r"^fra enterprise-faq",    # provenance note
    r"fyller trappen",         # rationale about the package ladder
    r"gamle .*-punkter",       # notes about the previous inventory
    r"\bN\d{2}\b",             # any internal row id
]
# Prefixes that mark the author's suggestion rather than agreed copy.
STRIP_PREFIXES = ["Forslag: "]

# The spreadsheet names specific vendors. Service copy stays tool-agnostic so a
# package does not promise a particular product; the tooling is a delivery
# detail agreed per customer. Applied to service names, customer text and card
# bullets.
VENDOR_NEUTRAL = [
    (r"Klaviyo og e-postautomatisering", "E-post og markedsf\u00f8ringsautomatisering"),
    (r"kampanjeoppsett i Klaviyo", "kampanjeoppsett i e-postplattformen din"),
    (r"\bKlaviyo, ", "E-post, "),
    (r"\bKlaviyo\b", "e-postplattformen din"),
]


def neutralise(text):
    """Strip vendor names from customer-facing copy."""
    for pattern, replacement in VENDOR_NEUTRAL:
        text = re.sub(pattern, replacement, text)
    return text


def sheets(path):
    z = zipfile.ZipFile(path)
    shared = []
    if "xl/sharedStrings.xml" in z.namelist():
        for si in ET.fromstring(z.read("xl/sharedStrings.xml")):
            shared.append("".join(t.text or "" for t in si.iter(NS + "t")))
    wb = ET.fromstring(z.read("xl/workbook.xml"))
    rel = {r.get("Id"): r.get("Target") for r in ET.fromstring(z.read("xl/_rels/workbook.xml.rels"))}
    out = {}
    for sh in wb.find(NS + "sheets"):
        tgt = rel[sh.get(RNS + "id")]
        if not tgt.startswith("xl/"):
            tgt = "xl/" + tgt.lstrip("/")
        rows = []
        for row in ET.fromstring(z.read(tgt)).iter(NS + "row"):
            cells = {}
            for c in row:
                col = "".join(ch for ch in (c.get("r") or "") if ch.isalpha())
                t, v = c.get("t"), c.find(NS + "v")
                if t == "inlineStr":
                    isn = c.find(NS + "is")
                    txt = "".join(x.text or "" for x in isn.iter(NS + "t")) if isn is not None else ""
                elif v is None:
                    txt = ""
                elif t == "s":
                    txt = shared[int(v.text)]
                else:
                    txt = v.text or ""
                cells[col] = txt.strip()
            rows.append(cells)
        out[sh.get("name")] = rows
    return out


def sanitise_limit(raw):
    """Keep only the clauses of an Avgrensning that a customer should read."""
    if not raw:
        return ""
    for prefix in STRIP_PREFIXES:
        if raw.startswith(prefix):
            raw = raw[len(prefix):]
    for phrase in HOUR_PHRASES:
        raw = re.sub(phrase, "", raw, flags=re.I)
    kept = []
    for clause in re.split(r"(?<=[.])\s+", raw):
        c = clause.strip().rstrip(".")
        if not c:
            continue
        if any(re.search(p, c, re.I) for p in SANITISE):
            continue
        kept.append(c)
    out = ". ".join(kept)
    # Stripping a prefix can leave the sentence starting lower-case.
    return out[:1].upper() + out[1:] if out else out


def q(s):
    return "'" + (s or "").replace("\\", "\\\\").replace("'", "\\'") + "'"


def main(path):
    S = sheets(path)
    services, dropped = [], []
    for r in S["Matrise"]:
        sid = r.get("A", "")
        if not (sid.startswith("N") and sid[1:].isdigit()):
            continue
        raw_limit = r.get("I", "")
        limit = sanitise_limit(raw_limit)
        if raw_limit and not limit:
            dropped.append((sid, raw_limit))
        elif raw_limit and limit != raw_limit:
            dropped.append((sid, f"{raw_limit}  ->  {limit}"))
        services.append({
            "id": sid, "section": r.get("B", ""), "name": neutralise(r.get("C", "")),
            "tier": TIERS[r["D"]], "text": neutralise(r.get("H", "")), "limit": neutralise(limit),
        })

    cards = []
    for r in S["Kort"][1:]:
        if r.get("A", "") not in TIERS:
            continue
        bullets = [r.get(c, "") for c in ("F", "G", "H", "I", "J", "K")]
        cards.append({
            "tier": TIERS[r["A"]], "name": r["A"], "price": r.get("B", ""),
            "hours": r.get("C", ""), "tagline": neutralise(r.get("D", "")),
            "audience": neutralise(r.get("E", "")),
            "bullets": [neutralise(b) for b in bullets if b],
        })

    out = [HEADER, "export const packageServices: PackageService[] = ["]
    key = lambda s: (["growth", "premium", "enterprise"].index(s["tier"]),
                     SECTION_ORDER.index(s["section"]), s["id"])
    for s in sorted(services, key=key):
        parts = [f"id: {q(s['id'])}", f"section: {q(s['section'])}",
                 f"name: {q(s['name'])}", f"text: {q(s['text'])}"]
        if s["limit"]:
            parts.append(f"limit: {q(s['limit'])}")
        parts.append(f"tier: {q(s['tier'])}")
        out.append("  { " + ", ".join(parts) + " },")
    out.append("]")
    out.append("")
    out.append("export const packageCards: PackageCard[] = [")
    for c in cards:
        out.append("  {")
        for f in ("tier", "name", "price", "hours", "tagline", "audience"):
            out.append(f"    {f}: {q(c[f])},")
        out.append("    bullets: [")
        out.extend(f"      {q(b)}," for b in c["bullets"])
        out.append("    ],")
        out.append("  },")
    out.append("]")
    out.append(HELPERS)

    with open("lib/packageMatrix.ts", "w", encoding="utf-8") as fh:
        fh.write("\n".join(out) + "\n")

    print(f"services: {len(services)}  cards: {len(cards)}")
    print(f"wrote lib/packageMatrix.ts")
    if dropped:
        print(f"\nAvgrensning sanitised ({len(dropped)}):")
        for sid, note in dropped:
            print(f"  {sid}: {note}")


HEADER = '''/**
 * Package matrix: which services belong to Growth, Premium and Enterprise.
 *
 * GENERATED by scripts/generate-package-matrix.py from
 * Scandicommerce_ny_pakkematrise_forslag_v2.xlsx — do not edit by hand.
 *
 * Each package contains the one below it, so a service listed on Growth also
 * appears on Premium and Enterprise, marked as inherited rather than repeated.
 *
 * `limit` carries only the customer-facing part of the spreadsheet's
 * Avgrensning column; internal notes and hour accounting are stripped by the
 * generator.
 */

/** Lowest to highest. Index order drives inheritance. */
export const PACKAGE_TIERS = ['growth', 'premium', 'enterprise'] as const

export type PackageTier = (typeof PACKAGE_TIERS)[number]

/** Section order as the spreadsheet presents it. */
export const PACKAGE_SECTIONS = [
  'Strategi og vekst',
  'Bygg',
  'Integrer og data',
  'Drift og st\\u00f8tte',
] as const

export type PackageSection = (typeof PACKAGE_SECTIONS)[number]

export interface PackageService {
  /** Spreadsheet id (N03, N22 \\u2026). Internal \\u2014 keeps rows traceable to the source. */
  id: string
  section: PackageSection
  name: string
  /** Customer-facing sentence from the spreadsheet. */
  text: string
  /** What the service does not cover. Absent when nothing customer-facing remained. */
  limit?: string
  /** Lowest package that includes this service. */
  tier: PackageTier
}

export interface PackageCard {
  tier: PackageTier
  name: string
  price: string
  /** Internal capacity figure. Not rendered on the site. */
  hours: string
  tagline: string
  audience: string
  bullets: string[]
}
'''

HELPERS = '''
export interface PackageSectionGroup {
  section: PackageSection
  /** Services new to this package. */
  added: PackageService[]
  /** Services carried up from a lower package. */
  inherited: PackageService[]
}

/** Everything a package includes, grouped by section and split into new vs inherited. */
export function servicesForTier(tier: PackageTier): PackageSectionGroup[] {
  const ceiling = PACKAGE_TIERS.indexOf(tier)
  return PACKAGE_SECTIONS.map((section) => {
    const inSection = packageServices.filter(
      (s) => s.section === section && PACKAGE_TIERS.indexOf(s.tier) <= ceiling
    )
    return {
      section,
      added: inSection.filter((s) => s.tier === tier),
      inherited: inSection.filter((s) => s.tier !== tier),
    }
  }).filter((group) => group.added.length > 0 || group.inherited.length > 0)
}

/** The package immediately below, or undefined for the entry package. */
export function tierBelow(tier: PackageTier): PackageTier | undefined {
  return PACKAGE_TIERS[PACKAGE_TIERS.indexOf(tier) - 1]
}

export function cardForTier(tier: PackageTier): PackageCard | undefined {
  return packageCards.find((c) => c.tier === tier)
}

/** Total services included at a tier, inherited ones counted. */
export function serviceCount(tier: PackageTier): number {
  const ceiling = PACKAGE_TIERS.indexOf(tier)
  return packageServices.filter((s) => PACKAGE_TIERS.indexOf(s.tier) <= ceiling).length
}'''


if __name__ == "__main__":
    main(sys.argv[1])
