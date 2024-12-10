import Rss from "rss";

import { getBlogPostList } from "../../features/blog/utils";

export const revalidate = 60 * 60 * 24 * 1;

export async function GET() {
  const posts = await getBlogPostList();
  const feed = new Rss({
    title: "kappy.dev",
    description: "kappyのブログサイト",
    feed_url: "https://kappy.dev/rss.xml",
    site_url: "https://kappy.dev",
    language: "ja",
  });

  posts.forEach((post) => {
    feed.item({
      title: post.metadata.title,
      description: post.metadata.description,
      url: `https://kappy.dev/blog/${post.slug}`,
      date: post.metadata.publishedAt,
    });
  });

  return new Response(feed.xml(), {
    headers: {
      "Content-Type": "text/xml",
    },
  });
}
