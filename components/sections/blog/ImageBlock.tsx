"use client";

import Image from "next/image";
import type { ImageBlock as ImageBlockType } from "@/lib/blogBuilder";
import { urlFor } from "@/sanity/lib/image";

interface ImageBlockProps {
  block: ImageBlockType;
}

export default function ImageBlock({ block }: ImageBlockProps) {
  const image = block.image;
  const asset = image?.asset as { url?: string; _id?: string } | undefined;
  const url = asset?.url;
  const alt = block.alt ?? (image as { alt?: string })?.alt ?? "";
  const caption = block.caption ?? (image as { caption?: string })?.caption;

  if (!image) return null;

  const src = url ?? urlFor(image).width(1200).url();
  if (!src) return null;

  return (
    <figure className="my-8 md:my-10">
      <div className="relative w-full aspect-video max-h-[500px] rounded-lg overflow-hidden bg-gray-100">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 900px"
        />
      </div>
      {caption && (
        <figcaption className="mt-2 text-center text-sm text-gray-500">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
