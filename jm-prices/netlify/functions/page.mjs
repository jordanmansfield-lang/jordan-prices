import { loadContent, photoVersion } from "../../lib/store.js";
import { renderPage } from "../../lib/render.js";

export default async (req) => {
  const [{ content }, v] = await Promise.all([loadContent(), photoVersion()]);

  const path = new URL(req.url).pathname;
  let venue;
  if (path.startsWith("/venue/")) {
    const slug = decodeURIComponent(path.slice("/venue/".length)).replace(/\/+$/, "").trim().toLowerCase();
    venue = (content.venues || []).find((x) => String(x.slug || "").trim().toLowerCase() === slug);
    if (!venue) return new Response("That venue page couldn’t be found.", { status: 404 });
  }

  return new Response(renderPage(content, v, venue), {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "public, max-age=0, must-revalidate",
      "netlify-cdn-cache-control": "public, durable, s-maxage=600, stale-while-revalidate=60",
      "cache-tag": "page"
    }
  });
};

export const config = { path: ["/", "/venue/*"] };
