import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

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
      <nav className="flex gap-2">
        <Link
          href="/blog"
          className="cursor-pointer rounded-md px-2 py-1 text-sm font-medium text-zinc-700 transition-colors duration-200 ease-in-out hover:bg-zinc-100 hover:text-zinc-900"
        >
          Blog
        </Link>
        <Link
          href="/about"
          className="cursor-pointer rounded-md px-2 py-1 text-sm font-medium text-zinc-700 transition-colors duration-200 ease-in-out hover:bg-zinc-100 hover:text-zinc-900"
        >
          About
        </Link>
      </nav>
    </header>
  );
}

type HeaderLinkItemProps = {
  children: ReactNode;
};

function HeaderLinkItem({ children }: HeaderLinkItemProps) {
  return (
    <Link
      href="/about"
      className="cursor-pointer rounded-md px-2 py-1 text-sm font-medium text-zinc-700 transition-colors duration-200 ease-in-out hover:bg-zinc-100 hover:text-zinc-900"
    >
      {children}
    </Link>
  );
}
