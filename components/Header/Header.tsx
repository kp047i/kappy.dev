import Image from "next/image";
import Link from "next/link";

export function Header() {
  return (
    <header className="flex items-center justify-between p-4 lg:p-8 ">
      <Link href="/" className="group flex items-center gap-3 cursor-pointer">
        <Image
          src="https://res.cloudinary.com/dlibdyano/image/upload/v1675685454/kp047i/avator.png"
          alt="kappyこのサイトのロゴ。"
          width={32}
          height={32}
          className="rounded-full"
        />
        <span className="text-lg font-semibold tracking-tight opacity-70 transition-all duration-200 ease-in-out group-hover:opacity-100">
          kappy.dev
        </span>
      </Link>
      <ul className="flex gap-2">
        <Link
          href="/blog"
          className="cursor-pointer p-1 transition-all duration-200 ease-in-out opacity-70 hover:opacity-100"
        >
          Blog
        </Link>
      </ul>
    </header>
  );
}
