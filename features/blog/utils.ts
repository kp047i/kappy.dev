import fs from "fs";
import { MDXContent } from "mdx/types";
import path from "path";

import { CATEGORIES } from "./const/categories";
import { TAGS } from "./const/tags";
import { Metadata } from "./type";
import { Post } from "./type";

type BlogFilterOptions = {
  category?: string;
  tag?: string;
};

function getMDXFiles(dir: string) {
  return fs.readdirSync(dir).filter((file) => path.extname(file) === ".mdx");
}

async function getMDXData(dir: string): Promise<Post[]> {
  const mdxFiles = getMDXFiles(dir);

  const result = mdxFiles.map(async (file) => {
    const slug = path.basename(file, path.extname(file));
    const { metadata, content } = await readMDXFile(file);

    if (
      metadata.tags.some((tag) => !TAGS.map((tag) => tag.key).includes(tag))
    ) {
      throw new Error(`Invalid tag: ${metadata.tags}`);
    }

    if (
      !CATEGORIES.map((category) => category.key).includes(metadata.category)
    ) {
      throw new Error(`Invalid category: ${metadata.category}`);
    }

    return {
      metadata,
      slug,
      content,
    };
  });

  return Promise.all(result);
}

async function readMDXFile(fileName: string) {
  const result = await import(`./posts/${fileName}`);
  return {
    metadata: result.metadata as Metadata,
    content: result.default as MDXContent,
  };
}

export async function getBlogPostList({
  category,
  tag,
}: BlogFilterOptions = {}) {
  const posts = await getMDXData(
    path.resolve(process.cwd(), "features/blog/posts")
  );
  const validCategories = new Set(
    CATEGORIES.map((categoryOption) => categoryOption.key)
  );
  const validTags = new Set(TAGS.map((tagOption) => tagOption.key));

  const normalizedCategory =
    category && validCategories.has(category) ? category : undefined;
  const normalizedTag = tag && validTags.has(tag) ? tag : undefined;

  return posts
    .filter((post) => {
      if (normalizedCategory && post.metadata.category !== normalizedCategory) {
        return false;
      }

      if (normalizedTag && !post.metadata.tags.includes(normalizedTag)) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      return (
        new Date(b.metadata.publishedAt).getTime() -
        new Date(a.metadata.publishedAt).getTime()
      );
    });
}

export async function getBlogPost(slug: string) {
  return (await getBlogPostList()).find((post) => post.slug === slug);
}
