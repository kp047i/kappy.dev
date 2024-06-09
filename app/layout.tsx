import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";

import { ClientLayout } from "./_components/ClientLayout/ClientLayout";
import { Footer } from "./_components/Footer/Footer";
import { Header } from "./_components/Header/Header";

const noto = Noto_Sans_JP({ weight: ["500", "700"], subsets: ["latin"] });

export const metadata: Metadata = {
  title: "kappy.dev",
  description: "kappyのブログサイト",
  openGraph: {
    title: "kappy.dev",
    type: "website",
    url: "https://kappy.dev",
    images: [
      {
        url: "https://res.cloudinary.com/dlibdyano/image/upload/v1675685454/kp047i/avator.png",
        width: 423,
        height: 423,
        alt: "kappy.dev",
      },
    ],
  },
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
