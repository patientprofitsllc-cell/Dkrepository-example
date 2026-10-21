# Integration status and activation contracts

## Current capabilities

| Component                 | Status                   | Data flow                                                                               |
| ------------------------- | ------------------------ | --------------------------------------------------------------------------------------- |
| Website forms             | Working                  | Validated same-origin POST → SQLite lead + activity; retry deduplicates identical input |
| Internal CRM              | Working                  | Signed role-scoped session → lead list, status, activity, internal appointment          |
| Ava text receptionist     | Guided demo              | Stateless rules route among divisions, opt-out or human contact; no external LLM        |
| Inbound voice / telephone | Not connected            | Webhook boundary returns 503 without accepting events                                   |
| Calendar                  | Internal scheduling only | Stored appointments; no Google event or invitation                                      |
| GoHighLevel               | Not connected            | No export or synchronization                                                            |
| Automated outbound        | Blocked                  | `/api/outbound` always returns 403; no provider dialing code                            |

The receptionist identifies itself as automated, does not impersonate a human, and cannot book inventory, make offers, advise on law/tax/finance or place a call. Human handoff links to phone/contact and does not claim a live transfer. Chat is not an emergency service. Keep the guided demo designation until a real provider has been configured and tested.

## Inbound voice adapter boundary

Choose Vapi **or** Retell with Twilio routing as needed after business approval. Provision credentials in secure environment settings, not source or the browser. Reserved `.env.example` names are placeholders only; their presence **does not activate** a provider. All `/api/webhooks/[provider]` events currently fail closed (503); no unsigned or unverified payload is accepted. The schema includes a reserved `webhook_events` table but no ingestion path uses it yet. This is not a claimed working signature verifier or idempotent provider integration.

Implement provider SDK signature validation against the original raw bytes before accepting traffic. Vapi, Retell and Twilio have different signature protocols; do not reuse a generic HMAC verifier across providers. Twilio validation must use the canonical external HTTPS URL plus the correct body parameters. Use the selected provider's current official SDK/docs. Reject unknown provider, invalid signature, stale timestamp and replay. Store the provider event ID in the same transaction as normalized event handling with a unique constraint; acknowledge verified duplicates without repeating side effects. Verify ordering/retries in sandbox tests.

Normalized inbound event should include provider, unique event ID, inbound call ID, event type, timestamp and minimum permitted contact details. Reject outbound/campaign tool requests. Disclose AI identity and establish jurisdiction-specific recording consent before enabling recording/transcription; default recording off. Route service intent to the same validated lead intake model and require a human to confirm pricing, offers or appointments. Permit caller-requested human handoff only to a configured verified business destination. Do not collect payment cards, SSNs or private legal documents. Add durable event audit, minimization, retention, incident handling and delivery monitoring before production.

## Google Calendar

Requires an approved OAuth client or service identity, authorized calendar ID, time zone, least-privilege scopes and secure token storage. Internal CRM appointments are not Google events. Add free/busy checks, customer confirmation, idempotent event creation, timezone/DST handling and conflict tests. Avoid confidential details in calendar descriptions. Never show booking success for a failed provider request.

## GoHighLevel / external CRM

Requires a reviewed account/location ID, scoped API credential and agreed division/status mapping. Use a transactional outbox for retries; stable lead IDs as external deduplication keys; redact logs; never duplicate submissions on retry. Sync suppression and revocation **before** any marketing eligibility. Establish data processing and deletion agreements. Internal CRM is currently the source of truth.

## Outbound restrictions

Outbound remains disabled even if credentials or an `OUTBOUND_ENABLED` variable are set. Do not enable via UI changes. A separate reviewed implementation must establish counsel-approved campaign authorization; recipient-specific consent or independently reviewed lawful basis; call-type-specific TCPA review; DNC suppression; revocation propagation; state/jurisdiction and recipient-timezone windows; verified number provenance; identification/disclosure; recording consent; immutable consent evidence and audit logs; throttling and tests of every denial branch. Never auto-dial purchased/scraped homeowner lists. Ordinary website inquiry or optional human-contact permission is not AI marketing consent. Obtain Georgia/state and FTC/FCC review before production. No legal compliance certification is made.

## Launch checklist

- Verify contact details, domain, real logos, service geography and all public legal copy with owner.
- Set HTTPS origin, unique CRM credentials, persistent encrypted storage, trusted proxy/rate limits, backups and approved retention/deletion procedures.
- Test restore, form failure paths, authorization and suppression in deployment.
- Keep unconfigured integrations labelled as such; separately review each provider before changing its status.
