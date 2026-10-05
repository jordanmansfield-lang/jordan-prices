import { esc, gbp } from "./render.js";

// Works out the selection from the stored prices (never trusts prices sent by the browser).
export function buildQuote(c, body) {
  const pk = c.packages || [];
  const p = pk[Number.isInteger(body.pkg) ? body.pkg : 0];
  if (!p) throw new Error("Please choose a package.");
  const fe = (c.extras && c.extras.filmExtras) || [];
  const ad = (c.extras && c.extras.addOns) || [];
  const uniq = (a) => [...new Set(Array.isArray(a) ? a.filter(Number.isInteger) : [])];
  const film = p.includesFilm ? uniq(body.film).map((i) => fe[i]).filter(Boolean) : [];
  const addOns = uniq(body.addons).map((i) => ad[i]).filter(Boolean);

  const lines = [{ name: p.name, price: +p.price || 0, from: !!p.priceIsFrom }];
  film.forEach((f) => lines.push({ name: f.name, price: +f.price || 0, from: false }));
  addOns.forEach((a) => lines.push({ name: a.name, price: +a.price || 0, from: !!a.priceIsFrom }));
  const total = lines.reduce((s, l) => s + l.price, 0);
  const from = lines.some((l) => l.from);
  return { lines, total, from, totalText: (from ? "from " : "") + gbp(total) };
}

export function cleanEnquiry(body) {
  const s = (v, max) => String(v ?? "").trim().slice(0, max);
  const e = {
    names: s(body.names, 120),
    email: s(body.email, 200),
    phone: s(body.phone, 40),
    date: s(body.date, 20),
    venue: s(body.venue, 200),
    message: s(body.message, 3000)
  };
  if (!e.names) throw new Error("Please add your names.");
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e.email)) throw new Error("Please add a valid email address so I can reply.");
  if (e.date && !/^\d{4}-\d{2}-\d{2}$/.test(e.date)) e.date = "";
  return e;
}

export function prettyDate(iso) {
  if (!iso) return "";
  const d = new Date(iso + "T12:00:00Z");
  return isNaN(d) ? iso : d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}

const row = (k, v) => v ? `<tr><td style="padding:6px 16px 6px 0;color:#6b6a65;font-size:13px;letter-spacing:.06em;text-transform:uppercase;vertical-align:top;white-space:nowrap">${esc(k)}</td><td style="padding:6px 0;font-size:15px;color:#1c1c1a">${v}</td></tr>` : "";

function selectionTable(q) {
  return `<table role="presentation" style="width:100%;border-collapse:collapse;margin:8px 0 4px">
${q.lines.map((l) => `<tr><td style="padding:8px 0;border-bottom:1px solid #e3e2dd;font-size:15px">${esc(l.name)}</td><td style="padding:8px 0;border-bottom:1px solid #e3e2dd;font-size:15px;text-align:right;white-space:nowrap">${l.from ? "from " : ""}${gbp(l.price)}</td></tr>`).join("")}
<tr><td style="padding:12px 0 0;font-size:13px;letter-spacing:.14em;text-transform:uppercase;color:#6b6a65">Estimated total</td><td style="padding:12px 0 0;font-size:22px;text-align:right;font-family:Georgia,serif">${esc(q.totalText)}</td></tr>
</table>`;
}

function shell(inner) {
  return `<!doctype html><html><body style="margin:0;background:#f4f4f1;padding:24px 12px;font-family:Helvetica,Arial,sans-serif;color:#1c1c1a">
<div style="max-width:560px;margin:0 auto;background:#ffffff;padding:32px 28px">
<div style="font-size:12px;letter-spacing:.38em;text-transform:uppercase;color:#1c1c1a;margin-bottom:24px">Jordan Mansfield</div>
${inner}
</div></body></html>`;
}

export function emailToJordan(c, e, q) {
  const details = `<table role="presentation" style="border-collapse:collapse;margin:0 0 20px">
${row("Names", esc(e.names))}
${row("Email", `<a href="mailto:${esc(e.email)}" style="color:#1c1c1a">${esc(e.email)}</a>`)}
${row("Phone", esc(e.phone))}
${row("Date", esc(prettyDate(e.date)))}
${row("Venue", esc(e.venue))}
</table>`;
  const msg = e.message ? `<p style="font-size:13px;letter-spacing:.14em;text-transform:uppercase;color:#6b6a65;margin:24px 0 6px">Their message</p><p style="font-size:15px;line-height:1.6;white-space:pre-wrap;margin:0">${esc(e.message)}</p>` : "";
  const html = shell(`<h1 style="font-family:Georgia,serif;font-weight:normal;font-size:22px;margin:0 0 18px">New enquiry from ${esc(e.names)}</h1>
${details}
<p style="font-size:13px;letter-spacing:.14em;text-transform:uppercase;color:#6b6a65;margin:0 0 4px">Their selection</p>
${selectionTable(q)}
${msg}
<p style="font-size:13px;color:#6b6a65;margin:28px 0 0">Hit reply to answer ${esc(e.names)} directly.</p>`);
  const text = [`New enquiry from ${e.names}`, "", `Email: ${e.email}`, e.phone && `Phone: ${e.phone}`, e.date && `Date: ${prettyDate(e.date)}`, e.venue && `Venue: ${e.venue}`, "", "Selection:", ...q.lines.map((l) => `- ${l.name}: ${l.from ? "from " : ""}${gbp(l.price)}`), `Estimated total: ${q.totalText}`, e.message && `\nMessage:\n${e.message}`].filter(Boolean).join("\n");
  return { subject: `${(c.emails && c.emails.jordanSubject) || "New enquiry"}: ${e.names}${e.date ? " · " + prettyDate(e.date) : ""}`, html, text };
}

export function emailToCouple(c, e, q) {
  const E = c.emails || {};
  const html = shell(`<p style="font-size:16px;line-height:1.6;margin:0 0 14px">Hi ${esc(e.names)},</p>
<p style="font-size:16px;line-height:1.6;margin:0 0 22px">${esc(E.coupleIntro)}</p>
${e.date || e.venue ? `<table role="presentation" style="border-collapse:collapse;margin:0 0 16px">${row("Date", esc(prettyDate(e.date)))}${row("Venue", esc(e.venue))}</table>` : ""}
${selectionTable(q)}
${q.from ? `<p style="font-size:13px;color:#6b6a65;line-height:1.5;margin:10px 0 0">${esc(c.builder && c.builder.fromNote)}</p>` : ""}
<p style="font-size:16px;line-height:1.6;margin:26px 0 0;white-space:pre-line">${esc(E.coupleSignoff)}</p>`);
  const text = [`Hi ${e.names},`, "", E.coupleIntro, "", ...q.lines.map((l) => `- ${l.name}: ${l.from ? "from " : ""}${gbp(l.price)}`), `Estimated total: ${q.totalText}`, "", E.coupleSignoff].join("\n");
  return { subject: E.coupleSubject || "Your wedding enquiry", html, text };
}

export async function sendEmail({ to, subject, html, text, replyTo }) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.FROM_EMAIL;
  if (!key || !from) throw new Error("Email sending isn't set up yet (RESEND_API_KEY / FROM_EMAIL missing).");
  if (process.env.EMAIL_DRY_RUN === "1") { console.log("DRY RUN email", { to, subject }); return { id: "dry-run" }; }
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
    body: JSON.stringify({ from, to: [to], subject, html, text, reply_to: replyTo })
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(`Resend ${r.status}: ${j.message || JSON.stringify(j)}`);
  return j;
}
