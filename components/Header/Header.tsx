import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

type HeaderProps = {
  actionSlot?: ReactNode;
};

export function Header({ actionSlot }: HeaderProps) {
  return (
    <header className="flex items-center justify-between p-4 lg:p-8">
      <Link href="/" className="group flex cursor-pointer items-center gap-3">
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
      <nav className="flex items-center gap-3">
        <Link
          href="/blog"
          className="cursor-pointer rounded-md px-2 py-1 text-sm font-medium text-base-800 transition-colors duration-200 ease-in-out hover:bg-primary-50 hover:text-secondary-950 dark:text-base-100 dark:hover:bg-base-800/70 dark:hover:text-base-50"
        >
          Blog
        </Link>
        <Link
          href="/about"
          className="cursor-pointer rounded-md px-2 py-1 text-sm font-medium text-base-800 transition-colors duration-200 ease-in-out hover:bg-primary-50 hover:text-secondary-950 dark:text-base-100 dark:hover:bg-base-800/70 dark:hover:text-base-50"
        >
          About
        </Link>
        {actionSlot ? <div className="pl-1">{actionSlot}</div> : null}
      </nav>
    </header>
  );
}
