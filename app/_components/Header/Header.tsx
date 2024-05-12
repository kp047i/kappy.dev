import Image from "next/image";
import Link from "next/link";
import { RiPagesLine } from "react-icons/ri";

export function Header() {
  return (
    <header className="mx-auto flex max-w-3xl items-center justify-between p-4">
      <Link href="/" className="flex gap-2">
        <Image
          src="https://res.cloudinary.com/dlibdyano/image/upload/v1675685454/kp047i/avator.png"
          alt="kappyこのサイトのロゴ。"
          width={32}
          height={32}
          className="rounded-full"
        />
      </Link>
      <ul className="flex gap-2">
        <Link
          href="/blog"
          className="p-1 opacity-70 transition-all duration-200 ease-in-out hover:opacity-100"
        >
          Blog
        </Link>
      </ul>
    </header>
  );
}
