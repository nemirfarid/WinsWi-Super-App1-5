# Déploiement Google AI Studio / hébergement

## Principes de compatibilité
- application Next.js standard
- React + TypeScript sans dépendance à un IDE propriétaire
- `npm run dev`, `npm run typecheck`, `npm run lint`, `npm run build`
- secrets uniquement via variables d'environnement
- Gemini côté serveur
- Supabase côté serveur/client avec clés adaptées
- aucune clé API dans le dépôt

## Variables minimales
`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `GEMINI_API_KEY`, `GEMINI_MODEL`, `NEXT_PUBLIC_APP_URL`.

## Avant publication
1. Configurer les variables d'environnement.
2. Appliquer les migrations Supabase dans l'ordre.
3. Tester Auth, Storage, Realtime et RLS.
4. Exécuter la CI GitHub.
5. Exécuter le build Next.js.
6. Tester les routes AI, voice, preferences, payments, opportunities et social/content.

Les connecteurs externes restent en mode adaptateur tant que leurs OAuth/API/contrats ne sont pas activés.
