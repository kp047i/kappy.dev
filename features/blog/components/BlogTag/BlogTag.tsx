import clsx from "clsx";
import Link from "next/link";

import { TAGS } from "../../const/tags";

type BlogTagProps = {
  tag: string;
  size?: "sm" | "md";
  className?: string;
};

function getTagLabel(tag: string) {
  return TAGS.find((tagOption) => tagOption.key === tag)?.label ?? tag;
}

export function BlogTag({ tag, size = "sm", className }: BlogTagProps) {
  return (
    <Link
      href={`/blog?tag=${tag}`}
      className={clsx(
        "inline-flex items-center rounded-full border border-primary-200 px-3 py-1 font-medium text-primary-700 transition-colors hover:bg-primary-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 dark:border-primary-300/40 dark:text-primary-200 dark:hover:bg-primary-300/10 dark:focus-visible:ring-primary-300/60",
        size === "md" ? "text-sm" : "text-xs",
        className
      )}
    >
      #{getTagLabel(tag)}
    </Link>
  );
}
