"use client";
import { useState } from "react";
import type { Locale } from "@/lib/i18n";
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
  const p = platform[locale];
  const matches = topics.filter((topic) =>
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
