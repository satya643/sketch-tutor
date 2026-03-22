/** Map OpenAI / SDK errors to short, actionable UI copy. */
export function friendlyOpenAiError(err: unknown): { message: string; status: number } {
  const raw = err instanceof Error ? err.message : String(err);
  const lower = raw.toLowerCase();

  if (/billing hard limit|hard limit has been reached|insufficient_quota|exceeded your current quota|billing_not_active/i.test(lower)) {
    return {
      message:
        "OpenAI billing limit reached or no credits. Fix: platform.openai.com → Settings → Billing — add a payment method, increase your monthly limit, or buy credits. Then restart the app and try AI Tutorial again.",
      status: 402,
    };
  }

  if (/401|invalid api key|incorrect api key|invalid_api_key/i.test(lower)) {
    return {
      message:
        "OpenAI rejected the API key. Check OPENAI_API_KEY in .env.local (no quotes/spaces), save, and restart `npm run dev`.",
      status: 401,
    };
  }

  if (/429|rate limit/i.test(lower)) {
    return {
      message: "OpenAI rate limit — wait a minute and try again.",
      status: 429,
    };
  }

  return { message: raw.length > 500 ? `${raw.slice(0, 500)}…` : raw, status: 500 };
}
