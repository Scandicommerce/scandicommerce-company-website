import { getBlockKey, isPostBlock } from '@/lib/blogBuilder'
import type { PreparedBlock } from './outline'
import KeyTakeaways from './KeyTakeaways'
import StatsRow from './StatsRow'
import TableBlock from './TableBlock'
import ComparisonCards from './ComparisonCards'
import Callout from './Callout'
import ProsCons from './ProsCons'
import CodeBlock from './CodeBlock'
import FAQ from './FAQ'
import CTA from './CTA'
import GradientTitle from './GradientTitle'
import ImageBlock from './ImageBlock'
import DividerBlock from './DividerBlock'
import RichTextBlock from './RichTextBlock'
import VideoBlock from './VideoBlock'

interface BlogContentProps {
  /** Blocks from `prepareContent`, so headings already carry their ids. */
  blocks: PreparedBlock[]
  language?: string
}

/** The reading column: every page-builder block in order, on one vertical rhythm. */
export default function BlogContent({ blocks, language = 'no' }: BlogContentProps) {
  if (blocks.length === 0) return null

  return (
    <div className="flex flex-col gap-8 lg:gap-10">
      {blocks.map((block) => {
        if (!isPostBlock(block)) return null
        const key = getBlockKey(block)

        switch (block._type) {
          case 'richTextBlock':
            return <RichTextBlock key={key} block={block} />
          case 'keyTakeawaysBlock':
            return <KeyTakeaways key={key} block={block} />
          case 'statsRowBlock':
            return <StatsRow key={key} block={block} />
          case 'tableBlock':
            return <TableBlock key={key} block={block} />
          case 'comparisonCardsBlock':
            return <ComparisonCards key={key} block={block} />
          case 'calloutBlock':
            return <Callout key={key} block={block} language={language} />
          case 'prosConsBlock':
            return <ProsCons key={key} block={block} />
          case 'codeBlock':
            return <CodeBlock key={key} block={block} />
          case 'faqBlock':
            return <FAQ key={key} block={block} />
          case 'ctaBlock':
            return <CTA key={key} block={block} />
          case 'gradientTitleBlock':
            return <GradientTitle key={key} block={block} id={block.headingId} />
          case 'imageBlock':
            return <ImageBlock key={key} block={block} />
          case 'dividerBlock':
            return <DividerBlock key={key} block={block} />
          case 'videoBlock':
            return <VideoBlock key={key} block={block} />
          default:
            return null
        }
      })}
    </div>
  )
}
