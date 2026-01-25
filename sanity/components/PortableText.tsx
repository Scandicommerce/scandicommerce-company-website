"use client";

import {
  PortableText as PortableTextComponent,
  type PortableTextReactComponents,
} from "@portabletext/react";
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "../lib/image";

const components: Partial<PortableTextReactComponents> = {
  types: {
    image: ({ value }) => {
      if (!value?.asset?._ref) {
        return null;
      }
      return (
        <figure className="my-8">
          <Image
            src={urlFor(value).width(1200).url()}
            alt={value.alt || ""}
            width={1200}
            height={675}
            className="rounded-lg"
          />
          {value.caption && (
            <figcaption className="mt-2 text-center text-sm text-gray-500 font-sans">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
    codeBlock: ({ value }) => (
      <pre className="my-4 overflow-x-auto rounded-lg bg-gray-900 p-4 font-mono">
        <code className={`language-${value.language || "text"} font-mono text-sm`}>
          {value.code}
        </code>
      </pre>
    ),
    videoEmbed: ({ value }) => {
      const getEmbedUrl = (url: string) => {
        if (url.includes("youtube.com") || url.includes("youtu.be")) {
          const videoId = url.includes("youtu.be")
            ? url.split("/").pop()
            : new URL(url).searchParams.get("v");
          return `https://www.youtube.com/embed/${videoId}`;
        }
        if (url.includes("vimeo.com")) {
          const videoId = url.split("/").pop();
          return `https://player.vimeo.com/video/${videoId}`;
        }
        return url;
      };

      return (
        <figure className="my-8">
          <div className="relative aspect-video">
            <iframe
              src={getEmbedUrl(value.url)}
              className="absolute inset-0 h-full w-full rounded-lg"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </div>
          {value.caption && (
            <figcaption className="mt-2 text-center text-sm text-gray-500 font-sans">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
  },
  marks: {
    link: ({ children, value }) => {
      const rel = !value.href.startsWith("/")
        ? "noreferrer noopener"
        : undefined;
      const target = value.blank ? "_blank" : undefined;
      
      return (
        <Link
          href={value.href}
          rel={rel}
          target={target}
          className="text-primary hover:underline font-sans"
        >
          {children}
        </Link>
      );
    },
    code: ({ children }) => (
      <code className="rounded bg-gray-100 px-2 py-1 font-mono text-sm">
        {children}
      </code>
    ),
    // Custom mark for technical terms
    tech: ({ children }) => (
      <span className="font-mono font-semibold">{children}</span>
    ),
  },
  block: {
    h1: ({ children }) => (
      <h1 className="mb-6 mt-10 text-5xl font-bold font-sans tracking-tight">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="mb-4 mt-8 text-4xl font-semibold font-sans tracking-tight">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="mb-3 mt-6 text-2xl font-semibold font-sans">{children}</h3>
    ),
    h4: ({ children }) => (
      <h4 className="mb-2 mt-4 text-xl font-semibold font-sans">{children}</h4>
    ),
    normal: ({ children }) => <p className="mb-4 leading-relaxed font-sans text-base">{children}</p>,
    blockquote: ({ children }) => (
      <blockquote className="my-6 border-l-4 border-primary pl-4 italic font-sans">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mb-4 ml-6 list-disc space-y-2 font-sans">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="mb-4 ml-6 list-decimal space-y-2 font-sans">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="font-sans">{children}</li>,
    number: ({ children }) => <li className="font-sans">{children}</li>,
  },
};

interface PortableTextProps {
  value: any;
  className?: string;
}

export function PortableText({ value, className }: PortableTextProps) {
  return (
    <div className={className}>
      <PortableTextComponent value={value} components={components} />
    </div>
  );
}
