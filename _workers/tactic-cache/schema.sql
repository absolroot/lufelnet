CREATE TABLE IF NOT EXISTS cache_versions (
  table_name TEXT PRIMARY KEY,
  version INTEGER NOT NULL DEFAULT 0,
  last_probe_at_ms INTEGER NOT NULL DEFAULT 0,
  latest_id TEXT
);

INSERT OR IGNORE INTO cache_versions (table_name, version) VALUES
  ('tactics', 0),
  ('tactic_likes', 0);
