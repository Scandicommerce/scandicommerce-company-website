# Preview Sanity drafts locally

How to see unpublished Sanity drafts on `localhost:3000`, using the Studio's **Presentation** tool, without touching production.

Drafts are never shown on the live site: the site reads only published content (`perspective: "published"` in `sanity/lib/client.ts`). Drafts appear only in draft mode, which the Presentation tool turns on. Draft mode needs a Sanity token that can read drafts, `SANITY_API_READ_TOKEN`.

## Symptom

Presentation shows *"Unable to connect, check the browser console for more information."*

**Cause:** `SANITY_API_READ_TOKEN` is not set. As of 16.10.2026 it is missing on Vercel (every environment) and in `.env.local`, so `/api/draft-mode/enable` cannot validate the request.

## Already in place

- `http://localhost:3000` is an allowed CORS origin with credentials in the Sanity project.
- `app/api/draft-mode/enable/route.ts` turns on draft mode.
- `app/layout.tsx` renders `<VisualEditing />` and the draft banner when draft mode is on.

## Steps

### 1. Get a read token

**Recommended: a dedicated Viewer token**

1. Open [sanity.io/manage](https://www.sanity.io/manage), then the ScandiCommerce project (`fk1tt27l`).
2. Go to **API → Tokens → Add API token**.
3. Name: `Local preview`. Permissions: **Viewer**.
4. Copy the token. It is shown only once.

**Quick alternative: reuse the local write token**

`.env.local` already has `SANITY_API_WRITE_TOKEN`, and a write token can also read drafts. For a quick local test you can point the read token at it. That gives preview more access than it needs, so prefer a Viewer token. Run from the project root:

```bash
grep '^SANITY_API_WRITE_TOKEN=' .env.local | sed 's/^SANITY_API_WRITE_TOKEN=/SANITY_API_READ_TOKEN=/' >> .env.local
```

### 2. Add the token to `.env.local`

If you created a Viewer token, add this line to `.env.local` with your token in place of `<token>`:

```
SANITY_API_READ_TOKEN=<token>
```

`.env.local` is gitignored, so the token stays on your machine. Check that the line is there, without printing the value:

```bash
grep -c '^SANITY_API_READ_TOKEN=' .env.local
```

It should print `1`.

### 3. Restart the dev server

Next.js reads `.env.local` only at startup. Stop the running server (Ctrl+C) and start it again:

```bash
npm run dev
```

### 4. Open the preview

1. Go to [localhost:3000/studio](http://localhost:3000/studio) and log in to Sanity if asked.
2. Click **Presentation** in the top bar.
3. Keep **Drafts** selected in the perspective menu at the top right.
4. Type the page path in the preview's address field. Studio does not jump to the right page by itself.

| Page | Path |
|---|---|
| Alle pakker | `/no/tjenester/alle-pakker` |
| Growth | `/no/tjenester/alle-pakker/growth` |
| Premium | `/no/tjenester/alle-pakker/premium` |
| Enterprise | `/no/tjenester/alle-pakker/enterprise` |

When draft mode is on, the site shows a draft banner, and you can click text to edit it.

## Without a token: Review changes

To compare old and new content without any preview, use **Structure**. Open the document, click **⋯** next to **Publish**, and choose **Review changes**. You get the published and draft values side by side for every field.

## Production preview (later)

For Presentation to work on `scandicommerce.no/studio` too, add `SANITY_API_READ_TOKEN`, with a Viewer token, under Vercel → project → **Settings → Environment Variables** for Production, Preview and Development, then redeploy.

## Troubleshooting

| Problem | Check |
|---|---|
| Still "Unable to connect" | Did you restart `npm run dev` after editing `.env.local`? Does `grep -c '^SANITY_API_READ_TOKEN=' .env.local` print `1`? |
| Preview shows the old content | Is **Drafts** selected in the perspective menu, not **Published**? |
| 401 or "Unauthorized" in the browser console | The token is wrong or has been revoked. Create a new one. |
| CORS error | `http://localhost:3000` must be in the Sanity project under **API → CORS origins** with credentials. It is today. On another port, add that origin too. |
