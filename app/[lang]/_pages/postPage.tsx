import HeaderWrapper from "@/components/layout/HeaderWrapper";
import FooterWrapper from "@/components/layout/FooterWrapper";
import { BlogContent } from "@/components/sections/blog";
import { getPostBySlugCached } from "@/lib/sanity/cachedDocuments";
import { type Post } from "@/lib/blogBuilder";
import { getLanguageFromParams } from "@/lib/language";
import { notFound } from "next/navigation";

export default async function PostPage({
  params,
}: {
  params: Promise<{ lang: string; slug?: string }>;
}) {
  const { lang, slug } = await params;
  if (!slug) notFound();
  const language = getLanguageFromParams({ lang });

  const post = (await getPostBySlugCached(slug, language)) as Post | null;
  if (!post) notFound();

  const publishedLabel = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderWrapper />
      <main className="flex-grow bg-[#EFEFEF]">
        <section className="bg-[#F8F8F8] py-12 lg:py-16 border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1F1D1D] mb-4">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[#565454] text-sm md:text-base">
              {post.author?.name && (
                <span className="flex items-center gap-2">
                  {post.author.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={post.author.image} alt={post.author.name} className="w-7 h-7 rounded-full object-cover" />
                  )}
                  <span className="font-medium text-[#1F1D1D]">{post.author.name}</span>
                  {post.author.role && <span className="text-[#565454]">· {post.author.role}</span>}
                </span>
              )}
              {publishedLabel && <span>{publishedLabel}</span>}
            </div>
            {post.excerpt && (
              <p className="mt-4 text-[#565454] text-base md:text-lg leading-relaxed max-w-3xl">
                {post.excerpt}
              </p>
            )}
          </div>
        </section>
        <BlogContent content={post.content} />
      </main>
      <FooterWrapper />
    </div>
  );
}
