# WinsWi Super App 5.1.2 — GitHub / Google AI Studio Ready

Cette archive remplace intégralement la version précédente du dépôt.

## Principes de cette release

- Next.js + React + TypeScript
- Supabase Auth / PostgreSQL / RLS / Storage / Realtime
- Gemini côté serveur uniquement, avec fallback local si la clé n'est pas configurée
- 12 univers : ImmoWin, AutoWin, JobWin, MarketWin, BuildWin, AgriWin, TravelWin, Education, Health, Sport, Food, Delivery
- WinsWi AI texte + voix
- détection FR / AR / EN et RTL
- expérience adaptative météo / heure / persona avec choix manuel
- CRM professionnel, publicité, matching, alertes et réputation
- Global Opportunity Engine, sources autorisées, normalisation, déduplication, Price Intelligence, Trust & Safety
- Social Distribution Engine et adaptateurs sociaux
- paiements multi-rails par adaptateurs
- PWA

## Validation CI

Le workflow GitHub Actions utilise Node 22 et exécute :

1. `npm install --no-audit --no-fund --no-package-lock`
2. `npm run verify-install`
3. `npm run verify`
4. `npm run typecheck`
5. `npm run lint`
6. `npm run build`

Aucun `package-lock.json` n'est exigé par le workflow. Cela évite le blocage GitHub Actions observé lorsque le dépôt est distribué sans lockfile.

## Google AI Studio

Le projet ne contient aucune clé secrète. Les variables Supabase et Gemini sont fournies via l'environnement de déploiement. Les connecteurs externes et sociaux restent désactivés tant que les OAuth/API/contrats correspondants ne sont pas configurés.

## Sources externes

WinsWi ne doit pas scraper des plateformes en violation de leurs conditions. L'intégration externe utilise API officielles, partenaires, flux autorisés, catalogues dont la licence permet la réutilisation, ou référencement vers la source originale lorsque la republication n'est pas autorisée.


## CI policy
This source release intentionally ships without package-lock.json. GitHub Actions uses Node 22 and `npm install --no-package-lock` so the repository can be validated directly after upload without requiring manual lock-file edits.
