import Link from "next/link";
import { Post } from "../../type";
import { BlogCategory } from "../BlogCategory/BlogCategory";
import { FaAngleRight } from "react-icons/fa6";

export type BlogCardProps = Pick<Post, "metadata">;

export function BlogCard({ metadata }: BlogCardProps) {
  return (
    <div className="space-y-4 transition-allrounded-xl">
      <div className="flex items-center space-x-4">
        <span className="text-3xl">{metadata.emoji}</span>
        <div className="space-y-2">
          <Link
            href={`/blog/${metadata.slug}`}
            className="text-xl font-semibold text-secondary-950 hover:underline"
          >
            {metadata.title}
          </Link>
          <p className="text-secondary-950 opacity-80">
            {metadata.publishedAt}
          </p>
        </div>
      </div>
      <p className="text-gray-700">{metadata.description}</p>
      <div className="flex items-end justify-between space-y-2 text-sm font-medium text-primary-700">
        <BlogCategory category={metadata.category} />
        <div>
          <Link href={`/blog/${metadata.slug}`} className="hover:underline">
            続きを読む
          </Link>
        </div>
      </div>
    </div>
  );
}
