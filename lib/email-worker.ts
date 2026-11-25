export type EmailJob = {
  id: string; lease_token: string; recipient: string; locale: string; kind: string;
  payload: { title?: string; slug?: string; note?: string };
};
export type DeliveryOutcome = "accepted" | "retryable" | "permanent" | "uncertain";
type DeliveryErrorCode = "invalid_email_payload" | "provider_invalid_response" | "provider_http_error" | "provider_unavailable";
export type EmailFailure = { stage: "claim" | "start" | "send" | "finish"; code: DeliveryErrorCode | "claim_rpc_failed" | "start_rpc_failed" | "finish_rpc_failed"; httpStatus?: number };
export class DeliveryFailure extends Error {
  constructor(readonly outcome: Exclude<DeliveryOutcome, "accepted">, readonly code: DeliveryErrorCode, readonly httpStatus?: number) { super(code); }
}
type Dependencies = {
  claim: () => Promise<EmailJob[]>;
  start: (job: EmailJob) => Promise<void>;
  send: (job: EmailJob) => Promise<void>;
  finish: (job: EmailJob, outcome: DeliveryOutcome, code: string | null) => Promise<void>;
  report: (failure: EmailFailure) => void;
  now?: () => number;
  budgetMs?: number;
};
export type EmailRun = {
  status: "ok" | "not_configured" | "failed";
  configured: boolean; claimed: number; accepted: number; sent: number; failed: number; deferred: number;
  acknowledgementFailed: number; errors: EmailFailure[];
};
export const unconfiguredEmailRun = (): EmailRun => ({ status: "not_configured", configured: false, claimed: 0, accepted: 0, sent: 0, failed: 0, deferred: 0, acknowledgementFailed: 0, errors: [] });

/** No provider or RPC error messages, recipients or payloads escape this worker. */
export async function processEmailBatch(deps: Dependencies): Promise<EmailRun> {
  const result: EmailRun = { ...unconfiguredEmailRun(), status: "ok", configured: true };
  const now = deps.now ?? Date.now, deadline = now() + (deps.budgetMs ?? 15_000);
  const fail = (failure: EmailFailure) => { result.status = "failed"; result.errors.push(failure); deps.report(failure); };
  let jobs: EmailJob[];
  try {
    jobs = await deps.claim();
    if (!Array.isArray(jobs) || jobs.some((job) => !job?.id || !job.lease_token)) throw new Error("invalid_batch");
    result.claimed = jobs.length;
  } catch { fail({ stage: "claim", code: "claim_rpc_failed" }); return result; }
  for (const [index, job] of jobs.entries()) {
    // Unstarted jobs retain no uncertain-delivery marker and can be reclaimed after the lease expires.
    if (now() >= deadline) { result.deferred = jobs.length - index; break; }
    try { await deps.start(job); }
    catch { fail({ stage: "start", code: "start_rpc_failed" }); result.deferred++; continue; }
    let outcome: DeliveryOutcome = "accepted", code: string | null = null;
    try { await deps.send(job); result.accepted++; }
    catch (error) {
      const failure = error instanceof DeliveryFailure ? error : new DeliveryFailure("uncertain", "provider_unavailable");
      outcome = failure.outcome; code = failure.code; result.failed++;
      fail({ stage: "send", code: failure.code, ...(failure.httpStatus ? { httpStatus: failure.httpStatus } : {}) });
    }
    try {
      await deps.finish(job, outcome, code);
      if (outcome === "accepted") result.sent++;
    } catch {
      result.acknowledgementFailed++;
      fail({ stage: "finish", code: "finish_rpc_failed" });
    }
  }
  return result;
}
