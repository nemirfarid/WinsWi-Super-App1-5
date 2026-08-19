# WinsWi v10 — Demandes & Matching

## Added
- Dedicated `/demandes` experience.
- Real buyer request creation through Supabase.
- Structured criteria stored as JSONB.
- Matching endpoint ranks active listings for the authenticated request owner.
- Match notifications are created for the requester with duplicate suppression over 24h.
- Requests move from `open` to `matched` when meaningful matches exist.
- Dashboard links users to the complete request/matching workflow.

## Security
- Request creation and matching require Supabase authentication.
- Matching only reads requests belonging to the authenticated user.
- Listing results exclude the request owner's own listings.
- RLS remains the final authorization layer.

## Current limitation
The first matcher is intentionally deterministic and explainable. It is not yet the final AI matching engine. The next iteration should add normalized criteria per universe, distance/geospatial scoring, price ranges, dates, and a persisted match history.
