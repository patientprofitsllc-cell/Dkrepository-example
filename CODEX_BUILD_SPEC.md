# DK Group — Codex Implementation Brief

Build a polished responsive three-service website and acquisition platform for the following related operations, using the user's provided Instagram screenshots as visual/business references (do not treat generated flyer photos as verified project photography):

1. **DMK Home Improvement LLC** — dumpster rentals, residential/eviction/property cleanouts, construction debris, renovation waste, yard/tree debris.
2. **DK Entity LLC** — real estate acquisitions, especially distressed, fire-damaged, inherited, vacant and as-is properties.
3. **Homeowner Solutions** — homeowner consultation/intake for situations including repairs, inherited properties, potential foreclosure, liens or relocation. Treat as a *service division*, not a verified separate legal entity.

Known contact details from client marketing materials:
- Phone: (678) 684-7341
- DMK service email: service@dmkentityllcflip.com
- Investor email: investor@dkentityllcflip.com
- Columbus, Georgia and surrounding areas, with wider Georgia acquisition reach stated by marketing materials (verify before publishing).
- Instagram: @dk_investor1
- Existing logos should be requested as original assets; do not imply recreated AI stock imagery is real.

## Deliverable
Implement production-quality website/application in this repository. Use Next.js App Router + TypeScript + Tailwind CSS (or adapt to existing stack if code appears), responsive mobile/tablet/desktop and accessible design. Create a reusable design system: black/charcoal, white, restrained deep red, high-quality architectural imagery, subtle cinematic motion, legible typography and optimized performance. Create pages:
- Home: three divisions prominently accessible, separate calls to action
- /dumpster-rentals: inquiry/quote, debris type, service address, date, estimated size, site access; NEVER guarantee inventory or price without verified backend
- /sell-your-property: property address, condition, occupancy, timeline, optional desired price, owner relationship, consultation CTA
- /homeowner-solutions: supportive non-coercive language and human consultation booking, no guarantees of preventing foreclosure or other legal results
- /about, /contact, /faq, /privacy, /terms
- /admin: secured role-based CRM dashboard, leads segmented by division, status, activity log and appointments

## AI assistant
Implement a visible Ava-inspired assistant entrypoint, marked as AI, routing among dumpster, investor and homeowner services. Support website text dialogue first and modular integration points for optional Vapi/Retell voice plus Twilio telephony, Google Calendar and GoHighLevel or an internal CRM. Human handoff on request. Collect minimum necessary info; never impersonate a human, commit to binding real estate offers, or give legal/financial/tax advice. Do not invent actual integrations or functioning production calls when API credentials are absent.

## Compliance and outbound guardrails
Outbound AI voice calling MUST be disabled by default (server-side, not just hidden UI). Never auto-dial purchased/scraped homeowner lists. Require counsel-approved campaign authorization and recipient-specific consent or independently reviewed lawful basis, call-type-specific TCPA analysis, DNC suppression, revocation handling, jurisdiction/time-zone calling windows, identification/disclosure, recording-consent checks, consent evidence, audit logs, throttling and verified number provenance. No client-side keys; enforce auth and rules server-side. Georgia/state laws and FTC/FCC requirements must be reviewed by counsel before production. Include clear opt-outs, separate unchecked contact consent on web forms if used, timestamps and exact consent wording. Avoid treating ordinary form submission as automatic AI telemarketing consent.

## Backend/security
Use schema validation, server-side form submission, rate limiting / spam prevention, deduplication, privacy/retention documentation, error states, role-scoped CRM access, secrets via .env.example, webhook signature verification and idempotency. Prefer safe functional forms and persisted lead records; if backend credentials unavailable, show unmistakable demo mode rather than fake success.

## SEO/testing
Optimize Core Web Vitals, metadata, Open Graph, local service-area content without fabricated claims, semantic structure, sitemap, robots, accessibility; run build/lint/tests. Add smoke tests for lead intake, agent routing, unsubscribe/DNC handling, outbound blocked by default, authorization boundaries and mobile layouts.

## Implementation process
1. Inspect repo, scaffold app.
2. Implement visual design and all service pages.
3. Implement secured CRM and real form persistence.
4. Implement agent UI and safe integration adapters.
5. Add consent and outbound block.
6. Test, document setup/deployment and list unresolved external credentials and legal prerequisites.

## Acceptance criteria
Site works on mobile/tablet/desktop; all three services have independent intake and CTAs; leads reach dashboard; AI routing works in safe text/demo or configured live mode; no outbound calls possible by default; no secrets in source; build/tests pass; deploy steps documented. Do not assert legal compliance certification.