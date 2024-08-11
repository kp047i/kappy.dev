import Link from "next/link";

import { CATEGORIES } from "../../_const/categories";

export function BlogCategoryTab({
  selectedCategory,
}: Readonly<{
  selectedCategory: string;
}>) {
  return (
    <nav className="flex justify-center space-x-4">
      <Link
        href="/blog"
        className={`${
          selectedCategory === ""
            ? "text-primary-700"
            : "text-secondary-950 opacity-60 hover:opacity-100"
        }`}
      >
        All
      </Link>
      {CATEGORIES.map((category) => (
        <Link
          key={category.key}
          href={`/blog?category=${category.key}`}
          className={`${
            selectedCategory === category.key
              ? "text-primary-700"
              : "text-secondary-950 opacity-60 hover:opacity-100"
          }`}
        >
          {category.label}
        </Link>
      ))}
    </nav>
  );
}
