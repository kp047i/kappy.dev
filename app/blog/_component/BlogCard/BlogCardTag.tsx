import Link from "next/link";
import { FaHashtag } from "react-icons/fa6";
export default function BlogCardTag({ tag }: { tag: string }) {
  return (
    <Link
      href={`/blog?tag=${tag}`}
      className="flex items-center px-2 py-1 space-x-1 transition-all border text-primary-300 border-primary-300 rounded-xl hover:bg-primary-300 hover:text-primary-50"
    >
      <FaHashtag />
      <span>{tag}</span>
    </Link>
  );
}
