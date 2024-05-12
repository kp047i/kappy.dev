import type { Metadata } from "next";
import { Murecho } from "next/font/google";
import "./globals.css";
import { Header } from "./_components/Header/Header";
import clsx from "clsx";

const murecho = Murecho({ weight: ["500", "700"], subsets: ["latin"] });

export const metadata: Metadata = {
  title: "kappy.me",
  description: "kappyのポートフォリオ兼ブログサイト",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={murecho.className}>
        <Header />
        {children}
      </body>
    </html>
  );
}
