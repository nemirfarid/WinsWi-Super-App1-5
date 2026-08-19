# WinsWi 5.1.2 — Final Source Release

This archive is the complete source package intended to be uploaded as-is to a clean GitHub repository.

## CI
GitHub Actions is included at `.github/workflows/ci.yml` and validates with Node 22:
- npm install --no-package-lock
- npm run verify-install
- npm run verify
- npm run typecheck
- npm run lint
- npm run build

No GitHub-side source-file creation or correction is required.

## Google AI Studio
The application keeps Gemini access server-side and uses environment variables. Do not commit secrets. Configure Supabase and Gemini credentials in the target deployment environment.

## External sources and social networks
Only authorized APIs, feeds, partner imports or permitted references are intended. OAuth/API credentials and platform approvals are deployment-time configuration, not embedded in source.

## Supabase
Database migrations are included under `supabase/migrations/`. Apply them through the Supabase project before enabling authenticated production features.
