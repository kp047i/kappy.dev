import Link from "next/link";
import { FaAngleLeft } from "react-icons/fa6";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.9.0/themes/prism-tomorrow.min.css"
        rel="stylesheet"
      />
      <div className="flex flex-col gap-12">
        <div className="space-y-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 p-1 opacity-70 transition-all duration-200 ease-in-out hover:opacity-100"
          >
            <FaAngleLeft className="h-4 w-4" />
            一覧に戻る
          </Link>
          {children}
        </div>
      </div>
    </>
  );
}
