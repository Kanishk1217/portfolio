# Contact form backend

Status: code and tests done (21 passing). NOT yet tested against a real Supabase project or a real Resend account, because those need your keys.

## UI contract (the UI/UX session can build against this now)

`POST /api/contact` with JSON:

| field | required | notes |
|---|---|---|
| `email` | one of email or phone | valid address |
| `phone` | one of email or phone | 7 to 15 digits, may include `+`, spaces, `-`, `()` |
| `service` | no | one of `ai_chatbot`, `machine_learning`, `web_development`, `ai_dashboard`, `automation`, `other` (the UI shows a dropdown, never free text) |
| `note` | no | NOT used by the UI. The backend accepts it but the form does not show it |
| `website` | must stay empty | hidden spam trap. Render it as a visually hidden input (not `display:none` only), `tabindex="-1"`, `autocomplete="off"`, and send it as an empty string |

Responses: `200 {ok:true}` saved. `400 {ok:false, errors:{contact|email|phone|service|note}}` show the message next to the field. `429` too many messages from one visitor, try later. `403/413/500` show a generic "could not send, please email me" with the email address.

Collect as little as possible: that is why only contact route, an optional service and an optional note exist.

## What it does
1. Validates input (no line breaks in fields, strict lengths, honeypot, allowed origins only).
2. Rate limits: 3 messages per visitor per 10 minutes (visitor is a salted hash of the IP, the IP itself is never stored).
3. Saves a row in `contact_requests` (Supabase, service role key, server side only).
4. Emails you through Resend with the visitor's address as reply-to. If email fails, the row is still saved and `notify_error` says why.

## The email template
`server/contact/email.mjs` has a default HTML email. Replace `renderEmail()` with your own design. Rule: every visitor value must go through `escapeHtml()`. A test fails if escaping is removed.

## One-time setup (yours, I cannot enter secrets)
1. Supabase: create a project (or use an existing one). SQL editor, paste and run `supabase/migrations/20261107000000_contact_and_leads.sql`, then `20261107010000_contact_services_v2.sql`. It also creates the `leads`, `job_leads`, `outreach_events` and `suppression` tables for the outreach system. Row level security is on and there are no public policies, so nothing is readable from a browser.
2. Cloudflare Pages, project `kanishk-portfolio`, Settings, Variables and Secrets (Production):
   - `SUPABASE_URL` (the project URL)
   - `SUPABASE_SERVICE_ROLE_KEY` (secret. Never put it in front-end code or any `NEXT_PUBLIC_` variable)
   - `RESEND_API_KEY` (secret)
   - optional: `NOTIFY_TO` (default kanishkpansari1217@gmail.com), `MAIL_FROM`, `ALLOWED_ORIGINS` (comma separated, default the pages.dev address), `IP_SALT` (any random string)
3. Resend: the free sandbox sender (`onboarding@resend.dev`) only delivers to the email the Resend account was created with. Create the Resend account with kanishkpansari1217@gmail.com, or verify a domain later.
4. Deploy from the repo root so the `functions/` folder is included (git push to the Pages project, or `wrangler pages deploy out`).

## Tests
`node --test server/contact/contact.test.mjs` (Node 22).
