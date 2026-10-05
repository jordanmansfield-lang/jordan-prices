import { loadContent, enquiries, json } from "../../lib/store.js";
import { buildQuote, cleanEnquiry, emailToJordan, emailToCouple, sendEmail } from "../../lib/quote.js";

export default async (req) => {
  if (req.method !== "POST") return json({ ok: false, error: "Method not allowed" }, 405);
  let body;
  try { body = await req.json(); } catch { return json({ ok: false, error: "Something went wrong reading that. Please try again." }, 400); }

  // Spam trap: real visitors never see or fill the hidden "company" field.
  if (body.company) return json({ ok: true });

  let e, q, content;
  try {
    ({ content } = await loadContent());
    e = cleanEnquiry(body);
    q = buildQuote(content, body);
  } catch (err) {
    return json({ ok: false, error: err.message }, 400);
  }

  const id = `${new Date().toISOString()}-${Math.random().toString(36).slice(2, 7)}`;
  const record = { id, at: new Date().toISOString(), ...e, lines: q.lines, totalText: q.totalText, sentToJordan: false, sentToCouple: false };

  const to = process.env.TO_EMAIL || (content.contact && content.contact.email);
  try {
    const m = emailToJordan(content, e, q);
    await sendEmail({ to, subject: m.subject, html: m.html, text: m.text, replyTo: e.email });
    record.sentToJordan = true;
  } catch (err) {
    console.error("email to Jordan failed", err);
    record.error = String(err.message || err);
  }
  try {
    const m = emailToCouple(content, e, q);
    await sendEmail({ to: e.email, subject: m.subject, html: m.html, text: m.text, replyTo: to });
    record.sentToCouple = true;
  } catch (err) {
    console.error("email to couple failed", err);
    record.coupleError = String(err.message || err);
  }

  // Keep a copy in case an email ever goes astray (visible in /admin).
  await enquiries().setJSON(id, record).catch((err) => console.error("save enquiry failed", err));

  if (!record.sentToJordan) {
    return json({ ok: false, error: `Sorry, that didn’t send. Please email me directly at ${to}.` }, 502);
  }
  return json({ ok: true });
};

export const config = { path: "/api/enquiry" };
