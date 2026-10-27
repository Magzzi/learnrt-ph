# Ship the core data as an offline SQLite snapshot

Signal is unreliable underground and in trains, which is exactly when Guided Ride is used. Stations, fares, Transfers, landmarks and the route graph are bundled in the app as a SQLite snapshot and refreshed from Supabase when online. Only Rider Reports and Advisories require a connection, and Rider Reports queue while offline. The cost is a sync mechanism and versioned data.
