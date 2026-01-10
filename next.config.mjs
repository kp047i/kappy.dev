/** @type {import('next').NextConfig} */
import createMDX from "@next/mdx";
import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";

const nextConfig = {
  images: {
    unoptimized: true,
  },
  pageExtensions: ["tsx", "mdx", "ts"],
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      [
        rehypePrettyCode,
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
