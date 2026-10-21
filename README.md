# DK Group website & acquisition workspace

Next.js App Router, TypeScript, Tailwind CSS, and persistent SQLite. Implements DMK Home Improvement LLC, DK Entity LLC, and the Homeowner Solutions service division. See [CODEX_BUILD_SPEC.md](CODEX_BUILD_SPEC.md).

## Develop

Requires Node **24+** (uses built-in `node:sqlite`) and npm. Use the existing checkout; cloud tasks are already isolated and do not need a worktree.

```sh
npm ci --cache /tmp/dk-npm-cache
cp .env.example .env.local
# Edit .env.local; do not commit it.
npm run dev
```

Public pages and lead capture work without API credentials. The AI-labelled Ava entrypoint is a deterministic guided **demo**, not a connected language model or telephone receptionist. Forms really persist to SQLite and never report success before storage succeeds. No live integrations or dialing are represented as active.

For CRM access generate a password hash with `npm run hash-password -- 'a-long-unique-password'`. Put the output into `ADMIN_PASSWORD_HASH`, and create a unique random `SESSION_SECRET` of at least 32 characters. Optional `STAFF_PASSWORD_HASH` and `VIEWER_PASSWORD_HASH` enable those roles; no default passwords exist. Enter the chosen role and password at `/admin`. Do not use sample/test credentials in deployment. Shell argument password generation can enter shell history: use a secure local terminal and clear sensitive history per your operational policy.

## Validate

```sh
npm run test
npm run lint
npm run build
PLAYWRIGHT_BROWSERS_PATH=/tmp/dk-browsers npx playwright install chromium
PLAYWRIGHT_BROWSERS_PATH=/tmp/dk-browsers npm run test:e2e
# Or use installed Chromium: PLAYWRIGHT_EXECUTABLE_PATH=/usr/bin/chromium npm run test:e2e
```

Browser tests start an isolated production server at port 3100 with test-only credentials and a unique temporary SQLite database. They submit real inquiries, check CRM activity and scheduling, role boundaries, suppression, public page rendering, chat routing and horizontal overflow at desktop/mobile sizes. Tests never contact a telephony provider. Test databases live in the operating system temp directory, not the production database. Unit tests use a temporary database.

## Deployment

1. Run `npm ci`, configure environment settings and `APP_URL` to the canonical HTTPS origin, then `npm run build` and `npm start` behind an HTTPS reverse proxy.
2. Use **one Node instance** with a writable persistent local volume for `DATABASE_PATH`. Ephemeral/serverless disks and multi-instance SQLite deployments are unsupported. Move to a managed database before horizontal scaling. SQLite is not encrypted by this app: use encrypted volumes, restricted filesystem access, encrypted backups and monitored restores.
3. Restrict access to `.env.local`, database, WAL/SHM and backups. Public service pages are static; CRM APIs return `no-store` and require signed eight-hour HTTP-only sessions. TLS sets Secure cookies. Rotating `SESSION_SECRET` invalidates sessions.
4. Rate limiting uses shared SQLite counters. By default limits are shared across all visitors (safe but conservative). Only set `TRUST_PROXY=true` behind a trusted proxy that **overwrites** `X-Forwarded-For`; never trust arbitrary client headers. A production edge limiter and request body limits are recommended. Default lead limit: 8 per 10 minutes; chat: 40; login: 5. Same-origin JSON mutations enforce CSRF boundaries.
5. Back up and restore the database with SQLite-aware tooling. Run scheduled, approved retention reviews; inactive inquiry retention proposal is 12 months, **not automatically enforced**. Preserve opt-out suppression as required. CRM currently lists the latest 500 leads and 200 activities; larger-scale search/pagination is future work.
6. Verify original brand assets, contact ownership, service areas, material acceptance, business/legal copy and counsel review before publishing. The architecture artwork is an original SVG illustration, not evidence of completed projects. No fabricated reviews, inventory, offers or prices are included.

## Roles and records

Admin and staff can review all three divisions, update lead status and record internal appointments; viewer can read only. No user-management or deletion endpoint exists. Passwords are verified with scrypt; only hashes are configured. Audit records capture website intake, actor roles and CRM status/appointment changes. Roles are shared accounts, so audit attribution is role-level; unique staff identity/SSO and session revocation are prerequisites if individual accountability is required. Appointments do not imply customer confirmation and send no invitations.

Lead intake validates fields server-side, rejects honeypots and deduplicates identical payloads. Consent is separate, unchecked, timestamped, and stores exact wording. Suppression normalizes phone/email and is visibly flagged in CRM. A submission requests human follow-up, **not AI telemarketing permission**. Operators must consult suppression before any marketing. There is no automated marketing channel.

## Integrations and legal prerequisites

See [docs/INTEGRATIONS.md](docs/INTEGRATIONS.md) for adapter contracts, missing credentials, webhook verification requirements and production enablement. Automated outbound calling is **unconditionally blocked server-side**, including when `OUTBOUND_ENABLED=true` is supplied. There is no dialer implementation or campaign activation control. Legal review requires a separate audited engineering change, not an environment toggle. This project does not certify compliance.
