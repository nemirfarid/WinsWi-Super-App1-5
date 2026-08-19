# WinsWi 4.1.0 — International & Adaptive Experience

- International-ready locale/country/unit preferences.
- Automatic time-of-day visual ambience.
- Optional automatic weather ambience using browser geolocation + Open-Meteo through `/api/weather`.
- Manual theme override.
- User-selected visual persona: neutral, feminine, masculine, child, teen, young adult, adult, senior.
- No inference of age or gender from face, voice, biometrics or device signals.
- Supabase migration `0012_adaptive_international.sql` persists preferences for authenticated users.

## Internationalization status
The shell is FR/AR/EN today and RTL is supported for Arabic. The architecture is country-aware and unit-aware, but the domain datasets, currencies, taxes, legal flows and payment providers still need country-specific adapters before claiming full worldwide production coverage.


## Superseded by 4.2.0
New universes, payment orchestration and automatic language detection are now included.
