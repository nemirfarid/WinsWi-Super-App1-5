# WinsWi 4.2 — nouveaux univers, paiements et détection de langue

## Nouveaux univers
- EduWin / education
- HealthWin / health
- SportWin / sport
- FoodWin / food
- DeliveryWin / delivery

Ils utilisent le même moteur d'annonces, demandes, matching et publication que les autres univers, avec des champs métier dédiés.

## Paiements
WinsWi utilise un registre de fournisseurs et une architecture d'adaptateurs. Sont préparés : CIB, Edahabia, BaridiMob, virement bancaire, paiement à la livraison, QR/local, Visa/Mastercard, Stripe, PayPal, Google Pay, Apple Pay, Wise, Payoneer, wallets régionaux et crypto/stablecoins.

Important : « préparé » ne signifie pas « encaissement actif ». Les fournisseurs bancaires/wallet nécessitent des contrats, comptes marchands, clés API et conformité. Stripe n'est pas actuellement disponible pour ouvrir un compte marchand en Algérie; il reste un adaptateur pour les marchés supportés. Google Pay est disponible pour les paiements en ligne en Algérie selon Google, sous réserve de l'intégration et des cartes participantes. Apple Pay ne liste actuellement pas l'Algérie parmi ses pays africains compatibles; le connecteur reste conditionnel.

## Langue
- détection automatique par `navigator.language` / `navigator.languages`
- API `GET /api/language` basée sur `Accept-Language`
- préférence manuelle conservée dans localStorage
- FR/AR/EN et RTL arabe
- architecture prête à étendre à d'autres langues.

## Validation
Exécuter dans un environnement complet : `npm install`, `npm run typecheck`, `npm run lint`, `npm run build`.
