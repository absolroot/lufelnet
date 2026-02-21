-- One-time cleanup for orphan likes rows.
-- Run in Supabase SQL Editor or via privileged migration role.

-- 1) Check orphan count.
SELECT COUNT(*) AS orphan_count
FROM public.tactic_likes tl
WHERE NOT EXISTS (
  SELECT 1
  FROM public.tactics t
  WHERE CAST(t.id AS text) = CAST(tl.tactic_id AS text)
);

-- 2) Optional preview rows before delete.
SELECT tl.id, tl.tactic_id, tl.likes, tl.created_at
FROM public.tactic_likes tl
WHERE NOT EXISTS (
  SELECT 1
  FROM public.tactics t
  WHERE CAST(t.id AS text) = CAST(tl.tactic_id AS text)
)
ORDER BY tl.created_at DESC;

-- 3) Delete orphan rows.
DELETE FROM public.tactic_likes tl
WHERE NOT EXISTS (
  SELECT 1
  FROM public.tactics t
  WHERE CAST(t.id AS text) = CAST(tl.tactic_id AS text)
);
