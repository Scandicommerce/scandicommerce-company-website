import type { PostBlock } from '@/lib/blogBuilder'

/** One jump-link entry for the table of contents. */
export interface OutlineItem {
  id: string
  title: string
}

/** A post block with the heading id the outline assigned to it. */
export type PreparedBlock = PostBlock & { headingId?: string }

type Span = { _type: 'span'; _key: string; text: string; marks: string[] }
type TextBlock = {
  _type: 'block'
  _key: string
  style?: string
  listItem?: string
  level?: number
  markDefs?: unknown[]
  children?: Span[]
  headingId?: string
}
/** Tab-separated paragraphs from a migrated post, grouped into a table. */
export type MigratedTable = { _type: 'postTable'; _key: string; rows: string[][] }
/** "59.5%" + "CORE WEB VITALS" paragraph pairs from a migrated post. */
export type MigratedStats = { _type: 'postStats'; _key: string; stats: { value: string; label: string }[] }

export function isTextBlock(block: unknown): block is TextBlock {
  return typeof block === 'object' && block !== null && (block as { _type?: string })._type === 'block'
}

export function textOf(block: unknown): string {
  if (!isTextBlock(block)) return ''
  return (block.children ?? []).map((c) => c?.text ?? '').join('')
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/æ/g, 'ae')
    .replace(/ø/g, 'o')
    .replace(/å/g, 'a')
    .replace(/ä/g, 'a')
    .replace(/ö/g, 'o')
    .replace(/ü/g, 'u')
    .replace(/ß/g, 'ss')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
}

// --- Migrated bodies -------------------------------------------------------
// Posts imported from the old site arrive as one richTextBlock of plain
// paragraphs: headings are ALL CAPS lines, tables are tab-separated rows and
// stats are a number followed by its label. Nothing is marked up, so a body
// that has no headings, marks or lists is read as migrated and tidied here.

const letters = (t: string) => (t.match(/[A-ZÆØÅÄÖÜ]/gi) ?? []).length
const isAllCaps = (t: string) => t.length <= 90 && letters(t) >= 3 && letters(t) > (t.match(/\d/g) ?? []).length && t === t.toUpperCase() && !/[.!?]$/.test(t)
const isStatValue = (t: string) =>
  t.length <= 14 && /^[~≈<>+\-–]?[$€£]?\d[\d.,]*(\s?[-–]\s?[$€£]?\d[\d.,]*)?\s?(%|x|×|k|m|b|t|\+|s|ms|min|sec|h|d)?\+?$/i.test(t)
/** "The Headed Solution:" — a label line with nothing after the colon. */
const isLabelLine = (t: string) => t.length <= 40 && /^[A-ZÆØÅÄÖÜ][^:.!?]+:$/.test(t)
const STOP = new Set(['a', 'an', 'the', 'of', 'and', 'or', 'to', 'in', 'on', 'for', 'vs', 'vs.', 'with', 'at', 'by', 'from', 'og', 'i', 'på', 'til', 'av', 'med', 'och', 'att', 'und', 'der', 'die', 'das', 'für', 'mit', 'von'])
function isTitleCase(t: string): boolean {
  if (t.length > 70 || /[.!?:;,]$/.test(t) || !/^[A-ZÆØÅÄÖÜ]/.test(t)) return false
  const words = t.split(/\s+/)
  if (words.length < 2 || words.length > 10) return false
  return words.every((w) => /^[A-ZÆØÅÄÖÜ0-9]/.test(w) || STOP.has(w.toLowerCase()))
}
const LEAD_IN = /^([A-ZÆØÅÄÖÜ][^:.!?]{1,40}):\s+(\S.*)$/

function looksMigrated(blocks: unknown[]): boolean {
  if (blocks.length < 12) return false
  return blocks.every(
    (b) =>
      isTextBlock(b) &&
      (b.style === 'normal' || b.style === 'blockquote' || !b.style) &&
      !b.listItem &&
      (!b.markDefs || b.markDefs.length === 0) &&
      (b.children ?? []).every((c) => !c.marks || c.marks.length === 0)
  )
}

const span = (key: string, text: string, marks: string[] = []): Span => ({ _type: 'span', _key: key, text, marks })
const withChildren = (b: TextBlock, children: Span[], style = b.style): TextBlock => ({ ...b, style, markDefs: b.markDefs ?? [], children })

