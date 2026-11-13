import Icon from "./Icon";
import ActionForm, { Submit } from "./ActionForm";
import { AvatarInput } from "./Uploads";
import { saveProfile } from "@/app/actions";
import { DEPARTMENTS } from "@/lib/constants";
import { t, type Locale } from "@/lib/i18n";
import type { Profile } from "@/lib/types";
/** Step zero of fundraising: a public profile supporters can see. */
export default function ProfileSetup({ locale, profile, next }: { locale: Locale; profile: Profile; next: string }) {
  const d = t(locale), s = d.x.setup;
  const name = /^(fivonine member|member)$/i.test(profile.display_name) ? "" : profile.display_name;
  return (
    <div className="form-shell">
      <aside className="stack">
        <p className="eyebrow">{s.step}</p>
        <div className="panel mint">
          <h2>{s.why}</h2>
          <ul className="checklist">{s.whyPoints.map((w) => <li key={w}><Icon name="check" size={18} /><span>{w}</span></li>)}</ul>
        </div>
      </aside>
      <ActionForm action={saveProfile} locale={locale} className="step-panel">
        <header className="stack tight"><h2>{s.title}</h2><p className="muted measure">{s.sub}</p></header>
        <input type="hidden" name="setup" value="1" />
        <input type="hidden" name="next" value={next} />
        <label className="field"><span>{s.name}</span><input className="input" name="display_name" required maxLength={80} defaultValue={name} autoComplete="name" /></label>
        <div className="cols-2">
          <label className="field"><span>{d.create.department}</span><select className="input" name="department" defaultValue={profile.department ?? ""}><option value="">{d.create.choose}</option>{DEPARTMENTS.map((v) => <option key={v}>{v}</option>)}</select></label>
          <label className="field"><span>{d.dash.city}</span><input className="input" name="city" maxLength={80} defaultValue={profile.city ?? ""} autoComplete="address-level2" /></label>
        </div>
        <label className="field"><span>{s.bio}</span><textarea className="input" name="bio" rows={3} required minLength={10} maxLength={600} defaultValue={profile.bio} placeholder={s.bioHint} /></label>
        <AvatarInput locale={locale} initial={profile.avatar_path} />
        <div><Submit className="btn primary large">{s.cont}<Icon name="right" size={18} /></Submit></div>
      </ActionForm>
    </div>
  );
}
