"use client";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import { t, categoryKeys, type Locale } from "@/lib/i18n";
import { brief } from "@/lib/brief";
import Icon from "./Icon";
export type ExploreValues = {
  q?: string;
  category?: string;
  location?: string;
  sort?: string;
  lifecycle?: string;
};
function Fields({ locale, values }: { locale: Locale; values: ExploreValues }) {
  const d = t(locale),
    b = brief[locale];
  return (
    <>
      <label className="filter-select">
        <span>{d.category}</span>
        <select name="category" defaultValue={values.category ?? ""}>
          <option value="">{d.any}</option>
          {categoryKeys.map((c) => (
            <option key={c} value={c}>
              {d[c]}
            </option>
          ))}
        </select>
      </label>
      <label className="filter-select">
        <span>{b.location}</span>
        <input
          name="location"
          defaultValue={values.location ?? ""}
          placeholder={d.any}
          maxLength={100}
        />
      </label>
      <label className="filter-select">
        <span>{b.status}</span>
        <select name="lifecycle" defaultValue={values.lifecycle ?? ""}>
          <option value="">{d.any}</option>
          <option value="active">{b.active}</option>
          <option value="completed">{b.completed}</option>
        </select>
      </label>
      <label className="filter-select">
        <span>{b.sort}</span>
        <select name="sort" defaultValue={values.sort ?? "created"}>
          <option value="created">{b.recent}</option>
          <option value="updated">{b.updated}</option>
        </select>
      </label>
    </>
  );
}
export default function ExploreFilters({
  locale,
  values,
}: {
  locale: Locale;
  values: ExploreValues;
}) {
  const d = t(locale),
    b = brief[locale],
    dialog = useRef<HTMLDialogElement>(null),
    search = useRef<HTMLInputElement>(null),
    router = useRouter();
  return (
    <>
      <form className="explore-filters" action={`/${locale}/explore`}>
        <div className="explore-search-row">
          <label className="search-field">
            <Icon name="search" />
            <input
              ref={search}
              name="q"
              aria-label={d.search}
              placeholder={d.searchHint}
              defaultValue={values.q}
              maxLength={120}
            />
          </label>
          <button className="button explore-search-submit" type="submit">
            {d.search}
            <Icon name="arrowRight" />
          </button>
          <button
            className="button secondary mobile-filter-toggle"
            type="button"
            onClick={() => dialog.current?.showModal()}
          >
            <Icon name="filters" />
            {b.filters}
          </button>
        </div>
        <div className="desktop-filters">
          <Fields locale={locale} values={values} />
        </div>
      </form>
      <dialog
        className="filter-sheet"
        ref={dialog}
        aria-label={b.filters}
        onClick={(e) => {
          if (e.target === dialog.current) dialog.current?.close();
        }}
      >
        <div className="modal-head">
          <h2>{b.filters}</h2>
          <button
            type="button"
            className="bare"
            aria-label={d.close}
            onClick={() => dialog.current?.close()}
          >
            <Icon name="close" />
          </button>
        </div>
        <form
          className="form"
          onSubmit={(e) => {
            e.preventDefault();
            const params = new URLSearchParams();
            new FormData(e.currentTarget).forEach((v, k) => {
              if (v) params.set(k, String(v));
            });
            if (search.current?.value) params.set("q", search.current.value);
            dialog.current?.close();
            router.push(`/${locale}/explore?${params}`);
          }}
        >
          <Fields locale={locale} values={values} />
          <button className="button" type="submit">
            {b.apply}
          </button>
        </form>
      </dialog>
    </>
  );
}
