CREATE TABLE IF NOT EXISTS cache_versions (
  table_name TEXT PRIMARY KEY,
  version INTEGER NOT NULL DEFAULT 0
);

INSERT OR IGNORE INTO cache_versions (table_name, version) VALUES
  ('tactics', 0),
  ('tactic_likes', 0);

CREATE TABLE IF NOT EXISTS tactic_snapshot_state (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  generation INTEGER NOT NULL DEFAULT 0,
  generated_at INTEGER NOT NULL DEFAULT 0,
  tactics_version INTEGER NOT NULL DEFAULT -1,
  likes_version INTEGER NOT NULL DEFAULT -1,
  lease_token TEXT,
  lease_version INTEGER NOT NULL DEFAULT -1,
  lease_until INTEGER NOT NULL DEFAULT 0,
  retry_at INTEGER NOT NULL DEFAULT 0
);

INSERT OR IGNORE INTO tactic_snapshot_state (id) VALUES (1);

CREATE TABLE IF NOT EXISTS tactic_snapshot_chunks (
  kind TEXT NOT NULL,
  part INTEGER NOT NULL,
  body TEXT NOT NULL,
  PRIMARY KEY (kind, part)
) WITHOUT ROWID;
