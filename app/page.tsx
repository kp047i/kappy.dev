"use client";

import Image from "next/image";
import { useViewPort } from "./utils/useViewport";
import Link from "next/link";
import { FaGithub } from "react-icons/fa6";
import { FaXTwitter } from "react-icons/fa6";

export default function Home() {
  useViewPort();

  return (
    <main className="mx-auto my-12 flex max-w-3xl flex-col gap-12 p-4">
      <section>
        <h1 className="text-3xl font-bold text-primary-50">kappy.me</h1>

        <div className="flex flex-col items-center justify-center gap-8">
          <Image
            src="https://res.cloudinary.com/dlibdyano/image/upload/v1675685454/kp047i/avator.png"
            alt="kappyこのサイトのロゴ。"
            width={128}
            height={128}
            className="rounded-full"
          />

          {/* githubとxのアイコンを並べる */}
          <div className="flex gap-8">
            <Link href="https://github.com/kp047i">
              <FaGithub className="h-8 w-8 opacity-70 transition-all duration-200 ease-in-out hover:opacity-100" />
            </Link>
            <Link href="https://twitter.com/kp047i" className="h-8 w-8">
              <FaXTwitter className="h-8 w-8 opacity-70 transition-all duration-200 ease-in-out hover:opacity-100" />
            </Link>
          </div>
        </div>
      </section>

      <section>
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold text-primary-50">Blog</h2>
          <p className="text-lg text-primary-50 opacity-70">最新の記事</p>
        </div>
      </section>
    </main>
  );
}
