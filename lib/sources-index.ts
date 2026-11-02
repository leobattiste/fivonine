import type { Content, Source } from "./types";

export type SourceKind = "events" | "figures" | "records" | "reading" | "collections" | "images";
export type SourceUse = { href: string; title: string; kind: "event" | "figure" | "record" | "period" };
export type SourceEntry = {
  id: string;
  kind: SourceKind;
  title: string;
  url?: string;
  description?: string;
  credit?: string;
  license?: string;
  language?: string;
  uses: SourceUse[];
};

/**
 * A single index for references attached throughout the archive.
 * We keep the original structured sources on the records for editorial traceability,
 * but only render their citations on the dedicated Sources page.
 */
export function collectSources(content: Content): SourceEntry[] {
  const index = new Map<string, SourceEntry>();

  function add(
    kind: SourceKind,
    title: string,
    url: string | undefined,
    use: SourceUse,
    detail: Partial<Pick<SourceEntry, "description" | "credit" | "license" | "language">> = {},
  ) {
    const normalizedTitle = title.trim();
    if (!normalizedTitle) return;
    const normalizedUrl = url?.trim() || undefined;
    // Titles matter: several ANRHA dossiers share one inventory URL.
    const key = [kind, normalizedTitle.toLocaleLowerCase(), normalizedUrl ?? ""].join("\u0001");
    const existing = index.get(key);
    if (existing) {
      if (!existing.uses.some((x) => x.kind === use.kind && x.href === use.href)) existing.uses.push(use);
      return;
    }
    index.set(key, {
      id: key,
      kind,
      title: normalizedTitle,
      url: normalizedUrl,
      ...detail,
      uses: [use],
    });
  }

  const addList = (sources: Source[] | undefined, kind: SourceKind, use: SourceUse) => {
    for (const source of sources ?? []) add(kind, source.title, source.url, use);
  };

  const addMedia = (items: import("./types").ArchiveMedia[] | undefined, use: SourceUse) => {
    for (const media of items ?? []) add(media.kind === "image" ? "images" : "records", media.title, media.url, use, {
      description: media.description, credit: media.image?.credit ?? media.publisher, license: media.image?.license, language: media.language,
    });
  };
  for (const event of content.events) {
    addMedia(event.attachments, { kind: "event", href: `/events/${event.slug}`, title: event.title });
    addList(event.sources, "events", {
      kind: "event", href: `/events/${event.slug}`, title: event.title,
    });
  }
  for (const figure of content.people) {
    addMedia(figure.attachments, { kind: "figure", href: `/people/${figure.slug}`, title: figure.name });
    addList(figure.sources, "figures", {
      kind: "figure", href: `/people/${figure.slug}`, title: figure.name,
    });
  }
  for (const record of content.records ?? []) {
    addMedia(record.attachments, { kind: "record", href: `/records/${record.slug}`, title: record.title });
    addList(record.sources, "records", {
      kind: "record", href: `/records/${record.slug}`, title: record.title,
    });
  }
  for (const period of content.periods) {
    const use: SourceUse = { kind: "period", href: `/decades/${period.slug}`, title: period.label };
    addMedia(period.attachments, use);
    for (const title of period.biblio ?? []) add("reading", title, undefined, use);
    for (const media of period.media ?? []) {
      add("collections", media.title, media.url, use, {
        description: media.description, credit: media.credit, license: media.license, language: media.language,
      });
    }
    for (const block of period.essay ?? []) {
      if (block.type === "biblio") {
        for (const title of block.items) add("reading", title, undefined, use);
      } else if (block.type === "img") {
        add("images", block.caption || block.alt, block.source, use, {
          credit: block.credit, license: block.license,
        });
      }
    }
  }
  return [...index.values()].sort((a, b) =>
    a.title.localeCompare(b.title, "en", { sensitivity: "base" }) ||
    a.kind.localeCompare(b.kind)
  );
}

