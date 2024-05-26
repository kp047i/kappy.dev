import type { Metadata, Viewport } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import { Header } from "./_components/Header/Header";
import { ClientLayout } from "./_components/ClientLayout/ClientLayout";
import { Footer } from "./_components/Footer/Footer";

const noto = Noto_Sans_JP({ weight: ["500", "700"], subsets: ["latin"] });

export const metadata: Metadata = {
  title: "kappy.dev",
  description: "kappyのポートフォリオ兼ブログサイト",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${noto.className} mx-auto flex min-h-screen max-w-3xl flex-col`}
      >
        <ClientLayout>
          <Header />
          <main className="flex flex-col flex-grow gap-12 p-4 my-20">
            {children}
          </main>
          <Footer />
        </ClientLayout>
      </body>
    </html>
  );
}
