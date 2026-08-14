# WinsWi — Premium Final

WinsWi est une Super-App internationale intelligente, pensée d’abord pour l’Algérie et extensible marché par marché.

## Socle
- Next.js + React + TypeScript
- Supabase Auth / PostgreSQL / RLS / Storage / Realtime
- Gemini côté serveur
- PWA

## Univers
ImmoWin, AutoWin, JobWin, MarketWin, BuildWin, AgriWin, TravelWin, EduWin, HealthWin, SportWin, FoodWin, DeliveryWin.

## Capacités
- IA WinsWi texte + voix
- détection automatique FR/AR/EN et RTL
- personnalisation météo/heure/persona avec contrôle manuel
- annonces, demandes, matching, favoris
- CRM professionnel et publicité
- orchestration de paiement multi-rails
- messagerie et notifications
- architecture internationale

## Validation locale
```bash
npm install
npm run verify
npm run typecheck
npm run lint
npm run build
```

Les fournisseurs de paiement sont des adaptateurs : leur activation réelle exige les contrats, comptes marchands, clés, webhooks et contraintes réglementaires propres au pays.

HealthWin doit rester un outil d’orientation/prise de rendez-vous et d’information ; les décisions médicales relèvent des professionnels de santé.

## Super App1 — moteurs consolidés
- Global Opportunity Engine : sources autorisées, normalisation, déduplication, matching et Opportunity Score.
- Price Intelligence, Trust & Safety et Reputation.
- Social Distribution Engine + Social AI adapters pour Facebook, Instagram, TikTok, YouTube, WhatsApp, LinkedIn, Telegram et Pinterest.
- Les connecteurs sociaux et externes nécessitent les OAuth/API/contrats correspondants ; aucune automatisation non autorisée n'est incluse.
- Voir `docs/WINSWI-SUPER-APP1-ARCHITECTURE.md`, `docs/EXTERNAL-SOURCE-POLICY.md` et `docs/GOOGLE-AI-STUDIO-DEPLOYMENT.md`.
