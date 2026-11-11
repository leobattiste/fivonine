export const DEPARTMENTS = ["Artibonite", "Centre", "Grand'Anse", "Nippes", "Nord", "Nord-Est", "Nord-Ouest", "Ouest", "Sud", "Sud-Est", "Diaspora"] as const;
export type MethodGroup = "transfer" | "wallet" | "bank" | "app" | "other";
export const METHODS: { id: string; name: string; group: MethodGroup }[] = [
  { id: "western_union", name: "Western Union", group: "transfer" },
  { id: "unitransfer", name: "UniTransfer", group: "transfer" },
  { id: "moneygram", name: "MoneyGram", group: "transfer" },
  { id: "cam", name: "CAM Transfert", group: "transfer" },
  { id: "moncash", name: "MonCash", group: "wallet" },
  { id: "natcash", name: "NatCash", group: "wallet" },
  { id: "unibank", name: "Unibank", group: "bank" },
  { id: "sogebank", name: "Sogebank", group: "bank" },
  { id: "bnc", name: "BNC", group: "bank" },
  { id: "capital_bank", name: "Capital Bank", group: "bank" },
  { id: "buh", name: "BUH", group: "bank" },
  { id: "zelle", name: "Zelle", group: "app" },
  { id: "cash_app", name: "Cash App", group: "app" },
  { id: "paypal", name: "PayPal", group: "app" },
  { id: "remitly", name: "Remitly", group: "app" },
  { id: "sendwave", name: "Sendwave", group: "app" },
  { id: "taptap_send", name: "Taptap Send", group: "app" },
  { id: "other", name: "", group: "other" },
];
export const METHOD_IDS = METHODS.map((m) => m.id);
export const methodName = (id: string, other: string) => METHODS.find((m) => m.id === id)?.name || other;
export const RELATIONS = ["self", "family", "friend", "neighbor", "community", "organization", "other"] as const;
export const TIERS = ["none", "id_checked", "community", "organization"] as const;
export const STATUSES = ["draft", "pending", "needs_changes", "live", "completed", "closed", "rejected", "suspended"] as const;
export const REASONS = ["scam", "false_story", "stolen_identity", "payout_mismatch", "prohibited", "other"] as const;
export const VOUCH_ROLES = ["church", "school", "clinic", "leader", "organization", "neighbor", "other"] as const;
export const PER_PAGE = 12;
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://fivonine.vercel.app").replace(/\/$/, "");
