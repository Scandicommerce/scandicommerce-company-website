# Sanity Studio: Fix "Request error while attempting to reach" on save/publish

This error happens when the **Studio origin** (the URL where you open the Studio) is not allowed to send authenticated requests to the Sanity API. The browser blocks the request (CORS).

## Fix: Add CORS origins with credentials

1. **Open Sanity project settings**
   - Go to [manage.sanity.io](https://manage.sanity.io)
   - Select your project
   - Open **API** → **CORS origins**

2. **Add your Studio URLs**
   - **Local:** `http://localhost:3000` (or the port you use; no trailing slash)
   - **Production:** Your live site URL, e.g. `https://scandicommerce.vercel.app`
   - For each origin, **enable "Allow credentials"** (required for saving/publishing).

3. **Save** and try saving a document again in the Studio.

## Using the CLI (optional)

From the project root:

```bash
# Local development
npx sanity cors add http://localhost:3000 --credentials

# Production (replace with your domain)
npx sanity cors add https://scandicommerce.vercel.app --credentials
```

## Notes

- Use the exact origin: correct protocol (`http` vs `https`), no trailing slash.
- If you use a different port locally (e.g. 3001), add that origin too.
- After changing CORS, do a hard refresh or try in an incognito window if it still fails.
