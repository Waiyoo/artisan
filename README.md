# ndegwa investments  Platform

## Deploying to Vercel

1. Import this directory as a Vercel project.
2. In **Settings → Environment Variables**, add `DATABASE_URL` for every environment. Use a pooled PostgreSQL URL with SSL enabled for serverless deployments.
3. Create a Vercel Blob store and add its `BLOB_READ_WRITE_TOKEN` to every environment when uploads are enabled. Vercel has no persistent local filesystem, so uploads deliberately fail without this token.
4. Deploy. The Vercel build runs the committed Prisma migrations, generates Prisma Client, and then creates the Next.js production build.

Copy `.env.example` for local configuration. Never commit `.env` files. Create the first `AdminUser` in the database before using `/admin/login`; passwords must be bcrypt hashes.

## Local verification

```bash
npm ci
npm run build
npm run start
```

The public API exposes only `PUBLISHED`, non-deleted investments. Drafts remain unavailable to public visitors.
# artisan
