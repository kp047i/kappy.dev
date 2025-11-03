import type { Metadata } from "next";
import Image from "next/image";
import { FaGithub } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export const metadata: Metadata = {
  title: "About | kappy.dev",
  description:
    "三浦鷹将（kappy）の自己紹介。学びや探求、ファシリテーション、エンジニアリングへの関心について紹介します。",
};

export default function AboutPage() {
  return (
    <div className="space-y-16">
      <section className="rounded-3xl transition-colors border-secondary-100/60 bg-primary-50/80 dark:border-base-800/50 dark:bg-base-800/70 dark:shadow-none">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-12">
          <figure className="flex flex-col gap-4 items-center mx-auto text-center lg:mx-0 lg:text-left">
            <Image
              src="https://res.cloudinary.com/dlibdyano/image/upload/v1675685454/kp047i/avator.png"
              alt="三浦鷹将（kappy）のポートレート"
              width={160}
              height={160}
              className="rounded-3xl ring-4 ring-white shadow-md"
              priority
            />
          </figure>
          <div className="space-y-5 text-base leading-relaxed text-base-900 dark:text-base-50">
            <h1 className="text-2xl font-bold text-secondary-950 dark:text-base-50">
              こんにちは、三浦鷹将 / kappyです。
            </h1>
            <p>
              宮城でWebエンジニアをしています。React, TypeScriptが好きです。
            </p>
            <p>
              最近は「学び」や「問い」をテーマに、チームや個人がよりよく学び合える土台をつくることに関心があります。
              コードを書くことも好きですが、「不確実性に対処するために、どうしたら一人ひとりが可能性を発揮できるか」を考えるのも好きです。
            </p>
            <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:gap-4">
              {[
                {
                  href: "https://x.com/kp047i",
                  label: "X (旧Twitter)",
                  icon: <FaXTwitter aria-hidden className="w-4 h-4" />,
                },
                {
                  href: "https://github.com/kp047i",
                  label: "GitHub",
                  icon: <FaGithub aria-hidden className="w-4 h-4" />,
                },
              ].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex gap-2 justify-center items-center px-4 py-2 text-sm font-medium rounded-full border shadow-sm transition-colors border-primary-200 bg-primary-50 text-primary-900 hover:border-primary-300 hover:bg-primary-100 hover:text-primary-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 dark:border-base-700 dark:bg-base-900 dark:text-base-50 dark:hover:border-primary-300 dark:hover:bg-base-800 dark:hover:text-primary-200"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-8">
        <h2 className="text-xl font-semibold text-secondary-950 dark:text-base-50">
          関心・興味
        </h2>
        <ol className="space-y-8">
          {[
            {
              title: "エンジニアリング",
              description:
                "フロントエンドを中心に、使い手や運用者の実感に寄り添ったプロダクトづくりと、チーム開発の土台整備に取り組んでいます。",
            },
            {
              title: "学びの土台づくり",
              description:
                "チームや学習コミュニティが自走できるように、問いの立て方やふりかえりの枠組みをデザインしています。",
            },
            {
              title: "ファシリテーション",
              description:
                "場づくりのファシリテーターとして、対話が深まる構造や余白を設計し、一人ひとりの声が届く状態を目指しています。",
            },
          ].map((area, index) => (
            <li
              key={area.title}
              className="flex flex-col gap-4 sm:flex-row sm:gap-8"
            >
              <span className="text-sm font-semibold uppercase tracking-[0.3em] text-primary-500 dark:text-primary-200">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-secondary-950 dark:text-base-50">
                  {area.title}
                </h3>
                <p className="text-sm leading-relaxed text-base-900 dark:text-base-100">
                  {area.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
