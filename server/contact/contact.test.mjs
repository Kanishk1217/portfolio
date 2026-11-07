import test from "node:test";
import assert from "node:assert/strict";
import { validate } from "./validate.mjs";
import { renderEmail, escapeHtml } from "./email.mjs";
import { handle } from "./handler.mjs";

const ENV = { SUPABASE_URL: "https://x.supabase.co", SUPABASE_SERVICE_ROLE_KEY: "svc", RESEND_API_KEY: "rk", NOTIFY_TO: "me@example.com" };
const ORIGIN = "https://kanishk-portfolio.pages.dev";
const post = (body, headers = {}) => new Request("https://kanishk-portfolio.pages.dev/api/contact", { method: "POST", headers: { origin: ORIGIN, "content-type": "application/json", ...headers }, body: JSON.stringify(body) });

// stub fetch: records calls, returns scripted responses by URL
function stub({ recent = [], insertOk = true, mailOk = true } = {}) {
  const calls = [];
  const impl = async (url, init = {}) => {
    calls.push({ url: String(url), method: init.method || "GET", body: init.body ? JSON.parse(init.body) : null, headers: init.headers });
    const u = String(url);
    if (u.includes("api.resend.com")) return new Response("{}", { status: mailOk ? 200 : 500 });
    if (init.method === "POST") return insertOk ? new Response(JSON.stringify([{ id: "abc" }]), { status: 201 }) : new Response("{}", { status: 500 });
    if (init.method === "PATCH") return new Response(null, { status: 204 });
    return new Response(JSON.stringify(recent), { status: 200 });
  };
  return { calls, impl };
}

test("validate: email only is fine", () => assert.equal(validate({ email: "a@b.co" }).ok, true));
test("validate: phone only is fine", () => assert.equal(validate({ phone: "+91 95127 82280" }).ok, true));
test("validate: nothing to reply to is rejected", () => assert.ok(validate({ note: "hi" }).errors.contact));
test("validate: bad email rejected", () => assert.ok(validate({ email: "not-an-email" }).errors.email));
test("validate: line break in email (header injection) rejected", () => assert.ok(validate({ email: "a@b.co\nBcc: x@y.z" }).errors.email));
test("validate: short phone rejected", () => assert.ok(validate({ phone: "12345" }).errors.phone));
test("validate: every listed service is accepted", () => { for (const sv of ["ai_chatbot","machine_learning","web_development","ai_dashboard","automation","other"]) assert.equal(validate({ email: "a@b.co", service: sv }).ok, true); });
test("validate: old service names are no longer accepted", () => assert.ok(validate({ email: "a@b.co", service: "website" }).errors.service));
test("validate: unknown service rejected", () => assert.ok(validate({ email: "a@b.co", service: "hack" }).errors.service));
test("validate: long note rejected", () => assert.ok(validate({ email: "a@b.co", note: "x".repeat(1001) }).errors.note));
test("validate: honeypot marks spam", () => assert.equal(validate({ email: "a@b.co", website: "http://spam" }).spam, true));
test("validate: non-object input does not throw", () => assert.equal(validate(null).ok, false));

test("email: visitor html is escaped", () => {
  const m = renderEmail({ email: "a@b.co", note: '<script>alert(1)</script>', phone: null, service: null });
  assert.ok(!m.html.includes("<script>"));
  assert.ok(m.html.includes("&lt;script&gt;"));
  assert.equal(escapeHtml(`"'<>&`), "&quot;&#39;&lt;&gt;&amp;");
});

test("handler: happy path stores, emails, marks notified", async () => {
  const s = stub(); const res = await handle(post({ email: "a@b.co", service: "ai_chatbot", note: "hello" }), ENV, s.impl);
  assert.equal(res.status, 200);
  const kinds = s.calls.map((c) => `${c.method} ${c.url.includes("resend") ? "resend" : "supabase"}`);
  assert.deepEqual(kinds, ["GET supabase", "POST supabase", "POST resend", "PATCH supabase"]);
  assert.equal(s.calls[2].body.to[0], "me@example.com");
  assert.equal(s.calls[2].body.reply_to, "a@b.co");
  assert.ok(s.calls[3].body.notified_at);
  assert.ok(s.calls[0].headers.authorization.startsWith("Bearer "));
});
test("handler: the notification email shows the time in IST", async () => {
  const s = stub(); await handle(post({ email: "a@b.co", service: "ai_chatbot" }), ENV, s.impl);
  const mail = s.calls.find((c) => c.url.includes("resend")).body;
  assert.match(mail.html, /IST/); assert.ok(!/GMT/.test(mail.html));
});
test("handler: honeypot stores nothing but looks successful", async () => {
  const s = stub(); const res = await handle(post({ email: "a@b.co", website: "spam" }), ENV, s.impl);
  assert.equal(res.status, 200); assert.equal(s.calls.length, 0);
});
test("handler: invalid input is a 400 and stores nothing", async () => {
  const s = stub(); const res = await handle(post({ note: "x" }), ENV, s.impl);
  assert.equal(res.status, 400); assert.equal(s.calls.length, 0);
});
test("handler: foreign origin is refused", async () => {
  const s = stub(); const res = await handle(post({ email: "a@b.co" }, { origin: "https://evil.example" }), ENV, s.impl);
  assert.equal(res.status, 403); assert.equal(s.calls.length, 0);
});
test("handler: three recent messages from one visitor gets a 429", async () => {
  const s = stub({ recent: [{ id: 1 }, { id: 2 }, { id: 3 }] }); const res = await handle(post({ email: "a@b.co" }), ENV, s.impl);
  assert.equal(res.status, 429); assert.ok(!s.calls.some((c) => c.method === "POST"));
});
test("handler: oversized body refused", async () => {
  const s = stub(); const res = await handle(post({ email: "a@b.co", note: "x".repeat(20000) }), ENV, s.impl);
  assert.equal(res.status, 413);
});
test("handler: missing Supabase config is a generic 500", async () => {
  const s = stub(); const res = await handle(post({ email: "a@b.co" }), { RESEND_API_KEY: "rk" }, s.impl);
  assert.equal(res.status, 500); assert.equal((await res.json()).ok, false);
});
test("handler: email provider failure still saves and records the error", async () => {
  const s = stub({ mailOk: false }); const res = await handle(post({ email: "a@b.co" }), ENV, s.impl);
  assert.equal(res.status, 200);
  assert.match(s.calls.at(-1).body.notify_error, /500/);
});
test("handler: no email key is recorded, not hidden", async () => {
  const s = stub(); const res = await handle(post({ email: "a@b.co" }), { ...ENV, RESEND_API_KEY: undefined }, s.impl);
  assert.equal(res.status, 200); assert.match(s.calls.at(-1).body.notify_error, /RESEND_API_KEY/);
});
test("handler: secrets never appear in a response", async () => {
  const s = stub(); const res = await handle(post({ email: "a@b.co" }), ENV, s.impl);
  const text = await res.text(); assert.ok(!text.includes("svc") && !text.includes("rk"));
});
