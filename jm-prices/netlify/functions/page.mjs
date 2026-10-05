import { loadContent, photoVersion } from "../../lib/store.js";
import { renderPage } from "../../lib/render.js";

export default async () => {
  const [{ content }, v] = await Promise.all([loadContent(), photoVersion()]);
  return new Response(renderPage(content, v), {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "public, max-age=0, must-revalidate",
      "netlify-cdn-cache-control": "public, durable, s-maxage=600, stale-while-revalidate=60",
      "cache-tag": "page"
    }
  });
};

export const config = { path: "/" };
