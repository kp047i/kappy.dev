import type { MetadataRoute } from "next";

import { getBlogPostList } from "@/features/blog/utils";

const endpoint = "https://www.kappy.dev";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getBlogPostList();
  return [
    {
      url: endpoint,
    },
    {
      url: `${endpoint}/blog`,
    },
    ...posts.map((post) => ({
      url: `${endpoint}/blog/${post.slug}`,
    })),
  ];
}
