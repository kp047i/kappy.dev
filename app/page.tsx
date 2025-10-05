import Link from "next/link";

import { BlogCard } from "@/features/blog/components/BlogCard/BlogCard";
import { getBlogPostList } from "@/features/blog/utils";

export default async function Home() {
  const latestPosts = (await getBlogPostList()).slice(0, 3);

  return (
    <div className="space-y-16">
      <section>
        <div className="flex flex-col gap-12">
          <h2 className="text-2xl font-bold text-secondary-950 dark:text-base-50">Blog</h2>
          <p className="text-lg text-secondary-950 opacity-80 dark:text-base-100">最新の記事</p>

          <div className="space-y-12">
            {latestPosts.map((post) => (
              <BlogCard key={post.slug} metadata={post.metadata} />
            ))}
          </div>
        </div>
        <div className="mt-12 flex justify-end">
          <Link
            href="/blog"
            aria-label="ブログ記事一覧を見る"
            className="inline-flex items-center gap-2 rounded-full text-sm font-semibold text-primary-700 hover:underline dark:text-primary-300"
          >
            すべての記事を見る
            <span aria-hidden="true" className="text-base">
              →
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
}
