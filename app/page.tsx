import Image from "next/image";
import Link from "next/link";
import { FaGithub } from "react-icons/fa6";
import { FaXTwitter } from "react-icons/fa6";

import { BlogCard } from "./blog/_components/BlogCard/BlogCard";
import { getBlogPostList } from "./blog/utils";

export default async function Home() {
  const latestPosts = (await getBlogPostList()).slice(0, 3);

  return (
    <div className="space-y-24">
      <section className="space-y-20">
        <h1 className="text-3xl font-bold text-secondary-950">kappy.dev</h1>
        <div className="flex flex-col items-center justify-center gap-16">
          <Image
            src="https://res.cloudinary.com/dlibdyano/image/upload/v1675685454/kp047i/avator.png"
            alt="kappyこのサイトのロゴ。"
            width={128}
            height={128}
            className="rounded-full"
          />

          <div className="flex gap-8">
            <Link href="https://github.com/kp047i">
              <FaGithub className="w-8 h-8 transition-all duration-200 ease-in-out opacity-70 hover:opacity-100" />
            </Link>
            <Link href="https://twitter.com/kp047i" className="w-8 h-8">
              <FaXTwitter className="w-8 h-8 transition-all duration-200 ease-in-out opacity-70 hover:opacity-100" />
            </Link>
          </div>
        </div>
      </section>

      <section>
        <div className="flex flex-col gap-8">
          <h2 className="text-2xl font-bold text-secondary-950">Blog</h2>
          <p className="text-lg text-secondary-950 opacity-80">最新の記事</p>

          <div className="space-y-12">
            {latestPosts.map((post) => (
              <BlogCard key={post.slug} metadata={post.metadata} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
