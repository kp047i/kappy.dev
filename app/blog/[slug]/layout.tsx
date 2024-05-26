import Link from "next/link";
import { FaAngleLeft } from "react-icons/fa6";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-12">
      <div className="space-y-8">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 p-1 transition-all duration-200 ease-in-out opacity-70 hover:opacity-100"
        >
          <FaAngleLeft className="w-4 h-4" />
          一覧に戻る
        </Link>
        {children}
      </div>
    </div>
  );
}
