import { getStore } from "@netlify/blobs";
import { DEFAULT_CONTENT } from "./content.js";

const site = () => getStore({ name: "jm-site", consistency: "strong" });
export const photos = () => getStore({ name: "jm-photos", consistency: "strong" });
export const enquiries = () => getStore({ name: "jm-enquiries", consistency: "strong" });
// Separate from photos(): a one-off site asset (currently just the favicon), not part of the reusable photo library.
export const assets = () => getStore({ name: "jm-assets", consistency: "strong" });

export async function loadContent() {
  try {
    const c = await site().get("content", { type: "json" });
    if (c && typeof c === "object") return { content: c, isDefault: false };
  } catch (e) { console.error("loadContent", e); }
  return { content: structuredClone(DEFAULT_CONTENT), isDefault: true };
}

export async function saveContent(c) {
  await site().setJSON("content", c);
}

export async function resetContent() {
  await site().delete("content");
}

export async function photoVersion() {
  try {
    const m = await site().get("meta", { type: "json" });
    return (m && m.photoVersion) || 1;
  } catch { return 1; }
}

export async function bumpPhotoVersion() {
  const v = (await photoVersion()) + 1;
  await site().setJSON("meta", { photoVersion: v });
  return v;
}

export const json = (data, status = 200, headers = {}) =>
  new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", ...headers } });
