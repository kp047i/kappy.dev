// 無効なタグを追加したときにエラーが発生するようにas constにはしない
export const TAGS: Array<{ label: string; key: string }> = [
  {
    label: "Next.js",
    key: "nextjs",
  },
  {
    label: "Tailwind CSS",
    key: "tailwindcss",
  },
  {
    label: "MDX",
    key: "mdx",
  },
];
