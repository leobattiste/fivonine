/** Owner-supplied public disclosures. Empty values are never replaced with invented identities. */
export function getOperator() {
  const support = process.env.SITE_SUPPORT_EMAIL?.trim() ?? "";
  return {
    name: process.env.SITE_OPERATOR_NAME?.trim() ?? "",
    country: process.env.SITE_OPERATOR_COUNTRY?.trim() ?? "",
    email: /^[^\s<>@]+@[^\s<>@]+\.[^\s<>@]+$/.test(support) ? support : "",
    retention: process.env.SITE_DOCUMENT_RETENTION?.trim() ?? "",
  };
}
