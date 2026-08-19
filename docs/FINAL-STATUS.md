# WinsWi 2.0 — état final de consolidation

## Réellement présent
- Next.js / TypeScript / PWA
- Supabase Auth + SSR
- PostgreSQL + RLS
- Storage privé pour médias d'annonces
- 58 wilayas seedées
- modèle de communes prêt
- 7 univers et métadonnées spécifiques
- annonces CRUD de base
- ImmoWin publication + photos + détail
- favoris
- demandes
- matching déterministe
- alertes
- notifications
- conversations + messages
- Realtime Postgres Changes
- blocage / signalement
- dashboard
- administration de base
- plans / abonnements d'essai
- Gemini côté serveur
- mémoire IA Supabase
- fallback démo explicite

## À faire avant une vraie production
- exécuter les migrations sur le projet Supabase réel
- importer le dataset officiel complet des communes
- configurer Storage et Realtime dans Supabase
- renseigner les secrets de production
- exécuter npm install/typecheck/lint/build dans un environnement complet
- effectuer les tests E2E
- choisir et intégrer le fournisseur de paiement
- passer la messagerie haute charge vers Broadcast/Presence si nécessaire
- vérifier les politiques et les quotas du projet Supabase
- configurer domaine, HTTPS, monitoring et sauvegardes
- importer le dépôt dans Google AI Studio et refaire la validation finale

## Règle
Aucune fonction n'est considérée comme production-ready uniquement parce qu'une interface existe. La validation finale doit être exécutée sur le projet réellement déployable.

## 4.2 additions
- EduWin, HealthWin, SportWin, FoodWin, DeliveryWin
- payment provider registry and provider-neutral payment intent endpoint
- Algerian payment rails: Edahabia, BaridiMob/BaridPay, CIB adapter, local QR
- international rails: cards, bank transfer/SWIFT, SEPA where applicable, Google Pay, Apple Pay where supported, Stripe/PayPal/Wise/Payoneer adapters, regional wallet/QR rails, crypto adapter
- automatic browser/Accept-Language detection with manual override
