// Cloudflare Pages Function: POST /api/contact
import { handle } from "../../server/contact/handler.mjs";
export const onRequest = (ctx) => handle(ctx.request, ctx.env);
