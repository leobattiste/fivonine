"use client";
import { useState } from "react";
import type { Locale } from "@/lib/i18n";
import { brief } from "@/lib/brief";
import { platform } from "@/lib/platform-content";
import Icon from "./Icon";
export default function HelpTopics({
  locale,
  topics,
}: {
  locale: Locale;
  topics: { heading: string; body: string }[];
}) {
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState<number | null>(null);
  const b = brief[locale];
  const p = platform[locale];
  const matches = topics.filter(
    (topic, index) =>
      (group === null || [0, 2, 1, 3, 5, 4, 1, 1][index] === group) &&
      `${topic.heading} ${topic.body}`
        .toLocaleLowerCase()
        .includes(query.trim().toLocaleLowerCase()),
  );
  return (
    <>
      <label className="search-field help-search">
        <Icon name="search" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          type="search"
          aria-label={p.searchHelp}
          placeholder={p.searchHelp}
        />
      </label>
      <nav className="help-topic-groups" aria-label={p.faq}>
        <button
          type="button"
          aria-pressed={group === null}
          onClick={() => setGroup(null)}
        >
          {locale === "en" ? "All" : locale === "fr" ? "Tout" : "Tout"}
        </button>
        {b.faqGroups.map((title, index) => (
          <button
            type="button"
            key={title}
            aria-pressed={group === index}
            onClick={() => setGroup(index)}
          >
            {title}
          </button>
        ))}
      </nav>
      <div className="faq-list">
        {matches.map((topic) => (
          <details key={topic.heading}>
            <summary>
              {topic.heading}
              <Icon name="plus" />
            </summary>
            <p>{topic.body}</p>
          </details>
        ))}
      </div>
      {!matches.length && (
        <p className="empty" role="status">
          {p.noHelp}
        </p>
      )}
    </>
  );
}
