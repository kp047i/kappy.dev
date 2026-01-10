import { Analytics } from "@vercel/analytics/react";
import type { Metadata, Viewport } from "next";
import { Noto_Sans_JP } from "next/font/google";
import Script from "next/script";
import { ThemeProvider } from "next-themes";
import "./globals.css";

import { ClientLayout } from "../components/ClientLayout/ClientLayout";
import { Footer } from "../components/Footer/Footer";
import { Header } from "../components/Header/Header";
import { ThemeToggle } from "../components/ThemeToggle/ThemeToggle";

const noto = Noto_Sans_JP({ weight: ["400", "500", "700"], subsets: ["latin"] });

const themeInitScript = `
(function () {
  try {
    var storageKey = 'theme';
    var documentElement = document.documentElement;
    var storedTheme = localStorage.getItem(storageKey);
    var systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var resolvedTheme = storedTheme === 'light' || storedTheme === 'dark'
      ? storedTheme
      : systemPrefersDark
        ? 'dark'
        : 'light';

    documentElement.classList.remove('light', 'dark');
    documentElement.classList.add(resolvedTheme);
    documentElement.style.colorScheme = resolvedTheme;
  } catch (error) {
    // no-op
  }
})();
`;

export const metadata: Metadata = {
  title: "kappy.dev",
  description: "kappyのブログサイト",
  metadataBase: new URL("https://kappy.dev"),
  applicationName: "kappy.dev",
  keywords: [
    "kappy",
    "ブログ",
    "Webエンジニア",
    "プログラミング",
    "フロントエンド",
  ],
  robots: "index, follow",
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

export const generateViewport = (): Viewport => ({
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f1f5f9" },
    { media: "(prefers-color-scheme: dark)", color: "#030712" },
  ],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <head>
        <Script id="theme-init" strategy="beforeInteractive">
          {themeInitScript}
        </Script>
      </head>
      <body
        className={`${noto.className} mx-auto flex min-h-screen max-w-3xl flex-col`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ClientLayout>
            <Header actionSlot={<ThemeToggle />} />
            <main className="flex flex-col flex-grow gap-12 p-4 my-20">
              {children}
            </main>
            <Footer />
          </ClientLayout>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
