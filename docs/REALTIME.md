# WinsWi Realtime

WinsWi uses Supabase Realtime for the first production iteration. The migration enables Postgres Changes for messages, notifications and listings.

Supabase currently recommends Broadcast for higher-scale real-time messaging and notifications; Postgres Changes is simpler and appropriate for initial development/low-volume usage. Before a large public launch, migrate sensitive/high-volume chat events to private Broadcast channels with Realtime Authorization policies.

Source: https://supabase.com/docs/guides/realtime/subscribing-to-database-changes
