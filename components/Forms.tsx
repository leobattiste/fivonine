"use client";
import { useActionState, useRef, useState } from "react";
import SupportText from "./SupportText";
import Link from "next/link";
import Icon from "./Icon";
import { brief } from "@/lib/brief";
import {
  loginAction,
  messageAction,
  submitCampaign,
  organizerAction,
  moderate,
} from "@/app/actions";
import { initialState, type CampaignContent } from "@/lib/domain";
import { t, categoryKeys, type Locale, type Category } from "@/lib/i18n";
import Turnstile from "./Turnstile";
const Field = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <label className="field">
    <span>{label}</span>
    {children}
  </label>
);
export function CampaignForm({
  locale,
  initial,
  id,
  enabled,
  defaultCategory,
  email,
}: {
  locale: Locale;
  initial?: CampaignContent;
  id?: string;
  enabled: boolean;
  defaultCategory?: Category;
  email?: string;
}) {
  const d = t(locale),
    b = brief[locale];
  const [state, action, pending] = useActionState(submitCampaign, initialState);
  const [step, setStep] = useState(0);
  const [review, setReview] = useState<Record<string, string>>({});
  const form = useRef<HTMLFormElement>(null),
    heading = useRef<HTMLHeadingElement>(null);
  const steps = [b.fundraiser, b.details, b.organizer, b.review];
  const go = (next: number) => {
    setStep(next);
    requestAnimationFrame(() => heading.current?.focus());
  };
  const advance = () => {
    const section = form.current?.querySelectorAll("fieldset")[step];
    const invalid = Array.from(
      section?.querySelectorAll<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >("input,textarea,select") ?? [],
    ).find((el) => !el.checkValidity());
    if (invalid) {
      invalid.reportValidity();
      return;
    }
    if (step === 2 && form.current)
      setReview(
        Object.fromEntries(
          Array.from(
            form.current.querySelectorAll<
              HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
            >("input,textarea,select"),
          ).map((el) => [el.name, el.value]),
        ),
      );
    go(Math.min(step + 1, 3));
  };
  if (state.ok)
    return (
      <section className="submission-confirmation" role="status">
        <span className="confirmation-icon">
          <Icon name="check" />
        </span>
        <h2>{b.confirmation}</h2>
        <p>{b.confirmationBody}</p>
        <Link className="button" href={`/${locale}/dashboard`}>
          {b.manage}
          <Icon name="arrowRight" />
        </Link>
      </section>
    );
  return (
    <form
      ref={form}
      noValidate
      action={action}
      className="form campaign-form"
      onSubmit={(e) => {
        if (step < 3) {
          e.preventDefault();
          advance();
          return;
        }
        const invalid = Array.from(
          form.current?.querySelectorAll<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
          >("input,textarea,select") ?? [],
        ).find((el) => !el.checkValidity());
        if (invalid) {
          e.preventDefault();
          const index = Array.from(
            form.current?.querySelectorAll("fieldset") ?? [],
          ).findIndex((el) => el.contains(invalid));
          if (index >= 0) go(index);
          requestAnimationFrame(() => {
            invalid.focus();
            invalid.reportValidity();
          });
        }
      }}
    >
      <ol className="submission-steps" aria-label={b.manage}>
        {steps.map((label, i) => (
          <li
            key={label}
            aria-current={step === i ? "step" : undefined}
            className={step > i ? "completed" : ""}
          >
            <span>{step > i ? <Icon name="check" /> : i + 1}</span>
            {label}
          </li>
        ))}
      </ol>
      <h2 className="form-step-title" ref={heading} tabIndex={-1}>
        {steps[step]}
      </h2>
      <input type="hidden" name="locale" value={locale} />
      {id && <input type="hidden" name="campaign_id" value={id} />}
      <fieldset hidden={step !== 0} disabled={!enabled || pending}>
        <legend>01 · {b.fundraiser}</legend>
        <Field label={b.url}>
          <input
            name="fundraising_url"
            type="url"
            placeholder="https://"
            maxLength={1000}
            defaultValue={initial?.fundraising_url ?? ""}
          />
        </Field>
        <p className="hint">{b.urlHint}</p>
        <Field label={d.title}>
          <input
            name="title"
            required
            maxLength={160}
            defaultValue={initial?.title}
          />
        </Field>
        <Field label={d.category}>
          <select
            name="category"
            defaultValue={initial?.category ?? defaultCategory ?? "education"}
          >
            {categoryKeys.map((c) => (
              <option key={c} value={c}>
                {d[c]}
              </option>
            ))}
          </select>
        </Field>
        <div className="form-row">
          <Field label={d.amount}>
            <input
              name="goal"
              type="number"
              min="0.01"
              max="100000000"
              step="0.01"
              defaultValue={initial?.goal ?? ""}
            />
          </Field>
          <Field label={d.currency}>
            <select name="currency" defaultValue={initial?.currency ?? "USD"}>
              {["USD", "HTG", "CAD", "EUR", "GBP", "DOP"].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </Field>
        </div>
        {id && (
          <Field label={b.status}>
            <select
              name="lifecycle"
              defaultValue={initial?.lifecycle ?? "active"}
            >
              <option value="active">{b.active}</option>
              <option value="completed">{b.completed}</option>
            </select>
          </Field>
        )}
      </fieldset>
      <fieldset hidden={step !== 1} disabled={!enabled || pending}>
        <legend>02 · {b.details}</legend>
        <Field label={d.description}>
          <textarea
            name="story"
            required
            rows={7}
            maxLength={10000}
            defaultValue={initial?.story}
          />
        </Field>
        <Field label={d.sourceLanguage}>
          <select name="language" defaultValue={initial?.language ?? locale}>
            <option value="ht">Kreyòl</option>
            <option value="fr">Français</option>
            <option value="en">English</option>
          </select>
        </Field>
        <div className="form-row">
          <Field label={d.country}>
            <input
              name="country"
              required
              maxLength={80}
              defaultValue={initial?.country}
            />
          </Field>
          <Field label={d.region}>
            <input
              name="region"
              required
              maxLength={100}
              defaultValue={initial?.region}
            />
          </Field>
        </div>
        <Field label={d.photo}>
          <input
            name="photo_url"
            type="url"
            placeholder="https://"
            maxLength={1000}
            defaultValue={initial?.photo_url}
          />
        </Field>
        <p className="hint">{d.photoHint}</p>
        <Field label={d.use}>
          <textarea
            name="intended_use"
            required
            rows={3}
            maxLength={3000}
            defaultValue={initial?.intended_use}
          />
        </Field>
        <Field label={d.distribution}>
          <textarea
            name="distribution"
            required
            rows={3}
            maxLength={3000}
            defaultValue={initial?.distribution}
          />
        </Field>
      </fieldset>
      <fieldset hidden={step !== 2} disabled={!enabled || pending}>
        <legend>03 · {b.organizer}</legend>
        <Field label={d.name}>
          <input
            name="organizer_name"
            required
            maxLength={160}
            defaultValue={initial?.organizer_name}
          />
        </Field>
        {email && (
          <Field label={d.email}>
            <input type="email" value={email} readOnly autoComplete="email" />
          </Field>
        )}
        <Field label={d.relationship}>
          <input
            name="relationship"
            required
            maxLength={200}
            defaultValue={initial?.relationship}
          />
        </Field>
        <Field label={d.beneficiaryName}>
          <input
            name="beneficiary"
            required
            maxLength={300}
            defaultValue={initial?.beneficiary}
          />
        </Field>
        <Field label={d.support}>
          <textarea
            name="support_text"
            required
            rows={5}
            maxLength={4000}
            defaultValue={initial?.support_text}
          />
        </Field>
        <p className="hint">{d.supportHint}</p>
        <label className="check">
          <input name="consent" type="checkbox" required />
          {d.consent}
        </label>
      </fieldset>
      <fieldset hidden={step !== 3} disabled={!enabled || pending}>
        <legend>04 · {b.review}</legend>
        <section className="submission-review">
          <h3>{review.title || d.title}</h3>
          <p className="preserve-lines">{review.story}</p>
          <dl>
            {[
              [d.organizer, review.organizer_name],
              [d.beneficiary, review.beneficiary],
              [
                b.location,
                [review.region, review.country].filter(Boolean).join(", "),
              ],
              [d.use, review.intended_use],
              [d.distribution, review.distribution],
              [
                d.category,
                categoryKeys.includes(review.category as Category)
                  ? d[review.category as Category]
                  : review.category,
              ],
              [
                d.amount,
                review.goal ? `${review.currency} ${review.goal}` : "—",
              ],
            ].map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
          {review.fundraising_url && (
            <SupportText text={review.fundraising_url} />
          )}
          <h3>{d.support}</h3>
          <SupportText text={review.support_text ?? ""} />
        </section>
        <label className="check">
          <input name="accuracy" type="checkbox" required />
          {d.accuracy}
        </label>
        <label className="check">
          <input name="terms" type="checkbox" required />
          <span>
            {b.terms} <Link href={`/${locale}/legal#terms`}>{d.terms}</Link> ·{" "}
            <Link href={`/${locale}/legal#guidelines`}>{d.guidelines}</Link>
          </span>
        </label>
      </fieldset>
      {state.message && (
        <p className="notice error" role="alert">
          {state.message}
        </p>
      )}
      <div className="form-step-actions">
        {step > 0 && (
          <button
            type="button"
            className="button secondary"
            onClick={() => go(step - 1)}
          >
            {locale === "en" ? "Back" : locale === "fr" ? "Retour" : "Retounen"}
          </button>
        )}
        {step < 3 ? (
          <button type="button" className="button" onClick={advance}>
            {locale === "en"
              ? "Continue"
              : locale === "fr"
                ? "Continuer"
                : "Kontinye"}
            <Icon name="arrowRight" />
          </button>
        ) : (
          <button className="button" disabled={!enabled || pending}>
            {pending ? d.sending : d.send}
          </button>
        )}
      </div>
    </form>
  );
}
export function LoginForm({
  locale,
  enabled,
}: {
  locale: Locale;
  enabled: boolean;
}) {
  const d = t(locale);
  const [state, action, pending] = useActionState(loginAction, initialState);
  return (
    <form action={action} className="form">
      <input type="hidden" name="locale" value={locale} />
      <Field label={d.email}>
        <input
          type="email"
          name="email"
          autoComplete="email"
          required
          maxLength={254}
          disabled={!enabled || pending}
        />
      </Field>
      <input
        className="honeypot"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />
      <Turnstile />
      {state.message && (
        <p
          className={`notice ${state.ok ? "success" : "error"}`}
          role={state.ok ? "status" : "alert"}
        >
          {state.message}
        </p>
      )}
      <button className="button" disabled={!enabled || pending}>
        {pending ? d.sending : d.sendLink}
      </button>
    </form>
  );
}
export function MessageForm({
  locale,
  campaignId,
  enabled,
}: {
  locale: Locale;
  campaignId?: string;
  enabled: boolean;
}) {
  const d = t(locale);
  const [state, action, pending] = useActionState(messageAction, initialState);
  if (state.ok)
    return (
      <p className="notice success" role="status">
        {state.message}
      </p>
    );
  return (
    <form action={action} className="form">
      <input type="hidden" name="locale" value={locale} />
      <input
        type="hidden"
        name="kind"
        value={campaignId ? "report" : "contact"}
      />
      {campaignId && (
        <input type="hidden" name="campaign_id" value={campaignId} />
      )}
      <Field label={d.name}>
        <input name="name" maxLength={160} disabled={!enabled} />
      </Field>
      <Field label={d.email}>
        <input
          name="email"
          type="email"
          required
          maxLength={254}
          disabled={!enabled}
        />
      </Field>
      {campaignId && (
        <Field label={d.reason}>
          <select name="reason" disabled={!enabled}>
            <option value="misleading">
              {locale === "ht"
                ? "Enfòmasyon ki twonpe"
                : locale === "fr"
                  ? "Informations trompeuses"
                  : "Misleading information"}
            </option>
            <option value="impersonation">
              {locale === "ht"
                ? "Fo idantite"
                : locale === "fr"
                  ? "Usurpation"
                  : "Impersonation"}
            </option>
            <option value="privacy">{d.privacy}</option>
            <option value="other">{d.feedback}</option>
          </select>
        </Field>
      )}
      <Field label={d.message}>
        <textarea
          name="body"
          required
          rows={6}
          maxLength={5000}
          disabled={!enabled}
        />
      </Field>
      <input
        className="honeypot"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />
      <Turnstile />
      {state.message && (
        <p className="notice error" role="alert">
          {state.message}
        </p>
      )}
      <button className="button" disabled={!enabled || pending}>
        {pending ? d.sending : campaignId ? d.report : d.sendMessage}
      </button>
    </form>
  );
}
export function OrganizerRequest({
  locale,
  id,
  remove = false,
}: {
  locale: Locale;
  id: string;
  remove?: boolean;
}) {
  const d = t(locale);
  const [state, action, pending] = useActionState(
    organizerAction,
    initialState,
  );
  return (
    <form action={action} className="form">
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="campaign_id" value={id} />
      <input type="hidden" name="kind" value={remove ? "remove" : "update"} />
      {!remove && (
        <>
          <Field label={d.updateTitle}>
            <input name="title" maxLength={160} required />
          </Field>
          <Field label={d.updateBody}>
            <textarea name="body" rows={4} maxLength={5000} required />
          </Field>
        </>
      )}
      {state.message && (
        <p className={`notice ${state.ok ? "success" : "error"}`} role="status">
          {state.message}
        </p>
      )}
      <button
        className={`button ${remove ? "secondary danger" : ""}`}
        disabled={pending}
      >
        {remove ? d.requestRemoval : d.postUpdate}
      </button>
    </form>
  );
}
export function ReviewForm({
  locale,
  id,
  kind,
}: {
  locale: Locale;
  id: string;
  kind: "revision" | "campaign" | "update" | "report" | "contact";
}) {
  const d = t(locale);
  const [state, action, pending] = useActionState(moderate, initialState);
  const actions =
    kind === "revision"
      ? ["approve", "changes", "decline"]
      : kind === "campaign"
        ? ["feature", "unfeature", "suspend", "archive"]
        : kind === "update"
          ? ["approve", "decline"]
          : ["resolve"];
  return (
    <form action={action} className="form">
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="record_id" value={id} />
      <input type="hidden" name="record_kind" value={kind} />
      <Field label={d.note}>
        <textarea name="review_note" rows={2} maxLength={2000} required />
      </Field>
      {kind === "revision" && (
        <>
          <label className="check">
            <input type="checkbox" name="links_checked" />
            {d.linkChecked}
          </label>
          <label className="check">
            <input type="checkbox" name="organization_checked" />
            {d.orgReviewed}
          </label>
        </>
      )}
      <div className="actions">
        {actions.map((a) => (
          <button
            key={a}
            className="button secondary"
            name="decision"
            value={a}
            disabled={pending}
          >
            {a === "resolve"
              ? locale === "ht"
                ? "Fèmen"
                : locale === "fr"
                  ? "Résoudre"
                  : "Resolve"
              : d[a as "approve"]}
          </button>
        ))}
      </div>
      {state.message && (
        <p className={`notice ${state.ok ? "success" : "error"}`} role="status">
          {state.message}
        </p>
      )}
    </form>
  );
}
