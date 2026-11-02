import assert from "node:assert/strict";
import { test } from "node:test";
import { existsSync } from "node:fs";
import { content } from "../lib/content";
import { archiveMedia, attachArchiveMedia } from "../lib/archive-media";
import { collectSources } from "../lib/sources-index";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import ArchiveMediaGallery from "../components/ArchiveMediaGallery";

const enriched = attachArchiveMedia(content);
test("media links valid entities and preserves all history", () => {
  assert.equal(enriched.events.length, content.events.length);
  assert.equal(enriched.people.length, content.people.length);
  assert.deepEqual(attachArchiveMedia(enriched), enriched);
  assert.equal(new Set(archiveMedia.map(m => m.id)).size, archiveMedia.length);
  for (const media of archiveMedia) {
    assert.ok(media.fr.title && media.fr.description);
    assert.equal(new URL(media.url).protocol, "https:");
    for (const slug of media.eventSlugs) assert.ok(enriched.events.find(e => e.slug === slug)?.attachments?.some(m => m.id === media.id), slug);
    for (const slug of media.personSlugs) assert.ok(enriched.people.find(p => p.slug === slug)?.attachments?.some(m => m.id === media.id), slug);
    if (media.image) {
      assert.ok(existsSync(`public${media.image.src}`));
      assert.ok(media.image.credit && media.image.licenseUrl && media.fr.alt);
    } else {
      const record = enriched.records!.find(r => r.slug === `archive-${media.id}`)!;
      assert.ok(record);
      for (const slug of media.eventSlugs) assert.ok(enriched.events.find(e => e.slug === slug)?.records?.includes(record.slug));
    }
  }
});
test("images and documents are rendered and indexed with provenance", () => {
  const html = renderToStaticMarkup(createElement(ArchiveMediaGallery, { items: archiveMedia }));
  const sources = collectSources(enriched);
  for (const media of archiveMedia) {
    assert.ok(html.includes(media.url.replaceAll('&', '&amp;')), media.id);
    if (media.image) assert.ok(html.includes(media.image.src));
    assert.ok(sources.some(s => s.url === media.url && s.uses.some(u => u.href === '/decades/2020s')));
  }
  assert.ok(html.includes('loading="lazy"'));
  assert.ok(html.includes('noopener noreferrer'));
  assert.equal(renderToStaticMarkup(createElement(ArchiveMediaGallery, { items: [] })), '');
});
