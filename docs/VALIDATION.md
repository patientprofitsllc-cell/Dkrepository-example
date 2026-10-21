# Validation evidence

Validated in the implementation environment using Node 24.19.0:

- `npm run build`: production compilation, TypeScript and all public page generation passed.
- `npm run lint` and `npm run typecheck`: passed.
- `npm test`: 8 tests passed (division validation, persistence/deduplication and consent evidence, suppression, rate limits, credentials/session signatures, receptionist routing, unconditional outbound denial, rejected voice webhooks).
- `PLAYWRIGHT_EXECUTABLE_PATH=/usr/bin/chromium npm run test:e2e`: 8 tests passed across desktop and mobile Chromium. Public routes render without horizontal overflow; actual form intake reaches authenticated CRM; lead status and appointment activities persist; viewer mutations and unauthenticated requests are denied; cross-origin intake is denied; suppression is reflected in CRM; property and homeowner payloads persist separately.
- `npm audit --omit=dev --audit-level=high`: no production dependency vulnerabilities reported.
- Manual rendered desktop/mobile review and production HTTP request passed. No live telephony, Calendar, GoHighLevel, external AI or customer outreach was exercised.

Playwright's browser CDN was blocked by the environment network policy; installed system Chromium provided the browser engine instead. CI installs its own Chromium. Production credentials were not generated or embedded; the browser harness supplies isolated test-only credentials and temporary databases. The actual CRM stays locked until operator credentials are configured.

This evidence covers this instance and source build, not a published environment or production integration certification. Browser tests are smoke checks, not a full accessibility audit, penetration test, or legal review. See INTEGRATIONS.md and README.md for remaining operational prerequisites.
