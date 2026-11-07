// DEFAULT notification email. Kanishk will replace renderEmail() with his own HTML design from the UI/UX session.
// Rule for any replacement: every value from the visitor MUST go through escapeHtml().
export const escapeHtml = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

export function renderEmail(v, meta = {}) {
  const rows = [["Email", v.email], ["Phone", v.phone], ["Service", v.service], ["Note", v.note]].filter(([, x]) => x);
  const html = `<!doctype html><html><body style="margin:0;background:#f6f2ea;font-family:Georgia,serif;color:#1c1a17">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:24px">
<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="background:#fff;border:1px solid #e4dccb;border-radius:10px">
<tr><td style="padding:22px 26px;border-bottom:1px solid #eee4d2"><div style="font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#8a7a52">New enquiry</div>
<div style="font-size:22px;margin-top:6px">Someone wants to talk</div></td></tr>
<tr><td style="padding:18px 26px">${rows.map(([k, x]) => `<div style="margin:10px 0"><div style="font-size:12px;color:#8a7a52">${escapeHtml(k)}</div><div style="font-size:16px;white-space:pre-wrap">${escapeHtml(x)}</div></div>`).join("")}</td></tr>
<tr><td style="padding:14px 26px;border-top:1px solid #eee4d2;font-size:12px;color:#8a7a52">Received ${escapeHtml(meta.at || "")} from ${escapeHtml(meta.page || "the portfolio")}. Reply to this email to answer them directly${v.email ? "" : ", or call the number above"}.</td></tr>
</table></td></tr></table></body></html>`;
  const text = rows.map(([k, x]) => `${k}: ${x}`).join("\n");
  return { subject: `New enquiry${v.service ? ": " + v.service : ""}`, html, text };
}
