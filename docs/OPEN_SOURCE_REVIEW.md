# Open-source preparation review

Reviewed on 2026-11-16, starting at `df120fb`. This review covers the checked-out files and all Git refs fetched by a normal clone. It does not inspect GitHub Actions logs/artifacts, Git LFS payloads, release attachments, deleted/unreachable objects, or refs not fetched by the clone. It is a credential and documentation review, not a complete application security audit.

## Credential scans

Gitleaks 8.30.1 was run with redacted output:

```bash
gitleaks git . --log-opts=--all --redact
gitleaks dir . --redact
```

No provider API-key matches were identified. The working-tree scan after the source fixes reported zero findings. A clean scan is not proof that every secret has been found; manual review also identified issues below.

The history scan reported four findings, all in generated Next.js build files in commit `f3cb424de9a739044f0673954cef6ec6cf368496`:

- `.next/cache/.rscinfo`: generated encryption key.
- `.next/prerender-manifest.json`: preview signing and encryption keys.
- `.next/server/server-reference-manifest.json`: Server Actions encryption key.

These are application cryptographic material, not cloud-provider credentials. They are absent from the current tracked tree. Do not reuse those build artifacts or keys; rebuild/redeploy any deployment still using that historical build. If removing them from published history is desired, prepare a coordinated rewrite or a new clean-history public repository; this review did not rewrite history.

Manual review found a literal NextAuth signing secret in `apps/external/src/lib/auth.ts`, plus a fallback signing secret in `sst.config.ts`. Both were replaced with environment configuration, and deployment now refuses to proceed without `NEXTAUTH_SECRET`. The previous literals remain in Git history. Set a new random signing secret and redeploy before release; invalidate existing sessions signed with the old value. The local code fix does not rotate an existing deployment.

Cloudinary deployment defaults were removed so a new deployment cannot silently inherit the original upload account/preset. Existing public Cloudinary asset URLs remain; a cloud name is public configuration, but the owner should review unsigned upload-preset restrictions.

Historical `apps/external/.env` and `apps/internal/.env` files were found and inspected; their committed contents were empty. No current tracked real `.env` file was found. Ignore rules now cover `.env.*` variants and allow only the committed example templates.

## Authentication guard correction

Production smoke testing found that the external portal treated `/` as a public path prefix, so every URL bypassed its middleware checks. The external matcher now targets the authenticated `/admin` and `/vendor` portals directly. Both portals explicitly use the configured session secret, and the internal matcher now clearly excludes auth/API and Next.js asset routes. Landing pages and guest microsites remain outside the external portal guard.

`npm run test:auth` runs real production HTTP checks for anonymous/wrong-role redirects and valid-role access, public login pages, auth provider endpoints, and the public frontend landing page. It uses random local secrets and no production accounts. The backend remains responsible for authorization of API operations.

## Dependency remediation

The initial audit reported 66 affected package entries, including 7 critical and 26 high. After updating the manifests and lockfile, the final audit reports **zero vulnerabilities**.

- Upgraded both apps and the root workspace to Next.js 16.4.6 and matching React/React DOM 19.3.1. Builds and development explicitly retain Webpack for the existing aliases; TypeScript now uses bundler module resolution and the React JSX transform.
- Upgraded jsPDF to 4.2.1, NextAuth to the patched v4 release, next-cloudinary to v7, OpenAI to v6, and SST to v4. Removed unused AWS CDK/S3 SDK dependencies from the frontend.
- Updated compatible transitive packages and pinned patched Undici, multipart parser, and minimatch versions through documented npm overrides where parents lag.
- Replaced `next lint` with ESLint CLI and migrated to the Next.js 16 flat config. Newly introduced React Compiler diagnostics are warnings for existing code; pre-existing hooks correctness rules retain their severity. React Compiler itself is not enabled.
- CI now checks dependency advisories at the high severity threshold, and Dependabot checks npm packages and GitHub Actions weekly.

### Deployment compatibility

Existing SST 3 deployments need an explicit, reviewed state migration before deployment. Follow the [official migration guide](https://sst.dev/docs/migrate-from-v3/) and run `sst diff`, then a full `sst refresh` for each stage against infrastructure you own. This review did not run these commands, change AWS state, or test a deployed OpenNext bundle. The existing Edge middleware is retained, as Next.js 16 still supports that runtime via `middleware.ts`.

## Validation

- Both frontend production builds passed with Next.js 16.
- ESLint passed with warnings from existing code and the newly introduced compiler diagnostics.
- A jsPDF smoke check generated a two-page PDF after the major version upgrade.
- Production authentication smoke tests exercise both portals after building.
- A clean `npm ci` and final `npm audit` checked lockfile reproducibility.
- Source scans, diff whitespace checks, and local documentation links were checked.
- Browser payment, email, AI, and Cloudinary upload flows were not exercised with live integrations.

## Remaining release decisions

- Select a project license and confirm permission from all relevant contributors. No license was invented by this review.
- Confirm rights to bundled images, fonts, screenshots, and linked third-party media. In particular, frontend slideshow and Wedding Wrapped audio references require review.
- Review sample names/emails and third-party infrastructure identifiers before publishing. Screenshots selected for the frontend README avoid email/account-management tables; the report itself is not copied into either repository.
- Configure a private vulnerability-reporting channel and your own infrastructure before deployment.

This preparation does not change repository visibility, rotate deployed secrets, deploy applications, or rewrite Git history. Deployment credential rotation and license selection remain follow-up work.
