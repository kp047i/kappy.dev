import { Metadata } from "next";
import { notFound } from "next/navigation";

import { BlogCategory } from "@/features/blog/components/BlogCategory/BlogCategory";
import { getBlogPostList, getBlogPost } from "@/features/blog/utils";

export async function generateStaticParams() {
  const posts = await getBlogPostList();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export const generateMetadata = async ({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata | undefined> => {
  const post = await getBlogPost(params.slug);

  if (!post) {
    return;
  }

  const { title, description, slug } = post.metadata;

  const ogImage = `${process.env.NEXT_PUBLIC_SITE_URL}/blog/og/${slug}`;

  return {
    title: {
      template: `kappy.dev | ${title}`,
      default: title,
    },
    description,
    openGraph: {
      title,
      description,
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${slug}`,
      type: "article",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      title,
      description,
      card: "summary_large_image",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      creator: "@kp047i",
      creatorId: "kp047i",
      site: "@kp047i",
    },
  };
};

export default async function BlogPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getBlogPost(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <article>
      <div className="space-y-4">
        <p className="text-sm text-center opacity-60">
          {post.metadata.publishedAt}
        </p>
        <h1 className="text-2xl font-bold text-center lg:text-3xl">
          {post.metadata.title}
        </h1>
        <BlogCategory category={post.metadata.category} />
        <p className="mt-8">{post.metadata.description}</p>
      </div>
      <div className="mt-20 prose-sm prose lg:prose-lg prose-headings:text-secondary-950 prose-p:mb-12 prose-p:text-secondary-950 prose-p:text-opacity-80 prose-a:text-primary-700 prose-li:text-secondary-950 prose-li:text-opacity-80">
        {post.content({})}
      </div>
    </article>
  );
}
