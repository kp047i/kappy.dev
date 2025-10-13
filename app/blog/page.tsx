import { BlogCard } from "@/features/blog/components/BlogCard/BlogCard";
import { BlogCategoryTab } from "@/features/blog/components/BlogCategoryTab/BlogCategoryTab";
import { BlogTagList } from "@/features/blog/components/BlogTagList/BlogTagList";
import { CATEGORIES } from "@/features/blog/const/categories";
import { TAGS } from "@/features/blog/const/tags";
import { getBlogPostList } from "@/features/blog/utils";

export default async function BlogListPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  let category = "";
  let tag = "";

  if (searchParams.category && typeof searchParams.category === "string") {
    category = searchParams.category;
  }
  // 配列の場合は最初の要素を取得
  if (Array.isArray(searchParams.category)) {
    category = searchParams.category[0];
  }

  // 無効なカテゴリーの場合は空文字にする
  if (!CATEGORIES.map((category) => category.key).includes(category)) {
    category = "";
  }

  if (searchParams.tag && typeof searchParams.tag === "string") {
    tag = searchParams.tag;
  }
  if (Array.isArray(searchParams.tag)) {
    tag = searchParams.tag[0];
  }

  if (!TAGS.map((tagOption) => tagOption.key).includes(tag)) {
    tag = "";
  }

  const posts = await getBlogPostList({ category, tag });

  return (
    <div className="flex flex-col gap-12">
      <h1 className="text-2xl font-bold text-secondary-950 dark:text-base-50">Blog</h1>
      <div className="space-y-6">
        <BlogCategoryTab selectedCategory={category} selectedTag={tag} />
        <BlogTagList selectedCategory={category} selectedTag={tag} />
      </div>

      <div className="space-y-12">
        {posts.map((post) => (
          <BlogCard key={post.slug} metadata={post.metadata} />
        ))}
      </div>
    </div>
  );
}
