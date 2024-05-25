import type { MDXComponents } from "mdx/types";
import Link from "next/link";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    a: ({ children, href }) => {
      if (href && href.startsWith("/")) {
        return <Link href={href}>{children}</Link>;
      }

      if (href && href.startsWith("#")) {
        return <a href={href}>{children}</a>;
      }

      return (
        <a href={href} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      );
    },
    ...components,
  };
}
