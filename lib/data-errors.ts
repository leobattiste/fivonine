/** Log an operation and a safe provider code, never row contents or personal data. */
export function checked<T extends { error?: { code?: string } | null }>(result: T, operation: string): T {
  if (result.error) {
    console.error(`[data:${operation}] unavailable`, result.error.code ?? "unknown");
    throw new Error("The requested data is temporarily unavailable.");
  }
  return result;
}

export function unavailable(operation: string): never {
  console.error(`[data:${operation}] unavailable`, "not_configured");
  throw new Error("The requested data is temporarily unavailable.");
}
