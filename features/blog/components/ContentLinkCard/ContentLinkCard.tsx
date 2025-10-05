import clsx from "clsx";
import Image from "next/image";

const cardBaseClass =
  "not-prose group flex w-full flex-col-reverse overflow-hidden rounded-2xl border transition-colors duration-200 md:flex-row";

function extractMetaContent(html: string, property: string) {
  const pattern = new RegExp(
    `<meta[^>]*(?:property|name)=["']${property}["'][^>]*content=["']([^"']+)["'][^>]*>`,
    "i"
  );
  const match = html.match(pattern);

  if (match) {
    return match[1];
  }

  return undefined;
}

export async function ContentLinkCard({ url }: { url: string }) {
  const html = await fetch(url).then((res) => res.text());

  const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  const title = titleMatch?.[1]?.trim();

  const image =
    extractMetaContent(html, "og:image") ?? extractMetaContent(html, "twitter:image");

  const shortUrl = new URL(url).hostname;

  if (!title || !image) {
    return null;
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={clsx(
        cardBaseClass,
        "border-secondary-100/70 bg-primary-50/80 hover:bg-primary-100 dark:border-base-700/80 dark:bg-base-800/70 dark:hover:border-base-600/80"
      )}
    >
      <div className="flex h-full flex-1 flex-col justify-between gap-3 p-5">
        <p className="text-sm font-semibold text-secondary-950 transition-colors group-hover:text-secondary-900 dark:text-base-50 dark:group-hover:text-base-100">
          {title}
        </p>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-secondary-500 transition-colors group-hover:text-secondary-600 dark:text-base-200 dark:group-hover:text-base-100">
          {shortUrl}
        </p>
      </div>
      <div className="relative h-40 w-full shrink-0 overflow-hidden md:h-auto md:w-52">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(min-width: 768px) 208px, 100vw"
          className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
        />
      </div>
    </a>
  );
}
