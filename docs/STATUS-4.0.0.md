# WinsWi 4.0.0 — état

## Implémenté dans cette release
- Design system WinsWi bleu nuit/or inspiré des 27 références fournies.
- Navigation mobile avec bouton IA central.
- Assistant vocal navigateur FR/AR/EN : reconnaissance → IA → synthèse vocale.
- Historique vocal Supabase.
- ImmoWin Pro : espace agence/promoteur/professionnel.
- CRM : leads, pipeline, score, notes et activités.
- WinsWi Ads : campagnes, budget, ciblage, créatif et événements.
- Supabase RLS pour les nouvelles tables.

## Non prétendu comme validé ici
- `npm install`, `typecheck`, `lint`, `build` n'ont pas pu être exécutés complètement car l'installation des dépendances a dépassé le délai de l'environnement.
- Les appels Supabase et Gemini nécessitent les variables d'environnement et les migrations dans un projet réel.
- Les paiements publicitaires ne sont pas simulés : le paiement réel doit être raccordé à un prestataire choisi avant activation commerciale.
