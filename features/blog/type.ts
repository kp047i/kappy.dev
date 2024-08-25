import { MDXContent } from "mdx/types";

import { CATEGORIES } from "./const/categories";

export type Metadata = {
  title: string;
  slug: string;
  publishedAt: string;
  description: string;
  tags: string[];
  category: (typeof CATEGORIES)[number]["key"];
  emoji?: string;
};

export type Post = {
  metadata: Metadata;
  slug: string;
  content: MDXContent;
};
