type AuthFailure = { code?: string; status?: number } | null | undefined;

/** Unknown accounts receive the same confirmation as known accounts. Infrastructure errors do not. */
export function magicLinkFailure(error: AuthFailure): "rate" | "delivery" | null {
  if (!error) return null;
  if (error.status === 429 || error.code === "over_email_send_rate_limit" || error.code === "over_request_rate_limit") return "rate";
  if (error.code === "user_not_found" || error.code === "signup_disabled") return null;
  return "delivery";
}

export function isMissingSession(error: { name?: string; code?: string; status?: number } | null | undefined) {
  return !error || error.name === "AuthSessionMissingError" || ["session_not_found", "session_expired", "bad_jwt", "refresh_token_not_found", "refresh_token_already_used"].includes(error.code ?? "") || error.status === 401;
}
