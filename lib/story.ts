import sanitizeHtml from "sanitize-html";
/** Stories are written in a rich editor and stored as a small, safe subset of HTML. Older stories are plain text. */
const OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: ["p", "br", "strong", "em", "h2", "h3", "ul", "ol", "li", "blockquote", "a"],
  allowedAttributes: { a: ["href"] },
  allowedSchemes: ["https"],
  transformTags: { a: (tag, attribs) => ({ tagName: "a", attribs: { href: attribs.href ?? "", rel: "noopener noreferrer nofollow", target: "_blank" } }), b: "strong", i: "em", h1: "h2" },
  allowedSchemesAppliedToAttributes: ["href"],
};
const isHtml = (s: string) => /^\s*<(p|h2|h3|ul|ol|blockquote)[\s>]/i.test(s);
const escape = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
export function storyHtml(story: string): string {
  if (!story) return "";
  if (isHtml(story)) return sanitizeHtml(story, OPTIONS);
  return story.split(/\n{2,}/).map((p) => `<p>${escape(p).replace(/\n/g, "<br>")}</p>`).join("");
}
export function cleanStory(input: string): string {
  return isHtml(input) ? sanitizeHtml(input, OPTIONS).trim() : input.trim();
}
export function storyText(story: string): string {
  if (!isHtml(story)) return story;
  return sanitizeHtml(story.replace(/<\/(p|h2|h3|li|blockquote)>/gi, "$&\n").replace(/<br\s*\/?>/gi, "\n"), { allowedTags: [], allowedAttributes: {} })
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ").replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/\n{3,}/g, "\n\n").trim();
}
