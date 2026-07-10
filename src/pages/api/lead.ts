import type { APIRoute } from 'astro';
import { z } from 'zod';

// On-demand (serverless) — never prerendered, so the CRM webhook and all
// validation stay on the server and never reach the browser bundle.
export const prerender = false;

/**
 * LeadConnector (GoHighLevel) inbound webhook. Overridable via GHL_WEBHOOK_URL
 * (a NON-public env var, so it is never exposed to the client); falls back to
 * the project's hook so lead capture works out of the box.
 */
const WEBHOOK_URL =
  import.meta.env.GHL_WEBHOOK_URL ||
  process.env.GHL_WEBHOOK_URL ||
  'https://services.leadconnectorhq.com/hooks/rkoTeMpH1JMhaScjSehR/webhook-trigger/d94f9b9d-9a60-48c7-8d0c-04dd2a79dc5b';

// Required minimum: name + phone + consent. Email, reason and message optional.
const schema = z.object({
  name: z.string().trim().min(2).max(120),
  phone: z
    .string()
    .trim()
    .max(40)
    .refine((v) => v.replace(/\D/g, '').length >= 7, 'invalid phone'),
  // Empty string → undefined, so an optional email isn't validated as an address.
  email: z.preprocess(
    (v) => (v === '' || v == null ? undefined : v),
    z.string().trim().email().max(160).optional(),
  ),
  reason: z.string().trim().max(40).optional(),
  message: z.string().trim().max(2000).optional(),
  consent: z.literal(true),
  language: z.enum(['en', 'es']).default('en'),
  // Honeypot — real users never see or fill this.
  company: z.string().optional(),
});

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

export const POST: APIRoute = async ({ request }) => {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return json({ ok: false, error: 'invalid_json' }, 400);
  }

  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return json({ ok: false, error: 'validation' }, 400);
  }
  const data = parsed.data;

  // Honeypot tripped: pretend success so bots don't learn, but drop the lead.
  if (data.company && data.company.trim() !== '') {
    return json({ ok: true });
  }

  const parts = data.name.trim().split(/\s+/);
  const payload = {
    name: data.name,
    first_name: parts[0] ?? '',
    last_name: parts.slice(1).join(' '),
    email: data.email ?? '',
    phone: data.phone,
    reason: data.reason ?? '',
    message: data.message ?? '',
    consent: data.consent,
    language: data.language,
    source: 'orthopedicpi.com — contact form',
    submitted_at: new Date().toISOString(),
  };

  try {
    const res = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      console.error(`[lead] CRM webhook failed: ${res.status} ${res.statusText}`);
      return json({ ok: false, error: 'crm_error' }, 502);
    }
    return json({ ok: true });
  } catch (err) {
    console.error('[lead] webhook request error:', err);
    return json({ ok: false, error: 'network' }, 502);
  }
};
