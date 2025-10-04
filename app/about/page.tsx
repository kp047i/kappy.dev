import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | kappy.dev",
  description:
    "三浦鷹将（kappy）の自己紹介。学びや探求、ファシリテーション、エンジニアリングへの関心について紹介します。",
};

export default function AboutPage() {
  return (
    <div className="space-y-16">
      <section className="rounded-3xl border border-zinc-200/60 bg-zinc-50/60 p-8 shadow-sm sm:p-12">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-12">
          <figure className="mx-auto flex flex-col items-center gap-4 text-center lg:mx-0 lg:text-left">
            <Image
              src="https://res.cloudinary.com/dlibdyano/image/upload/v1675685454/kp047i/avator.png"
              alt="三浦鷹将（kappy）のポートレート"
              width={160}
              height={160}
              className="rounded-3xl shadow-md ring-4 ring-white"
              priority
            />
          </figure>
          <div className="space-y-5 text-base leading-relaxed text-zinc-700">
            <span className="inline-flex items-center gap-2 bg-primary-50 text-xs font-semibold uppercase tracking-[0.2em] text-primary-700">
              About
            </span>
            <h1 className="text-2xl font-bold text-zinc-900">
              こんにちは、三浦鷹将 / kappyです。
            </h1>
            <p>
              宮城でWebエンジニアをしています。React, TypeScriptが好きです。
            </p>
            <p>
              最近は「学び」や「問い」をテーマに、チームや個人がよりよく学び合える土台をつくることに関心があります。
              コードを書くことも好きですが、「不確実性に対処するために、どうしたら一人ひとりが可能性を発揮できるか」を考えるのも好きです。
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-8">
        <h2 className="text-xl font-semibold text-zinc-900">関心・興味</h2>
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
              <span className="text-sm font-semibold uppercase tracking-[0.3em] text-primary-500">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-zinc-900">
                  {area.title}
                </h3>
                <p className="text-sm leading-relaxed text-zinc-600">
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
