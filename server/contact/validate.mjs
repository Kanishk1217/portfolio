export const SERVICES = ["ai_chatbot", "machine_learning", "web_development", "ai_dashboard", "automation", "other"];
const EMAIL = /^[^\s@<>"',;]+@[^\s@<>"',;]+\.[^\s@<>"',;]{2,}$/;
const str = (v) => (typeof v === "string" ? v.trim() : "");
const hasLineBreak = (v) => /[\r\n]/.test(v);

/** Validate the public form. Returns { ok, spam, errors, value }. A filled honeypot ("website") is treated as spam. */
export function validate(input) {
  const body = input && typeof input === "object" ? input : {};
  if (str(body.website) !== "") return { ok: false, spam: true, errors: {}, value: null };
  const email = str(body.email), phone = str(body.phone), service = str(body.service);
  const note = typeof body.note === "string" ? body.note.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, "").trim() : "";
  const errors = {};
  if (!email && !phone) errors.contact = "Add an email or a phone number so I can reply.";
  if (email) {
    if (hasLineBreak(email) || email.length > 254 || !EMAIL.test(email)) errors.email = "That email does not look right.";
  }
  if (phone) {
    const digits = phone.replace(/\D/g, "");
    if (hasLineBreak(phone) || !/^[+()\d\s.-]{7,20}$/.test(phone) || digits.length < 7 || digits.length > 15) errors.phone = "That phone number does not look right.";
  }
  if (service && (hasLineBreak(service) || !SERVICES.includes(service))) errors.service = "Pick one of the listed services.";
  if (note.length > 1000) errors.note = "Keep the note under 1000 characters.";
  if (Object.keys(errors).length) return { ok: false, spam: false, errors, value: null };
  return { ok: true, spam: false, errors: {}, value: { email: email || null, phone: phone || null, service: service || null, note: note || null } };
}
