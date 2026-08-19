# WinsWi + Supabase

## Pourquoi Supabase

WinsWi a besoin d'une vraie base relationnelle. Supabase fournit PostgreSQL, Auth, Storage et Realtime dans un même environnement. Le plan Free permet de commencer sans rendre WinsWi dépendante d'un backend payant.

## Sécurité

- RLS est activé sur les tables.
- La clé publishable peut être utilisée côté navigateur selon le modèle Supabase.
- Aucune clé service-role ne doit être placée dans `NEXT_PUBLIC_*`.
- Les opérations privilégiées devront rester côté serveur.
- Les données privées doivent être protégées par des policies RLS.

## Migration

La migration `supabase/migrations/0001_winswi_core.sql` crée :

- profiles
- listings
- favorites
- buyer_requests
- notifications
- conversations
- conversation_participants
- messages

Elle crée également le profil automatiquement à la création d'un utilisateur Auth.

## Prochaine migration

Ajouter progressivement :

- property-specific fields
- vehicle fields
- jobs
- products
- construction professionals/projects/quotes
- agriculture offers
- travel offers
- listing images / Storage
- reports / moderation
- subscriptions / premium
- audit logs
