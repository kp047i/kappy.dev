import { MDXContent } from "mdx/types";
import path from "path";

import {
  assertValidMetadata,
  BlogFilterOptions,
  filterAndSortPosts,
} from "./filter";
import { Metadata } from "./type";
import { Post } from "./type";

type MDXModule = {
  metadata: Metadata;
  default: MDXContent;
};

const postModules = import.meta.glob("./posts/*.mdx", {
  eager: true,
}) as Record<string, MDXModule>;

function getMDXData(): Post[] {
  return Object.entries(postModules).map(
    ([filePath, { metadata, default: content }]) => {
      const slug = path.basename(filePath, path.extname(filePath));

      assertValidMetadata(metadata);

      return {
        metadata,
        slug,
        content,
      };
    }
  );
}

export async function getBlogPostList(options: BlogFilterOptions = {}) {
  return filterAndSortPosts(getMDXData(), options);
}

export async function getBlogPost(slug: string) {
  return (await getBlogPostList()).find((post) => post.slug === slug);
}
