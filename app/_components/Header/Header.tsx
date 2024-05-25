import Image from "next/image";
import Link from "next/link";

export function Header() {
  return (
    <header className="flex items-center justify-between p-4 lg:p-8 ">
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
          className="p-1 transition-all duration-200 ease-in-out opacity-70 hover:opacity-100"
        >
          Blog
        </Link>
      </ul>
    </header>
  );
}
