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
      className="flex flex-col-reverse w-full gap-4 no-underline border-2 border-opacity-0 rounded-md not-prose hover:opacity-70 md:flex-row"
    >
      {/* <div className="hidden p-4 space-y-2 md:visible">
        <p className="font-bold not-prose">
          {title}
        </p>
        <p className="text-sm opacity-70 not-pros1">{shortUrl}</p>
      </div>
      <Image
        src={image}
        alt={title}
        width={240}
        height={90}
        className="rounded-r-md md:w-auto md:h-auto"
      /> */}

      <div className="p-4 space-y-2 md:w-3/4">
        <p className="font-bold not-prose">{title}</p>
        <p className="text-sm opacity-70 not-prose">{shortUrl}</p>
      </div>
      <Image
        src={image}
        alt={title}
        width={240}
        height={90}
        className="w-auto h-auto rounded-b-md md:w-1/4 md:h-auto"
      />
    </a>
  );
}
