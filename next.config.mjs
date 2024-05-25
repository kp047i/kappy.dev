/** @type {import('next').NextConfig} */
import createMDX from "@next/mdx";

const nextConfig = {
  images: {
    unoptimized: true,
  },
  pageExtensions: ["tsx", "mdx"],
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
});

export default withMDX(nextConfig);
