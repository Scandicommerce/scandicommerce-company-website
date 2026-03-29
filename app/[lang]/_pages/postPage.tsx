import HeaderWrapper from "@/components/layout/HeaderWrapper";
import FooterWrapper from "@/components/layout/FooterWrapper";
import { BlogContent } from "@/components/sections/blog";
import ArticleCTA from "@/components/sections/resources/article/ArticleCTA";
import { client } from "@/sanity/lib/client";
import { postBySlugQuery } from "@/sanity/lib/queries";
import { getQueryParams } from "@/sanity/lib/queryHelpers";
import type { Post } from "@/lib/blogBuilder";
import { getLanguageFromParams } from "@/lib/language";
import { notFound } from "next/navigation";
import SchemaMarkup from "@/components/SchemaMarkup";
import {
  buildBlogPostingSchema,
  getSchemaInLanguageTag,
  getSchemaPageUrl,
  getSchemaSiteOrigin,
} from "@/lib/schema";

export default async function PostPage({
  params,
}: {
  params: Promise<{ lang: string; slug?: string }>;
}) {
  const { lang, slug } = await params;
  if (!slug) notFound();
  getLanguageFromParams({ lang });

  const post = await client.fetch<Post | null>(
    postBySlugQuery,
    getQueryParams({ slug }, lang),
    { next: { revalidate: 0 } }
  );
  if (!post) notFound();

  const origin = await getSchemaSiteOrigin();
  const pageUrl = await getSchemaPageUrl();
  const docLang = post.language || lang;
  const keywords =
    post.tags?.map((t) => t.label).filter((label): label is string => Boolean(label && String(label).trim())) ??
    [];
  const blogPostingSchema =
    origin && pageUrl
      ? buildBlogPostingSchema({
          origin,
          url: pageUrl,
          headline: post.title,
          description: post.excerpt ?? null,
          datePublished: post.publishedAt ?? undefined,
          dateModified: post._updatedAt ?? undefined,
          imageUrl: post.image ?? null,
          keywords: keywords.length ? keywords : undefined,
          inLanguage: getSchemaInLanguageTag(
            typeof docLang === "string" ? docLang : lang
          ),
          authorName: null,
        })
      : null;

  const publishedLabel = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <div className="flex flex-col min-h-screen">
      {blogPostingSchema ? <SchemaMarkup schema={blogPostingSchema} /> : null}
      <HeaderWrapper />
      <main className="flex-grow bg-[#EFEFEF]">
        <section className="bg-[#F8F8F8] py-12 lg:py-16 border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1F1D1D] mb-4">
              {post.title}
            </h1>
            {publishedLabel && (
              <p className="text-[#565454] text-sm md:text-base">
                {publishedLabel}
              </p>
            )}
            {post.excerpt && (
              <p className="mt-4 text-[#565454] text-base md:text-lg leading-relaxed max-w-3xl">
                {post.excerpt}
              </p>
            )}
          </div>
        </section>
        <BlogContent content={post.content} />
        <ArticleCTA />
      </main>
      <FooterWrapper />
    </div>
  );
}
