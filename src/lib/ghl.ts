/**
 * GoHighLevel webhook client.
 *
 * In production set PUBLIC_GHL_WEBHOOK_URL in your environment. Without it,
 * submissions short-circuit with a simulated success (handy for local dev
 * before the webhook is wired up).
 */
export interface LeadPayload {
  name: string;
  email: string;
  phone: string;
  reason: string;
  message: string;
  consent: boolean;
  source: string;
  language: 'en' | 'es';
  submittedAt: string;
}

export interface SubmitResult {
  ok: boolean;
  simulated?: boolean;
}

const SIMULATED_LATENCY_MS = 900;

export async function submitLeadToGHL(payload: LeadPayload): Promise<SubmitResult> {
  const webhookUrl = import.meta.env.PUBLIC_GHL_WEBHOOK_URL;

  if (!webhookUrl) {
    await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));
    if (import.meta.env.DEV) {
      console.info('[GHL] PUBLIC_GHL_WEBHOOK_URL not set — simulated submission', payload);
    }
    return { ok: true, simulated: true };
  }

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`GHL webhook failed: ${response.status}`);
  }

  return { ok: true };
}
