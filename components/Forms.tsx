"use client";
import { useActionState } from "react";
import {
  loginAction,
  messageAction,
  submitCampaign,
  organizerAction,
  moderate,
} from "@/app/actions";
import { initialState, type CampaignContent } from "@/lib/domain";
import { t, categoryKeys, type Locale } from "@/lib/i18n";
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
}: {
  locale: Locale;
  initial?: CampaignContent;
  id?: string;
  enabled: boolean;
}) {
  const d = t(locale);
  const [state, action, pending] = useActionState(submitCampaign, initialState);
  if (state.ok)
    return (
      <div className="notice success" role="status">
        {state.message}
        <a href={`/${locale}/dashboard`}>{d.dashboard} →</a>
      </div>
    );
  return (
    <form action={action} className="form campaign-form">
      <input type="hidden" name="locale" value={locale} />
      {id && <input type="hidden" name="campaign_id" value={id} />}
      <fieldset disabled={!enabled || pending}>
        <legend>01 · {d.story}</legend>
        <Field label={d.title}>
          <input
            name="title"
            maxLength={160}
            required
            defaultValue={initial?.title}
          />
        </Field>
        <div className="form-row">
          <Field label={d.category}>
            <select
              name="category"
              defaultValue={initial?.category ?? "education"}
            >
              {categoryKeys.map((c) => (
                <option key={c} value={c}>
                  {d[c]}
                </option>
              ))}
            </select>
          </Field>
          <Field label={d.sourceLanguage}>
            <select name="language" defaultValue={initial?.language ?? locale}>
              <option value="ht">Kreyòl</option>
              <option value="fr">Français</option>
              <option value="en">English</option>
            </select>
          </Field>
        </div>
        <Field label={d.description}>
          <textarea
            name="story"
            rows={7}
            required
            maxLength={10000}
            defaultValue={initial?.story}
          />
        </Field>
        <Field label={d.photo}>
          <input
            name="photo_url"
            type="url"
            maxLength={1000}
            placeholder="https://"
            defaultValue={initial?.photo_url}
          />
        </Field>
        <p className="hint">{d.photoHint}</p>
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
      </fieldset>
      <fieldset disabled={!enabled || pending}>
        <legend>02 · {d.organizer}</legend>
        <Field label={d.name}>
          <input
            name="organizer_name"
            required
            maxLength={160}
            defaultValue={initial?.organizer_name}
          />
        </Field>
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
      </fieldset>
      <fieldset disabled={!enabled || pending}>
        <legend>03 · {d.support}</legend>
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
        <Field label={d.support}>
          <textarea
            name="support_text"
            required
            rows={6}
            maxLength={4000}
            defaultValue={initial?.support_text}
          />
        </Field>
        <p className="hint">{d.supportHint}</p>
        <label className="check">
          <input name="consent" type="checkbox" required />
          {d.consent}
        </label>
        <label className="check">
          <input name="accuracy" type="checkbox" required />
          {d.accuracy}
        </label>
      </fieldset>
      {state.message && (
        <p className="notice error" role="alert">
          {state.message}
        </p>
      )}
      <button className="button" disabled={!enabled || pending}>
        {pending ? d.sending : d.send}
      </button>
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
        <textarea name="review_note" rows={2} maxLength={2000} />
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
