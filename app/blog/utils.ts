import fs from "fs";
import { Metadata } from "./type";
import path from "path";
import { Post } from "./type";
import { MDXContent } from "mdx/types";
import { TAGS } from "./_const/tags";
import { CATEGORIES } from "./_const/categories";

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
  const result = await import(`./_posts/${fileName}`);
  return {
    metadata: result.metadata as Metadata,
    content: result.default as MDXContent,
  };
}

export async function getBlogPostList(category?: string) {
  const posts = await getMDXData(
    path.resolve(process.cwd(), "app/blog/_posts")
  );
  if (category) {
    return posts.filter((post) => post.metadata.category === category);
  }

  return posts;
}

export async function getBlogPost(slug: string) {
  return (await getBlogPostList()).find((post) => post.slug === slug);
}
