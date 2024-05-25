import { notFound } from "next/navigation";
import { getBlogPost } from "../utils";
import { BlogCategory } from "../_component/BlogCategory/BlogCategory";

export default async function BlogPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getBlogPost(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <article>
      <div className="space-y-4">
        <p className="text-sm text-center opacity-60">
          {post.metadata.publishedAt}
        </p>
        <h1 className="text-3xl font-bold text-center">
          {post.metadata.title}
        </h1>
        <BlogCategory category={post.metadata.category} />
        <p className="mt-8">{post.metadata.description}</p>
      </div>
      <div className="mt-20 prose prose-md lg:prose-lg prose-headings:text-primary-50 prose-p:mb-12 prose-p:text-primary-50 prose-p:text-opacity-80 prose-a:text-primary-300 prose-li:text-primary-50 prose-li:text-opacity-80">
        {post.content({})}
      </div>
    </article>
  );
}
