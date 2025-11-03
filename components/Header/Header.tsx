import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

type HeaderProps = {
  actionSlot?: ReactNode;
};

export function Header({ actionSlot }: HeaderProps) {
  const navLinkClass =
    "cursor-pointer rounded-md text-sm font-medium  opacity-70 transition-all duration-200 ease-in-out hover:opacity-100 dark:text-base-50";

  return (
    <header className="flex justify-between items-center p-4 lg:p-8">
      <Link href="/" className="flex gap-3 items-center cursor-pointer group">
        <Image
          src="https://res.cloudinary.com/dlibdyano/image/upload/v1675685454/kp047i/avator.png"
          alt="kappyこのサイトのロゴ。"
          width={32}
          height={32}
          className="rounded-full"
        />
        <span className="text-lg font-semibold tracking-tight opacity-70 transition-all duration-200 ease-in-out group-hover:opacity-100 dark:text-base-50">
          kappy.dev
        </span>
      </Link>
      <nav className="flex gap-3 items-center">
        <Link
          href="/blog"
          className={navLinkClass}
        >
          Blog
        </Link>
        <Link
          href="/about"
          className={navLinkClass}
        >
          About
        </Link>
        {actionSlot ? <div className="pl-1">{actionSlot}</div> : null}
      </nav>
    </header>
  );
}
