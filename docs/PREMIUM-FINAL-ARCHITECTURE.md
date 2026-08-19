# WinsWi Premium Final — architecture

## Product
WinsWi is an international super-app with 12 modular universes and a single AI layer.

## Universes
ImmoWin, AutoWin, JobWin, MarketWin, BuildWin, AgriWin, TravelWin, EduWin, HealthWin, SportWin, FoodWin, DeliveryWin.

## AI
- Text and browser voice input/output.
- FR / AR / EN locale routing.
- AI can search and create structured requests through the existing API layer.
- Voice history is persisted for authenticated users.

## International
The `country_catalog` table is the source of country/currency/units/timezone defaults. The client can override language and persona manually.

## Adaptive experience
The client can use time of day and optional browser geolocation/weather. Manual theme/persona choices take precedence over automatic choices.

## Professional
Business profiles support agencies, promoters, companies and sector-specific operators. CRM leads and activities are shared infrastructure.

## Ads
Campaigns and events are stored in Supabase. All 12 universes are supported plus `global`.

## Payments
The payment engine is provider-agnostic. A transaction is created internally before a provider checkout. Real payment activation requires merchant contracts, API credentials, signed webhooks, KYC/AML and country-specific regulatory validation.

## Health
HealthWin must not present AI output as a diagnosis or substitute for a licensed clinician. Appointment and information workflows must carry appropriate local disclaimers.

## Release rule
Do not claim production readiness until `npm install`, `npm run verify`, `npm run typecheck`, `npm run lint`, and `npm run build` succeed in a full CI environment.
