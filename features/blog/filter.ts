import { CATEGORIES } from "./const/categories";
import { TAGS } from "./const/tags";
import { Metadata, Post } from "./type";

export type BlogFilterOptions = {
  category?: string;
  tag?: string;
};

/**
 * 記事の frontmatter が定義済みのカテゴリとタグだけを使っているか検証する。
 * 記事追加時のタイポをビルド時に落とすためのガード。
 */
export function assertValidMetadata(metadata: Metadata): void {
  const validTags = new Set(TAGS.map((tag) => tag.key));
  const validCategories = new Set(CATEGORIES.map((category) => category.key));

  if (metadata.tags.some((tag) => !validTags.has(tag))) {
    throw new Error(`Invalid tag: ${metadata.tags}`);
  }

  if (!validCategories.has(metadata.category)) {
    throw new Error(`Invalid category: ${metadata.category}`);
  }
}

/**
 * 記事をカテゴリ・タグで絞り込み、公開日の新しい順に並べ替える。
 * 未定義のカテゴリ・タグが渡された場合は絞り込み条件として扱わない
 * (クエリパラメータ経由で任意の値が入りうるため)。
 */
export function filterAndSortPosts(
  posts: Post[],
  { category, tag }: BlogFilterOptions = {}
): Post[] {
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
    .sort(
      (a, b) =>
        new Date(b.metadata.publishedAt).getTime() -
        new Date(a.metadata.publishedAt).getTime()
    );
}
