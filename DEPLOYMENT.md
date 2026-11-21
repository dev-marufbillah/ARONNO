# ARONNO live deployment

This project is prepared for Vercel, Neon PostgreSQL, and Cloudinary. Do not put
provider passwords, API keys, or `.env` files in GitHub or in a chat.

## 1. Create a fresh production database

Create a new PostgreSQL project in Neon and copy its pooled connection string.
Keep the connection string private. The production database should be empty
before applying the schema.

In the project folder, copy `.env.example` to `.env.production.local` and fill
in the production values. This file is ignored by Git:

```powershell
Copy-Item .env.example .env.production.local
```

Set `DATABASE_URL` to the Neon pooled connection string. Generate a private
authentication secret locally with:

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
```

Use the generated value for `BETTER_AUTH_SECRET`. Do not reuse the example
value or share the generated secret.

## 2. Create the Vercel project and set environment variables

Push the source to a private GitHub repository, then import that repository in
Vercel. Vercel will assign a URL such as `https://aronno-....vercel.app`; use
the exact assigned URL for both `BETTER_AUTH_URL` and `NEXT_PUBLIC_SITE_URL`.
They must use HTTPS and match exactly. Add these values in Vercel Project
Settings → Environment Variables for **Production**:

- `DATABASE_URL`
- `BETTER_AUTH_SECRET`
- `BETTER_AUTH_URL`
- `NEXT_PUBLIC_SITE_URL`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

Get the Cloudinary values from its dashboard. Keep the API secret server-only;
never prefix it with `NEXT_PUBLIC_`. Admin image uploads use Cloudinary in
production, because files written to a Vercel function are not persistent.

For local production-database setup, put the same database URL and auth
settings in `.env.production.local`. The file is not included in the deployment
archive.

## 3. Create the schema and super-admin

Only run these commands against the **new, empty** production database. Do not
run them against a database containing data unless you have a backup and have
reviewed the proposed schema changes.

```powershell
npm ci
npm run db:push:production
npm run db:bootstrap-super-admin:production
```

The bootstrap command asks for the super-admin password without displaying it.
Use a unique password with at least 12 characters. It creates the configured
owner account; regular registrations remain customer accounts.

## 4. Deploy and verify

After adding the environment variables and applying the schema, trigger a
Vercel deployment. Check the deployment log, then verify:

- The homepage and shop load.
- The owner can sign in and open `/admin`.
- In Site CMS, set the animated welcome text and an international-format WhatsApp number, then save. Confirm the floating button opens the correct chat.
- A category and real product can be added.
- Product and CMS images upload and still load after a new deployment.
- A test Cash on Delivery order can be placed and managed in the admin.

Do not announce real card/mobile payments as available yet: gateway checkout
and payment verification have not been integrated. Leave those methods
unconfigured until their merchant accounts, callback URLs, and end-to-end
tests are complete. Configure real contact, shipping, return, privacy, and
terms information before accepting customer orders.

## Notes

- The archive intentionally excludes `.env`, `.env.production.local`,
  `node_modules`, `.next`, `.vercel`, and `public/uploads`.
- If the site already has products or customer data in a different database,
  this fresh-database procedure does not migrate that data or local uploads.
- Vercel deployment requires importing the project from GitHub; downloading
  the ZIP alone does not publish the site.
