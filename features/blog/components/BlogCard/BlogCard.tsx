import Link from "next/link";

import { Post } from "../../type";
import { BlogCategory } from "../BlogCategory/BlogCategory";

export type BlogCardProps = Pick<Post, "metadata">;

export function BlogCard({ metadata }: BlogCardProps) {
  return (
    <div className="space-y-4 rounded-xl transition-colors duration-200">
      <div className="flex items-center space-x-4">
        <span className="text-3xl">{metadata.emoji}</span>
        <div className="space-y-2">
          <Link
            href={`/blog/${metadata.slug}`}
            className="text-xl font-semibold text-secondary-950 transition-colors hover:underline dark:text-base-50"
          >
            {metadata.title}
          </Link>
          <p className="text-secondary-950 opacity-80 dark:text-base-100">
            {metadata.publishedAt}
          </p>
        </div>
      </div>
      <p className="text-base-800 dark:text-base-100">{metadata.description}</p>
      <div className="flex items-end justify-between space-y-2 text-sm font-medium text-primary-700 dark:text-primary-300">
        <BlogCategory category={metadata.category} />
        <div>
          <Link
            href={`/blog/${metadata.slug}`}
            className="hover:underline dark:text-primary-300"
          >
            続きを読む
          </Link>
        </div>
      </div>
    </div>
  );
}
