# WinsWi 3.0.0 — Release Candidate

Cette version est la base de publication du projet WinsWi.

## Socle

- Next.js + TypeScript
- Supabase PostgreSQL / Auth / RLS / Storage / Realtime
- Gemini côté serveur
- PWA
- 7 univers WinsWi
- dashboard utilisateur
- annonces, favoris, demandes, matching
- conversations, messages et notifications
- alertes
- modération / administration
- abonnements de démonstration sans paiement automatique

## Sécurité

- aucune clé service-role dans le client
- `GEMINI_API_KEY` uniquement côté serveur
- sessions Supabase SSR via `@supabase/ssr`
- RLS sur les données utilisateur
- médias privés avec URLs signées
- RPC de conversation avec contrôle des blocages et du propriétaire de l'annonce

## Validation locale

```bash
npm install --no-audit --no-fund
npm run verify
npm run typecheck
npm run lint
npm run build
```

`npm run check` exécute les quatre étapes.

## Supabase

Exécuter toutes les migrations de `supabase/migrations/` dans l'ordre, puis `supabase/seed.sql`.

Variables :

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
GEMINI_API_KEY=
GEMINI_MODEL=gemini-2.5-flash
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## GitHub

Le workflow `.github/workflows/ci.yml` exécute automatiquement `npm install --no-audit --no-fund`, typecheck, lint et build sur les pushes et pull requests.

## Google AI Studio

Le dépôt peut être importé depuis GitHub dans Google AI Studio Build Mode. Ne pas déplacer `GEMINI_API_KEY` dans le code client.
