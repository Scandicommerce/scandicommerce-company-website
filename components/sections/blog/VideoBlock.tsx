"use client";

import type { VideoBlock as VideoBlockType } from "@/lib/blogBuilder";

interface VideoBlockProps {
  block: VideoBlockType;
}

export default function VideoBlock({ block }: VideoBlockProps) {
  const url = block.url;
  if (!url) return null;
  const autoplay = !!block.autoplay;

  return (
    <section className="my-8 md:my-12 not-prose">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl bg-black shadow-xl ring-1 ring-black/5">
        <video
          src={url}
          poster={block.poster || undefined}
          controls={!autoplay}
          autoPlay={autoplay}
          muted={autoplay}
          loop={autoplay}
          playsInline
          preload="metadata"
          className="block h-auto w-full"
        />
      </div>
      {block.caption ? (
        <p className="mt-3 text-center text-sm text-[#565454]">{block.caption}</p>
      ) : null}
    </section>
  );
}
