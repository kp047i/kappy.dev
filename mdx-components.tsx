import type { MDXComponents } from "mdx/types";
import { Tweet } from "react-tweet";

import { SpeakerDeck } from "@/features/blog/components/SpeakerDeck/SpeakerDeck";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    Tweet,
    SpeakerDeck,
  };
}