/** Tidy a migrated plain-paragraph body; other bodies come back untouched. */
export function normalizeBody(body: unknown): unknown[] {
  if (!Array.isArray(body)) return []
  if (!looksMigrated(body)) return body
  const blocks = body as TextBlock[]
  const out: unknown[] = []
  let i = 0
  while (i < blocks.length) {
    const b = blocks[i]
    const text = textOf(b).replace(/\*\*/g, '').trim()

    // Table: two or more consecutive tab-separated rows with the same width.
    if (b.style !== 'blockquote' && text.includes('\t')) {
      const cols = text.split('\t').length
      const rows: string[][] = []
      let j = i
      while (j < blocks.length) {
        const t = textOf(blocks[j]).replace(/\*\*/g, '').trim()
        if (!t.includes('\t') || t.split('\t').length !== cols) break
        rows.push(t.split('\t').map((c) => c.trim()))
        j++
      }
      if (rows.length >= 2) {
        out.push({ _type: 'postTable', _key: `${b._key}-table`, rows } satisfies MigratedTable)
        i = j
        continue
      }
    }

    // Stats: a short number followed by its ALL CAPS label, one or more times.
    if (b.style !== 'blockquote' && isStatValue(text)) {
      const stats: { value: string; label: string }[] = []
      let j = i
      while (j + 1 < blocks.length) {
        const value = textOf(blocks[j]).trim()
        const label = textOf(blocks[j + 1]).trim()
        if (!isStatValue(value) || !(isAllCaps(label) && label.length <= 48)) break
        stats.push({ value, label })
        j += 2
      }
      if (stats.length > 0) {
        out.push({ _type: 'postStats', _key: `${b._key}-stats`, stats } satisfies MigratedStats)
        i = j
        continue
      }
    }

    if (b.style === 'blockquote' || !text) {
      out.push(withChildren(b, [span(`${b._key}-0`, text)]))
      i++
      continue
    }

    // Headings: ALL CAPS lines are sections, Title Case lines before a paragraph are subsections.
    if (isAllCaps(text)) {
      out.push(withChildren(b, [span(`${b._key}-0`, text)], 'h2'))
      i++
      continue
    }
    const next = blocks[i + 1]
    if (isTitleCase(text) && next && textOf(next).trim().length > 80) {
      out.push(withChildren(b, [span(`${b._key}-0`, text)], 'h3'))
      i++
      continue
    }

    // "The Headed Solution:" label lines and "The Reality: ..." lead-ins get a bold lead.
    if (isLabelLine(text)) {
      out.push(withChildren(b, [span(`${b._key}-0`, text, ['strong'])], 'normal'))
      i++
      continue
    }
    const lead = text.match(LEAD_IN)
    if (lead && lead[1].split(/\s+/).length <= 5) {
      out.push(withChildren(b, [span(`${b._key}-0`, `${lead[1]}:`, ['strong']), span(`${b._key}-1`, ` ${lead[2]}`)], 'normal'))
      i++
      continue
    }

    out.push(withChildren(b, [span(`${b._key}-0`, text)], 'normal'))
    i++
  }
  return out
}

/**
 * Give every section heading (gradient titles and h2 blocks) a stable id and
 * collect them for the table of contents. Runs once per page so the TOC and
 * the rendered headings agree.
 */
export function prepareContent(content: PostBlock[] | null | undefined): { blocks: PreparedBlock[]; outline: OutlineItem[] } {
  const used = new Map<string, number>()
  const outline: OutlineItem[] = []
  const uid = (title: string) => {
    const base = slugify(title) || 'section'
    const n = used.get(base) ?? 0
    used.set(base, n + 1)
    return n ? `${base}-${n + 1}` : base
  }

  const blocks = (Array.isArray(content) ? content : []).map((block): PreparedBlock => {
    if (block._type === 'gradientTitleBlock') {
      const title = block.title?.trim()
      if (!title) return block
      const id = uid(title)
      outline.push({ id, title })
      return { ...block, headingId: id }
    }
    if (block._type === 'richTextBlock') {
      const body = normalizeBody(block.body).map((b) => {
        if (!isTextBlock(b) || b.style !== 'h2') return b
        const title = textOf(b).trim()
        if (!title) return b
        const id = uid(title)
        outline.push({ id, title })
        return { ...b, headingId: id }
      })
      return { ...block, body }
    }
    return block
  })

  return { blocks, outline }
}

/** Text of the first paragraph, used to drop a lead that just repeats it. */
export function firstParagraphText(blocks: PreparedBlock[]): string {
  for (const block of blocks) {
    if (block._type !== 'richTextBlock' || !Array.isArray(block.body)) continue
    for (const b of block.body) {
      const t = textOf(b).trim()
      if (t) return t
    }
  }
  return ''
}
