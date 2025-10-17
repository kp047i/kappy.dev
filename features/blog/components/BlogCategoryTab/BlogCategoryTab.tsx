import clsx from "clsx";
import Link from "next/link";

import { CATEGORIES } from "../../const/categories";

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

export function BlogCategoryTab({
  selectedCategory,
  selectedTag,
}: Readonly<{
  selectedCategory: string;
  selectedTag: string;
}>) {
  return (
    <nav className="flex justify-center space-x-4">
      <Link
        href={buildHref({ tag: selectedTag || undefined })}
        className={clsx(
          "text-sm font-medium transition-colors",
          selectedCategory === ""
            ? "text-primary-700 dark:text-primary-200"
            : "text-secondary-950 opacity-60 hover:opacity-100 dark:text-base-100 dark:hover:text-base-50"
        )}
      >
        All
      </Link>
      {CATEGORIES.map((category) => (
        <Link
          key={category.key}
          href={buildHref({
            category: category.key,
            tag: selectedTag || undefined,
          })}
          className={clsx(
            "text-sm font-medium transition-colors",
            selectedCategory === category.key
              ? "text-primary-700 dark:text-primary-200"
              : "text-secondary-950 opacity-60 hover:opacity-100 dark:text-base-100 dark:hover:text-base-50"
          )}
        >
          {category.label}
        </Link>
      ))}
    </nav>
  );
}
