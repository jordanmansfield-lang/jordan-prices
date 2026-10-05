# Jordan Mansfield – prices page with editor

The live page is at **https://prices.jordanmansfieldweddings.com**, and the editor is at **/admin**.

## What's in this folder

| Path | What it does |
|---|---|
| `netlify/functions/page.mjs` | Builds the public page from your saved wording and photos |
| `netlify/functions/admin.mjs` | The password-protected editor at `/admin` |
| `netlify/functions/enquiry.mjs` | Sends the two emails when a couple presses "Send my enquiry" |
| `netlify/functions/img.mjs` | Serves your photos |
| `lib/content.js` | The original wording and prices (used until you first save in /admin) |
| `lib/site.css` | The page design |
| `lib/admin.html` | The editor screen |
| `public/seed/` | The starter photos |

Your edits and uploaded photos are stored in Netlify Blobs, not in these files, so re-uploading this folder never wipes them.

## Settings needed in Netlify

**Site configuration → Environment variables**

| Name | Value |
|---|---|
| `ADMIN_PASSWORD` | A long password you'll use to sign in to /admin |
| `RESEND_API_KEY` | From resend.com → API Keys |
| `FROM_EMAIL` | `Jordan Mansfield <hello@jordanmansfieldweddings.com>` |
| `TO_EMAIL` | `hello@jordanmansfieldweddings.com` |

After adding or changing any of these, go to **Deploys → Trigger deploy → Deploy site**.

## Signing in to the editor

Go to `/admin`. Your browser asks for a username and password. The username can be anything, and the password is your `ADMIN_PASSWORD`.

## If something goes wrong

- **Enquiry emails not arriving:** check the domain shows **Verified** in Resend, and check the Enquiries tab in /admin. Every enquiry is saved there with a ✓ or ✕ for each email.
- **A change isn't showing:** the page can take up to a minute to refresh. Reload with Shift held down.
- **The admin says it's switched off:** `ADMIN_PASSWORD` hasn't been set yet, or the site hasn't been redeployed since you set it.
