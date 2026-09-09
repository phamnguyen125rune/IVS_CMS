import sanitizeHtml from "sanitize-html";
import type { ResPostDTO } from "@/types/post.type";

/** Display-only fallback for imported articles; does not create CMS tag records. */
export function getPostDisplayTags(
  post: Pick<ResPostDTO, "tags" | "content">,
): string[] {
  const names = new Map<string, string>();
  const add = (value: string) => {
    const name = value.trim().replace(/^#+/, "").normalize("NFC");
    if (name) names.set(name.toLocaleLowerCase("vi"), name);
  };

  for (const tag of post.tags || []) add(tag.name);
  if (names.size) return [...names.values()];

  // Parse HTML so attributes, URLs, scripts and CSS cannot become visible tags.
  // Only explicit hashtag links qualify; ordinary prose is not inferred as tags.
  sanitizeHtml(post.content || "", {
    allowedTags: ["a"],
    allowedAttributes: { a: ["href"] },
    exclusiveFilter(frame) {
      if (
        frame.tag === "a" &&
        /^#[\p{L}\p{M}\p{N}_]+$/u.test(frame.text.trim())
      ) {
        add(frame.text);
      }
      return false;
    },
  });
  return [...names.values()];
}
