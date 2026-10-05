import { photos, assets } from "../../lib/store.js";
import { SEED_PHOTOS } from "../../lib/seed.js";

// /img/v{version}/{photo-id}-{l|s}.jpg, or /img/v{version}/favicon.png
export default async (req) => {
  const path = new URL(req.url).pathname;

  if (/^\/img\/v\d+\/favicon\.png$/.test(path)) {
    const data = await assets().get("favicon.png", { type: "arrayBuffer" }).catch(() => null);
    if (!data) return new Response("Not found", { status: 404 });
    return new Response(data, {
      headers: {
        "content-type": "image/png",
        "cache-control": "public, max-age=31536000, immutable",
        "netlify-cdn-cache-control": "public, durable, max-age=31536000, immutable"
      }
    });
  }

  const m = path.match(/^\/img\/v\d+\/([a-z0-9-]{1,60})-(l|s)\.jpg$/);
  if (!m) return new Response("Not found", { status: 404 });
  const key = `${m[1]}-${m[2]}.jpg`;
  const data = await photos().get(key, { type: "arrayBuffer" }).catch(() => null);
  if (data) {
    return new Response(data, {
      headers: {
        "content-type": "image/jpeg",
        "cache-control": "public, max-age=31536000, immutable",
        "netlify-cdn-cache-control": "public, durable, max-age=31536000, immutable"
      }
    });
  }
  if (SEED_PHOTOS.includes(m[1])) {
    return new Response(null, { status: 302, headers: { location: `/seed/${key}`, "cache-control": "public, max-age=300" } });
  }
  return new Response("Not found", { status: 404 });
};

export const config = { path: "/img/*" };
