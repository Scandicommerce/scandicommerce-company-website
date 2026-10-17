import type { RichTextBlock as RichTextBlockType } from '@/lib/blogBuilder'
import PostPortableText from './PostPortableText'

interface RichTextBlockProps {
  block: RichTextBlockType
}

export default function RichTextBlock({ block }: RichTextBlockProps) {
  const body = block.body
  if (!Array.isArray(body) || body.length === 0) return null
  return <PostPortableText value={body} />
}
