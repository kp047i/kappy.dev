import { BlogCategoryTab } from "@/features/blog/components/BlogCategoryTab/BlogCategoryTab";
import { BlogSearchAndFilterList } from "@/features/blog/components/BlogSearchAndFilterList"; // Import the new component
import { CATEGORIES } from "@/features/blog/const/categories";
import { getBlogPostList } from "@/features/blog/utils";

export default async function BlogListPage(
  props: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  }
) {
  const searchParams = await props.searchParams;
  let category = "";

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

  const posts = await getBlogPostList(category);

  return (
    <div className="flex flex-col gap-12">
      <h1 className="text-4xl font-bold">Blog</h1>
      <BlogCategoryTab selectedCategory={category} />

      {/* Replace direct mapping with BlogSearchAndFilterList */}
      <BlogSearchAndFilterList initialPosts={posts} />
    </div>
  );
}
