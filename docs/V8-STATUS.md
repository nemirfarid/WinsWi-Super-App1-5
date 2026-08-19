# WinsWi v8 — état de consolidation

## Réalisé
- CRUD serveur d'annonce par identifiant.
- Validation métier des metadata par univers.
- Upload et enregistrement des images ImmoWin.
- URLs signées pour les médias privés actifs.
- Favoris persistants.
- Demandes persistantes.
- Création sécurisée d'une conversation via RPC Supabase.
- Première page de conversation et abonnement Realtime aux nouveaux messages.
- Notification automatique du destinataire lors d'un nouveau message.
- Notification automatique des propriétaires lors d'une nouvelle demande.
- RLS conservé sur les données métier.
- Storage protégé par RLS.

## Non validé ici
- `npm install`, `npm run typecheck`, `npm run lint`, `npm run build` n'ont pas pu être exécutés jusqu'au bout : l'installation npm expire dans l'environnement de travail.
- Les 1541 communes ne sont pas encore embarquées dans le seed.
- Les écrans complets des 6 autres univers restent à construire.
- Broadcast/Presence remplacera Postgres Changes pour la messagerie de production.

## Prochaine cible
1. Dashboard utilisateur.
2. Liste des conversations.
3. Notifications temps réel.
4. Demandes + matching avec filtres métier.
5. CRUD AutoWin, JobWin, MarketWin, BuildWin, AgriWin, TravelWin.
6. Administration/modération.
7. IA WinsWi avec mémoire et outils contrôlés.
8. Tests et validation de build dans un environnement Node fonctionnel.
