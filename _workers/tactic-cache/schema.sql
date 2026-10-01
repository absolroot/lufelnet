CREATE TABLE IF NOT EXISTS cache_versions (
  table_name TEXT PRIMARY KEY,
  version INTEGER NOT NULL DEFAULT 0
);

INSERT OR IGNORE INTO cache_versions (table_name, version) VALUES
  ('tactics', 0),
  ('tactic_likes', 0);
