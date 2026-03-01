/** @type {import('next').NextConfig} */
import createMDX from "@next/mdx";

const nextConfig = {
  images: {
    unoptimized: true,
  },
  pageExtensions: ["tsx", "mdx", "ts"],
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    // Next.js 16 + Turbopack requires serializable plugin config (use package names, not imported functions).
    remarkPlugins: ["remark-gfm"],
    rehypePlugins: [
      [
        "rehype-pretty-code",
        {
          theme: {
            light: "github-light",
            dark: "github-dark",
          },
          keepBackground: true,
          defaultLang: "plaintext",
        },
      ],
    ],
  },
});

export default withMDX(nextConfig);
