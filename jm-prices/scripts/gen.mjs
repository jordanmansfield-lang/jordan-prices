// Regenerates lib/site-css.js and lib/admin-html.js from their source files.
// Run with: node scripts/gen.mjs
import { readFileSync, writeFileSync } from "node:fs";
const css = readFileSync(new URL("../lib/site.css", import.meta.url), "utf8");
writeFileSync(new URL("../lib/site-css.js", import.meta.url), "// Generated from site.css by scripts/gen.mjs\nexport const SITE_CSS = " + JSON.stringify(css) + ";\n");
const admin = readFileSync(new URL("../lib/admin.html", import.meta.url), "utf8");
writeFileSync(new URL("../lib/admin-html.js", import.meta.url), "// Generated from admin.html by scripts/gen.mjs\nexport const ADMIN_HTML = " + JSON.stringify(admin) + ";\n");
console.log("generated");
