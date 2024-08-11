import { JSDOM } from "jsdom";
import Image from "next/image";

export async function ContentLinkCard({ url }: { url: string }) {
  const html = await fetch(url).then((res) => res.text());

  const dom = new JSDOM(html);
  const title = dom.window.document.querySelector("title")?.textContent;
  const image = dom.window.document
    .querySelector("meta[property='og:image']")
    ?.getAttribute("content");

  const shortUrl = new URL(url).hostname;

  if (!title || !image) {
    return null;
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex w-full gap-4 border-2 border-opacity-0 rounded-md not-prose o-underline h-px-90"
    >
      <div className="p-4 space-y-2">
        <p className="font-bold not-prose">
          {title}
        </p>
        <p className="text-sm opacity-70 not-pros1">{shortUrl}</p>
      </div>
      <Image
        src={image}
        alt={title}
        width={160}
        height={90}
        className="rounded-r-md"
      />
    </a>
  );
}
