import { describe, expect, it } from "vitest";

import { assertValidMetadata, filterAndSortPosts } from "./filter";
import { Metadata, Post } from "./type";

function createPost(overrides: Partial<Metadata> & { slug: string }): Post {
  return {
    slug: overrides.slug,
    content: (() => null) as unknown as Post["content"],
    metadata: {
      title: "Title",
      description: "Description",
      publishedAt: "2024-01-01",
      tags: ["nextjs"],
      category: "tech",
      ...overrides,
    },
  };
}

describe("assertValidMetadata", () => {
  it("定義済みのカテゴリとタグなら通す", () => {
    const post = createPost({ slug: "valid" });

    expect(() => assertValidMetadata(post.metadata)).not.toThrow();
  });

  it("未定義のタグがあれば投げる", () => {
    const post = createPost({ slug: "invalid-tag", tags: ["not-a-real-tag"] });

    expect(() => assertValidMetadata(post.metadata)).toThrow(/Invalid tag/);
  });

  it("定義済みのタグが混ざっていても、ひとつでも未定義なら投げる", () => {
    const post = createPost({
      slug: "partially-invalid",
      tags: ["nextjs", "not-a-real-tag"],
    });

    expect(() => assertValidMetadata(post.metadata)).toThrow(/Invalid tag/);
  });

  it("未定義のカテゴリなら投げる", () => {
    const post = createPost({
      slug: "invalid-category",
      category: "not-a-real-category" as Metadata["category"],
    });

    expect(() => assertValidMetadata(post.metadata)).toThrow(
      /Invalid category/
    );
  });
});

describe("filterAndSortPosts", () => {
  const tech = createPost({
    slug: "tech",
    category: "tech",
    tags: ["nextjs"],
    publishedAt: "2024-01-02",
  });
  const life = createPost({
    slug: "life",
    category: "life",
    tags: ["mdx"],
    publishedAt: "2024-01-03",
  });
  const older = createPost({
    slug: "older",
    category: "tech",
    tags: ["mdx"],
    publishedAt: "2024-01-01",
  });
  const posts = [tech, life, older];

  it("条件を渡さなければ全件を公開日の新しい順で返す", () => {
    expect(filterAndSortPosts(posts).map((post) => post.slug)).toEqual([
      "life",
      "tech",
      "older",
    ]);
  });

  it("カテゴリで絞り込む", () => {
    expect(
      filterAndSortPosts(posts, { category: "tech" }).map((post) => post.slug)
    ).toEqual(["tech", "older"]);
  });

  it("タグで絞り込む", () => {
    expect(
      filterAndSortPosts(posts, { tag: "mdx" }).map((post) => post.slug)
    ).toEqual(["life", "older"]);
  });

  it("カテゴリとタグを同時に指定すると両方を満たす記事だけ返す", () => {
    expect(
      filterAndSortPosts(posts, { category: "tech", tag: "mdx" }).map(
        (post) => post.slug
      )
    ).toEqual(["older"]);
  });

  it("未定義のカテゴリは絞り込み条件として無視する", () => {
    expect(
      filterAndSortPosts(posts, { category: "not-a-real-category" }).map(
        (post) => post.slug
      )
    ).toEqual(["life", "tech", "older"]);
  });

  it("未定義のタグは絞り込み条件として無視する", () => {
    expect(
      filterAndSortPosts(posts, { tag: "not-a-real-tag" }).map(
        (post) => post.slug
      )
    ).toEqual(["life", "tech", "older"]);
  });

  it("条件に合う記事が無ければ空配列を返す", () => {
    expect(filterAndSortPosts(posts, { category: "other" })).toEqual([]);
  });

  it("元の配列を破壊しない", () => {
    const original = [...posts];

    filterAndSortPosts(posts);

    expect(posts).toEqual(original);
  });
});
