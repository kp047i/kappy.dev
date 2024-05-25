import { Metadata } from "next";
import { FaFolderOpen } from "react-icons/fa6";
import { FaFolderClosed } from "react-icons/fa6";
import { CATEGORIES } from "../../_const/categories";
import Link from "next/link";

export function BlogCategory({ category }: { category: Metadata["category"] }) {
  return (
    <Link
      href={`/blog?category=${category}`}
      className="inline-flex items-center gap-2 space-x-0 text-primary-300 opacity-80 group"
    >
      {/* ホバー時に開いたフォルダを表示、それ以外は閉じたフォルダ */}
      <FaFolderClosed className="transform group-hover:hidden" />
      <FaFolderOpen className="hidden transform group-hover:block group-hover:m-0" />
      <span>{CATEGORIES.find((c) => c.key === category)?.label}</span>
    </Link>
  );
}
