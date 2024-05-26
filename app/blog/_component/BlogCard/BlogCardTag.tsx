import Link from "next/link";
import { FaHashtag } from "react-icons/fa6";
export default function BlogCardTag({ tag }: { tag: string }) {
  return (
    <Link
      href={`/blog?tag=${tag}`}
      className="flex items-center px-2 py-1 space-x-1 transition-all border text-primary-700 border-primary-700 rounded-xl hover:bg-primary-700 hover:text-secondary-950"
    >
      <FaHashtag />
      <span>{tag}</span>
    </Link>
  );
}
