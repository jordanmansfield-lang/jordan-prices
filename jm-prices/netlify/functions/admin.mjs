import { purgeCache } from "@netlify/functions";
import { loadContent, saveContent, resetContent, photos, assets, enquiries, photoVersion, bumpPhotoVersion, json } from "../../lib/store.js";
import { SEED_PHOTOS } from "../../lib/seed.js";
import { ADMIN_HTML } from "../../lib/admin-html.js";

function authorised(req) {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) return false;
  const h = req.headers.get("authorization") || "";
  if (!h.startsWith("Basic ")) return false;
  let decoded = "";
  try { decoded = atob(h.slice(6)); } catch { return false; }
  const given = decoded.slice(decoded.indexOf(":") + 1);
  if (given.length !== pw.length) return false;
  let diff = 0;
  for (let i = 0; i < pw.length; i++) diff |= given.charCodeAt(i) ^ pw.charCodeAt(i);
  return diff === 0;
}

const refreshPage = async () => { try { await purgeCache({ tags: ["page"] }); } catch (e) { console.error("purge failed", e); } };
const ID = /^[a-z0-9-]{1,60}$/;

export default async (req) => {
  if (!process.env.ADMIN_PASSWORD) {
    return new Response("The admin page is switched off until ADMIN_PASSWORD is set in Netlify (Site configuration → Environment variables).", { status: 503 });
  }
  if (!authorised(req)) {
    return new Response("Please sign in to edit your site.", { status: 401, headers: { "www-authenticate": 'Basic realm="Jordan Mansfield admin", charset="UTF-8"', "cache-control": "no-store" } });
  }

  const url = new URL(req.url);
  const path = url.pathname.replace(/\/+$/, "") || "/";
  const method = req.method;

  if (path === "/admin") {
    return new Response(ADMIN_HTML, { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store", "x-robots-tag": "noindex" } });
  }

  // ----- wording & prices -----
  if (path === "/api/admin/content" && method === "GET") {
    const { content, isDefault } = await loadContent();
    return json({ content, isDefault, photoVersion: await photoVersion() });
  }
  if (path === "/api/admin/content" && method === "PUT") {
    let c;
    try { c = await req.json(); } catch { return json({ error: "That didn’t look like valid content." }, 400); }
    if (!c || typeof c !== "object" || !Array.isArray(c.packages) || !c.packages.length) {
      return json({ error: "There must be at least one package." }, 400);
    }
    await saveContent(c);
    await refreshPage();
    return json({ ok: true });
  }
  if (path === "/api/admin/content/reset" && method === "POST") {
    await resetContent();
    await refreshPage();
    return json({ ok: true });
  }

  // ----- photos -----
  if (path === "/api/admin/photos" && method === "GET") {
    const { blobs } = await photos().list();
    const uploaded = new Set(blobs.map((b) => b.key.replace(/-(l|s)\.jpg$/, "")));
    const all = [...new Set([...uploaded, ...SEED_PHOTOS])].sort();
    return json({
      version: await photoVersion(),
      photos: all.map((id) => ({ id, uploaded: uploaded.has(id), starter: SEED_PHOTOS.includes(id) }))
    });
  }
  let m = path.match(/^\/api\/admin\/photos\/([a-z0-9-]+)\/(l|s)$/);
  if (m && method === "PUT") {
    if (!ID.test(m[1])) return json({ error: "Photo names can only use a–z, 0–9 and dashes." }, 400);
    const buf = await req.arrayBuffer();
    if (!buf.byteLength) return json({ error: "That photo was empty." }, 400);
    if (buf.byteLength > 5_500_000) return json({ error: "That photo is too large even after resizing. Try a smaller file." }, 413);
    const head = new Uint8Array(buf.slice(0, 3));
    if (!(head[0] === 0xff && head[1] === 0xd8)) return json({ error: "Photos must be JPEGs." }, 415);
    await photos().set(`${m[1]}-${m[2]}.jpg`, buf, { metadata: { at: new Date().toISOString() } });
    let version;
    if (m[2] === "l") { version = await bumpPhotoVersion(); await refreshPage(); }
    return json({ ok: true, version });
  }
  m = path.match(/^\/api\/admin\/photos\/([a-z0-9-]+)$/);
  if (m && method === "DELETE") {
    await photos().delete(`${m[1]}-l.jpg`);
    await photos().delete(`${m[1]}-s.jpg`);
    const version = await bumpPhotoVersion();
    await refreshPage();
    return json({ ok: true, version });
  }

  // ----- favicon (kept separate from the photo library: PNG, so it can stay transparent) -----
  if (path === "/api/admin/favicon" && method === "PUT") {
    const buf = await req.arrayBuffer();
    if (!buf.byteLength) return json({ error: "That favicon was empty." }, 400);
    if (buf.byteLength > 2_000_000) return json({ error: "That favicon is too large. Try a smaller file." }, 413);
    const head = new Uint8Array(buf.slice(0, 8));
    if (!(head[0] === 0x89 && head[1] === 0x50 && head[2] === 0x4e && head[3] === 0x47)) {
      return json({ error: "Favicons must be PNGs (so they can stay transparent)." }, 415);
    }
    await assets().set("favicon.png", buf, { metadata: { at: new Date().toISOString() } });
    const version = await bumpPhotoVersion();
    await refreshPage();
    return json({ ok: true, version });
  }
  if (path === "/api/admin/favicon" && method === "DELETE") {
    await assets().delete("favicon.png");
    const version = await bumpPhotoVersion();
    await refreshPage();
    return json({ ok: true, version });
  }

  // ----- enquiries -----
  if (path === "/api/admin/enquiries" && method === "GET") {
    const { blobs } = await enquiries().list();
    const keys = blobs.map((b) => b.key).sort().reverse().slice(0, 100);
    const items = (await Promise.all(keys.map((k) => enquiries().get(k, { type: "json" }).catch(() => null)))).filter(Boolean);
    return json({ items });
  }

  return json({ error: "Not found" }, 404);
};

export const config = { path: ["/admin", "/api/admin/*"] };
