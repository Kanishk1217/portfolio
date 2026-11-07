import { validate } from "./validate.mjs";
import { renderEmail } from "./email.mjs";

const DEFAULT_ORIGIN = "https://kanishk-portfolio.pages.dev";
const json = (status, body, extra = {}) => new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json", ...extra } });
const cors = (origin) => ({ "access-control-allow-origin": origin, "access-control-allow-methods": "POST, OPTIONS", "access-control-allow-headers": "content-type", vary: "origin" });

async function sha(text) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("").slice(0, 32);
}

/** Store the enquiry in Supabase (service role, server side only) and email the owner. Never trusts the browser. */
export async function handle(request, env, fetchImpl = fetch) {
  const allowed = (env.ALLOWED_ORIGINS || DEFAULT_ORIGIN).split(",").map((s) => s.trim()).filter(Boolean);
  const origin = request.headers.get("origin") || "";
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: allowed.includes(origin) ? cors(origin) : {} });
  if (request.method !== "POST") return json(405, { ok: false });
  if (origin && !allowed.includes(origin)) return json(403, { ok: false });
  const headers = origin ? cors(origin) : {};

  const raw = await request.text();
  if (raw.length > 10_000) return json(413, { ok: false }, headers);
  let body; try { body = JSON.parse(raw); } catch { return json(400, { ok: false, errors: { body: "Invalid request." } }, headers); }

  const v = validate(body);
  if (v.spam) return json(200, { ok: true }, headers);               // look successful to bots, store nothing
  if (!v.ok) return json(400, { ok: false, errors: v.errors }, headers);

  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) return json(500, { ok: false }, headers);
  const sb = { apikey: env.SUPABASE_SERVICE_ROLE_KEY, authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`, "content-type": "application/json" };
  const rest = `${env.SUPABASE_URL.replace(/\/$/, "")}/rest/v1/contact_requests`;
  const ipHash = await sha((request.headers.get("cf-connecting-ip") || "unknown") + (env.IP_SALT || ""));

  try {
    const since = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    const recent = await fetchImpl(`${rest}?select=id&ip_hash=eq.${ipHash}&created_at=gte.${encodeURIComponent(since)}&limit=3`, { headers: sb });
    if (recent.ok && (await recent.json()).length >= 3) return json(429, { ok: false, errors: { rate: "Too many messages. Please try again later." } }, headers);

    const ins = await fetchImpl(rest, { method: "POST", headers: { ...sb, prefer: "return=representation" },
      body: JSON.stringify({ ...v.value, source: "portfolio", page_url: request.headers.get("referer") || origin || null, ip_hash: ipHash }) });
    if (!ins.ok) return json(500, { ok: false }, headers);
    const id = (await ins.json())[0]?.id;

    let patch = null;
    if (env.RESEND_API_KEY) {
      const mail = renderEmail(v.value, { at: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "medium", timeStyle: "short" }) + " IST", page: request.headers.get("referer") || "the portfolio" });
      const res = await fetchImpl("https://api.resend.com/emails", { method: "POST",
        headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, "content-type": "application/json" },
        body: JSON.stringify({ from: env.MAIL_FROM || "Portfolio <onboarding@resend.dev>", to: [env.NOTIFY_TO || "kanishkpansari1217@gmail.com"],
          ...(v.value.email ? { reply_to: v.value.email } : {}), subject: mail.subject, html: mail.html, text: mail.text }) });
      patch = res.ok ? { notified_at: new Date().toISOString() } : { notify_error: `email provider returned ${res.status}` };
    } else patch = { notify_error: "RESEND_API_KEY not set" };
    if (id) await fetchImpl(`${rest}?id=eq.${id}`, { method: "PATCH", headers: sb, body: JSON.stringify(patch) });
    return json(200, { ok: true }, headers);
  } catch {
    return json(500, { ok: false }, headers);
  }
}
