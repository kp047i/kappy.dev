import clsx from "clsx";
import Link from "next/link";

import { CATEGORIES } from "../../const/categories";

export function BlogCategoryTab({
  selectedCategory,
}: Readonly<{
  selectedCategory: string;
}>) {
  return (
    <nav className="flex justify-center space-x-4">
      <Link
        href="/blog"
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
          href={`/blog?category=${category.key}`}
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
