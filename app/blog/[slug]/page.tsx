import { Metadata } from "next";
import { notFound } from "next/navigation";

import { BlogCategory } from "@/features/blog/components/BlogCategory/BlogCategory";
import { BlogTag } from "@/features/blog/components/BlogTag/BlogTag";
import { getBlogPostList, getBlogPost } from "@/features/blog/utils";

export async function generateStaticParams() {
  const posts = await getBlogPostList();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export const generateMetadata = async (props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata | undefined> => {
  const params = await props.params;
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

export default async function BlogPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const post = await getBlogPost(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <article>
      <div className="space-y-4">
        <p className="text-sm text-center opacity-60 dark:text-base-100">
          {post.metadata.publishedAt}
        </p>
        <h1 className="text-center text-2xl font-bold text-secondary-950 dark:text-base-50 lg:text-3xl">
          {post.metadata.title}
        </h1>
        <div className="flex flex-col items-center gap-4">
          <BlogCategory category={post.metadata.category} />
          {post.metadata.tags.length > 0 ? (
            <div className="flex flex-wrap justify-center gap-2">
              {post.metadata.tags.map((tag) => (
                <BlogTag key={tag} tag={tag} size="md" />
              ))}
            </div>
          ) : null}
        </div>
      </div>
      <div className="prose custom-prose prose-sm mt-20 text-secondary-950 dark:text-base-100 lg:prose-lg dark:[&_p]:!text-base-50 dark:[&_li]:!text-base-50 dark:[&_strong]:!text-base-50 dark:[&_em]:!text-base-50">
        <p>{post.metadata.description}</p>
      </div>
      <div className="prose custom-prose prose-sm mt-20 lg:prose-lg prose-p:mb-12 prose-img:rounded-2xl prose-blockquote:border-l-4 prose-blockquote:border-primary-200 prose-blockquote:pl-4 dark:prose-a:text-primary-300 dark:prose-blockquote:border-primary-400/60 dark:prose-pre:bg-base-900 dark:prose-pre:text-base-50 dark:[&_p]:!text-base-50 dark:[&_li]:!text-base-50 dark:[&_strong]:!text-base-50 dark:[&_em]:!text-base-50">
        {post.content({})}
      </div>
    </article>
  );
}
