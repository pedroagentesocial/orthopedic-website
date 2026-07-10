/**
 * Lead submission client.
 *
 * Posts to the internal `/api/lead` serverless endpoint, which validates the
 * payload and forwards it to GoHighLevel server-side. The CRM webhook URL is
 * never exposed to the browser.
 */
export interface LeadPayload {
  name: string;
  email?: string;
  phone: string;
  reason?: string;
  message?: string;
  consent: boolean;
  language: 'en' | 'es';
  /** Honeypot — must stay empty. */
  company?: string;
}

export interface SubmitResult {
  ok: boolean;
}

export async function submitLead(payload: LeadPayload): Promise<SubmitResult> {
  const response = await fetch('/api/lead', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let detail = '';
    try {
      const data = (await response.json()) as { error?: string };
      detail = data?.error ? ` (${data.error})` : '';
    } catch {
      /* non-JSON error body */
    }
    throw new Error(`Server responded ${response.status}${detail}`.trim());
  }

  return { ok: true };
}
