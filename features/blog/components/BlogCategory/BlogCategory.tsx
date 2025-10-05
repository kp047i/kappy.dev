import { Metadata } from "next";
import Link from "next/link";
import { FaFolderOpen } from "react-icons/fa6";
import { FaFolderClosed } from "react-icons/fa6";

import { CATEGORIES } from "../../const/categories";

export function BlogCategory({ category }: { category: Metadata["category"] }) {
  return (
    <Link
      href={`/blog?category=${category}`}
      className="group inline-flex items-center gap-2 text-primary-700 opacity-80 transition-colors hover:opacity-100 dark:text-primary-300"
    >
      {/* ホバー時に開いたフォルダを表示、それ以外は閉じたフォルダ */}
      <FaFolderClosed className="transform text-current group-hover:hidden" />
      <FaFolderOpen className="hidden transform text-current group-hover:block group-hover:m-0" />
      <span>{CATEGORIES.find((c) => c.key === category)?.label}</span>
    </Link>
  );
}
