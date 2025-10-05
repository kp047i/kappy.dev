import Link from "next/link";
import { FaHashtag } from "react-icons/fa6";
export default function BlogCardTag({ tag }: { tag: string }) {
  return (
    <Link
      href={`/blog?tag=${tag}`}
      className="flex items-center space-x-1 rounded-xl border border-primary-700 px-2 py-1 text-primary-700 transition-colors hover:bg-primary-700 hover:text-secondary-950 dark:border-primary-400 dark:text-primary-200 dark:hover:bg-primary-400 dark:hover:text-base-950"
    >
      <FaHashtag />
      <span>{tag}</span>
    </Link>
  );
}
