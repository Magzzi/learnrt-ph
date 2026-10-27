# Use Supabase (Postgres + PostGIS) as the backend

Stations, fares and landmarks are relational and geographic, and the app needs auth, realtime updates, row-level security, scheduled expiry and edge functions. Supabase provides all of these with a free tier. Firebase was rejected because NoSQL fits fare matrices and geo queries poorly. A custom API on Vercel was rejected because realtime, auth and geo would all be built by hand.
