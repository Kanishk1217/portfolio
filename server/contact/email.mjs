// DEFAULT notification email. Kanishk will replace renderEmail() with his own HTML design from the UI/UX session.
// Rule for any replacement: every value from the visitor MUST go through escapeHtml().
export const escapeHtml = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

export function renderEmail(v, meta = {}) {
  const labels = {
    ai_chatbot: "AI chatbot for my business",
    machine_learning: "Machine learning and data science",
    web_development: "Website or web app development",
    ai_dashboard: "AI dashboards and analytics",
    automation: "Business automation (email, sheets, WhatsApp)",
    other: "Something else",
  };
  const service = v.service ? labels[v.service] || v.service : "";
  const via = v.email ? "Email" : "Phone";
  const reach = v.email || v.phone || "";
  const href = v.email ? `mailto:${v.email}` : `tel:${String(v.phone ?? "").replace(/[^\d+]/g, "")}`;
  const cta = v.email ? "Reply by email" : "Call now";
  const at = meta.at || "";
  const page = meta.page || "the portfolio";
  const font = "-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif";
  const serif = "Georgia,'Times New Roman',serif";
  const row = (label, inner) =>
    `<tr><td class="lbl" style="padding:18px 32px 0 32px;font-family:${font};font-size:12px;line-height:16px;letter-spacing:1.5px;text-transform:uppercase;color:#5f5f66">${escapeHtml(label)}</td></tr>` +
    `<tr><td class="val" style="padding:6px 32px 0 32px;font-family:${font};font-size:18px;line-height:26px;color:#0d0d0d;word-break:break-word">${inner}</td></tr>`;
  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light dark"><meta name="supported-color-schemes" content="light dark">
<title>New enquiry</title>
<style>
:root{color-scheme:light dark;supported-color-schemes:light dark}
@media (prefers-color-scheme:dark){
.bg{background:#0d0d0d !important}
.card{background:#161618 !important;border-color:#2a2b31 !important}
.lbl{color:#a8a8b0 !important}
.val{color:#ededed !important}
.val a{color:#ededed !important}
.foot{color:#a8a8b0 !important;border-color:#2a2b31 !important}
.btn{background:#ededed !important}
.btn a{color:#0d0d0d !important}
}
@media only screen and (max-width:620px){.wrap{width:100% !important}}
</style></head>
<body class="bg" style="margin:0;padding:0;background:#f1f0ec">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent">${escapeHtml(reach)}${service ? " needs: " + escapeHtml(service) : ""}</div>
<table role="presentation" class="bg" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f1f0ec"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" class="wrap card" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:100%;background:#ffffff;border:1px solid #e0dfd9;border-radius:8px">
<tr><td style="background:#0d0d0d;border-radius:7px 7px 0 0;padding:20px 32px">
<div style="font-family:${serif};font-style:italic;font-size:20px;line-height:26px;color:#ededed">Kanishk Pansari</div>
<div style="font-family:${font};font-size:11px;line-height:16px;letter-spacing:2px;text-transform:uppercase;color:#b4b4bb;padding-top:2px">Portfolio contact form</div>
</td></tr>
<tr><td style="padding:32px 32px 0 32px">
<div class="val" style="font-family:${serif};font-size:28px;line-height:34px;color:#0d0d0d">Someone wants to get in touch</div>
</td></tr>
${row("Reach them by " + via.toLowerCase(), `<a href="${escapeHtml(href)}" style="color:#0d0d0d;text-decoration:underline">${escapeHtml(reach)}</a>`)}
${service ? row("They need", escapeHtml(service)) : ""}
${v.note ? row("Note", `<span style="white-space:pre-wrap">${escapeHtml(v.note)}</span>`) : ""}
${at ? row("Received", escapeHtml(at)) : ""}
<tr><td style="padding:28px 32px 32px 32px">
<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td class="btn" style="background:#0d0d0d;border-radius:4px">
<a href="${escapeHtml(href)}" style="display:inline-block;padding:13px 24px;font-family:${font};font-size:15px;line-height:20px;font-weight:600;color:#ffffff;text-decoration:none">${escapeHtml(cta)}</a>
</td></tr></table>
</td></tr>
<tr><td class="foot" style="padding:16px 32px;border-top:1px solid #e0dfd9;font-family:${font};font-size:12px;line-height:18px;color:#5f5f66">Sent from ${escapeHtml(page)}${v.email ? ". Replying to this email goes straight to them." : "."}</td></tr>
</table>
</td></tr></table>
</body></html>`;
  const text = [`Someone wants to get in touch`, `${via}: ${reach}`, service ? `Needs: ${service}` : "", v.note ? `Note: ${v.note}` : "", at ? `Received: ${at}` : ""].filter(Boolean).join("\n");
  return { subject: `New enquiry${service ? ": " + service : ""}`, html, text };
}
