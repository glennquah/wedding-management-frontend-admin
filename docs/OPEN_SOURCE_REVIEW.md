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

## Dependency review

`npm ci --ignore-scripts` completed successfully. `npm audit` reported **66 advisories**: 7 critical, 26 high, 27 moderate, and 6 low. These counts include transitive and development dependencies and can change as the registry updates. Packages marked critical: `fast-xml-parser`, `handlebars`, `jspdf`, `next`, `next-auth`, `proxy-addr`, `tar`.

Dependency upgrades were not applied as part of the documentation/credential changes. Review `npm audit` and validate compatible fixes before operating a public deployment; some fixes require major-version changes.

## Critical dependency details

These are package advisory matches, not confirmed exploits in the application. Development-only packages can affect build tooling. Runtime exploitability depends on the vulnerable feature and inputs being reachable.

| Package | Locked versions | Dependency context | Critical advisories |
| --- | --- | --- | --- |
| `fast-xml-parser` | 5.2.5 | Development only | [fast-xml-parser has an entity encoding bypass via regex injection in DOCTYPE entity names](https://github.com/advisories/GHSA-m7jm-9gc2-mpf2) |
| `handlebars` | 4.7.8 | Development only | [Handlebars.js has JavaScript Injection via AST Type Confusion](https://github.com/advisories/GHSA-2w6w-674q-4c4q); [Handlebars: JavaScript Injection via AST Type Confusion in compile (bypass of CVE-2026-33937)](https://github.com/advisories/GHSA-8r5x-fm3f-whwj); [Handlebars: JavaScript Injection via Own Property Check Bypass](https://github.com/advisories/GHSA-p8wg-vrv2-v86f) |
| `jspdf` | 3.0.3 | Includes runtime dependency | [jsPDF has Local File Inclusion/Path Traversal vulnerability](https://github.com/advisories/GHSA-f8cm-6447-x5h2); [jsPDF has HTML Injection in New Window paths](https://github.com/advisories/GHSA-wfv2-pwc8-crg5) |
| `next` | 15.4.6, 15.5.4 | Includes runtime dependency | [Next.js is vulnerable to RCE in React flight protocol](https://github.com/advisories/GHSA-9qr9-h5gf-34mp); [Next.js is vulnerable to RCE in React flight protocol](https://github.com/advisories/GHSA-9qr9-h5gf-34mp); [Next.js: Unauthenticated Remote Code Execution on windows-hosted servers](https://github.com/advisories/GHSA-p293-qw3h-jr36); [Next.js: Unauthenticated Remote Code Execution in Image Optimization API when AVIF files are used](https://github.com/advisories/GHSA-2xp9-vwfh-vxw4); [Next.js: Unauthenticated Remote Code Execution in Image Optimization API when SVG files are used](https://github.com/advisories/GHSA-2464-fhr4-w9xw) |
| `next-auth` | 4.24.11 | Includes runtime dependency | [Auth.js: Email normalizer validates the address before Unicode normalization, allowing a homoglyph @ bypass](https://github.com/advisories/GHSA-7rqj-j65f-68wh) |
| `proxy-addr` | 2.0.7 | Development only | [proxy-addr vulnerable to IP spoofing via IPv4-mapped IPv6 trust subnet](https://github.com/advisories/GHSA-jqcg-44mw-7w3h) |
| `tar` | 7.5.1 | Includes runtime dependency | [node-tar: Decompression/parse DoS via unlimited input](https://github.com/advisories/GHSA-23hp-3jrh-7fpw) |

The count is affected package entries, not a count of proven independent attacks. Update and test dependency fixes separately from this preparation.

## Validation

- Both app TypeScript checks passed (`tsc --noEmit`, incremental output disabled).
- Diff whitespace checks passed; environment variants are ignored and example templates are visible to Git.
- A production frontend build and browser flows were not exercised; they require configured integrations and may fetch external resources.
- Existing app lint commands use `next lint`, which is incompatible with Next.js 15. Migrate these commands to the ESLint CLI before relying on CI.

## Remaining release decisions

- Select a project license and confirm permission from all relevant contributors. No license was invented by this review.
- Confirm rights to bundled images, fonts, screenshots, and linked third-party media. In particular, frontend slideshow and Wedding Wrapped audio references require review.
- Review sample names/emails and third-party infrastructure identifiers before publishing. Screenshots selected for the frontend README avoid email/account-management tables; the report itself is not copied into either repository.
- Configure a private vulnerability-reporting channel and your own infrastructure before deployment.

This preparation does not change repository visibility, rotate deployed secrets, deploy applications, or rewrite Git history. Dependency fixes remain follow-up work.
