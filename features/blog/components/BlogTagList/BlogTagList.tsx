import clsx from "clsx";
import Link from "next/link";

import { TAGS } from "../../const/tags";

type BlogTagListProps = {
  selectedTag: string;
  selectedCategory: string;
};

function buildHref({
  category,
  tag,
}: {
  category?: string;
  tag?: string;
}) {
  const params = new URLSearchParams();

  if (category) {
    params.set("category", category);
  }

  if (tag) {
    params.set("tag", tag);
  }

  const query = params.toString();
  return query ? `/blog?${query}` : "/blog";
}

export function BlogTagList({
  selectedTag,
  selectedCategory,
}: Readonly<BlogTagListProps>) {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      <Link
        href={buildHref({ category: selectedCategory })}
        className={clsx(
          "inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 dark:border-primary-300/40",
          selectedTag === ""
            ? "border-transparent bg-primary-700 text-base-50 dark:bg-primary-300 dark:text-base-900"
            : "border-primary-200 text-primary-700 hover:bg-primary-50 dark:text-primary-200 dark:hover:bg-primary-300/10"
        )}
      >
        すべてのタグ
      </Link>
      {TAGS.map((tag) => (
        <Link
          key={tag.key}
          href={buildHref({ category: selectedCategory, tag: tag.key })}
          className={clsx(
            "inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 dark:border-primary-300/40",
            selectedTag === tag.key
              ? "border-transparent bg-primary-700 text-base-50 dark:bg-primary-300 dark:text-base-900"
              : "border-primary-200 text-primary-700 hover:bg-primary-50 dark:text-primary-200 dark:hover:bg-primary-300/10"
          )}
        >
          #{tag.label}
        </Link>
      ))}
    </div>
  );
}
