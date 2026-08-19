# WinsWi 5.0.0 — Premium Final candidate

## Included
- 12 universe catalog and generic universe routes
- premium navy/gold mobile-first shell with central AI action
- FR/AR/EN detection and manual override
- RTL for Arabic
- adaptive time/weather/persona experience
- WinsWi AI text and browser voice flow
- voice history persistence for authenticated users
- Supabase Auth/Postgres/RLS/Storage/Realtime foundation
- requests, matching, favorites, messaging, notifications
- ImmoWin Pro and shared CRM
- advertising campaigns/events across all universes
- multi-provider payment orchestration and transaction records
- international country/currency/unit/timezone catalog
- professional identities for agencies, promoters, companies and sector operators
- PWA and GitHub CI foundation
- design reference pack from the supplied mockups

## Production gates
1. Configure Supabase and apply migrations in order.
2. Configure Gemini server secret.
3. Configure real payment providers one by one, with signed webhook verification.
4. Run `npm install`.
5. Run `npm run verify`.
6. Run `npm run typecheck`.
7. Run `npm run lint`.
8. Run `npm run build`.
9. Execute authenticated smoke tests against a staging Supabase project.
10. Import the repository into the chosen deployment workflow / Google AI Studio workflow.

## Important
This release contains payment adapters and transaction orchestration, not automatic merchant activation. Provider credentials, contracts, KYC/AML, legal/regulatory approval and webhook configuration remain deployment-specific.
