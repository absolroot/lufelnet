-- Project only the fields needed for public cards, filters, and rankings.
create view public.tactic_library_public
with (security_invoker = true)
as
select
    t.id,
    t.title,
    t.author,
    t.comment,
    t.created_at,
    t.url,
    t.region,
    t.tactic_type,
    case
        when coalesce(nullif(t.tactic_version, ''), 'legacy') <> 'legacy' then t.tactic_version
        when pg_input_is_valid(version.prefix, 'double precision')
            then case when version.prefix::double precision >= 3 then 'v3' else 'legacy' end
        else 'legacy'
    end as tactic_version,
    coalesce(preview.party, '[]'::json) as party,
    coalesce(l.likes, 0) as likes
from public.tactics as t
left join (
    select distinct on (tactic_id) tactic_id, likes
    from public.tactic_likes
    order by tactic_id, id desc
) as l on l.tactic_id = t.id::text
cross join lateral (
    select case json_typeof(t.query)
        when 'object' then t.query
        when 'string' then case
            when left(ltrim(t.query #>> '{}'), 1) = '{' and pg_input_is_valid(t.query #>> '{}', 'json')
                then (t.query #>> '{}')::json
        end
    end as body
) as tactic
cross join lateral (
    select regexp_substr(
        tactic.body->>'tactic-maker-ver',
        '^[[:space:]]*[+-]?(Infinity|([0-9]+(\.[0-9]*)?|\.[0-9]+)([eE][+-]?[0-9]+)?)'
    ) as prefix
) as version
cross join lateral (
    select json_agg(
        case when json_typeof(p.member->'name') = 'string' then
            json_build_object(
                'name', p.member->'name',
                'order', case when json_typeof(p.member->'order') in ('string', 'number') then p.member->'order' end,
                'ritual', case when json_typeof(p.member->'ritual') in ('string', 'number') then p.member->'ritual' end
            )
        end
        order by p.slot
    ) as party
    from json_array_elements(
        case when json_typeof(tactic.body->'party') = 'array' then tactic.body->'party' else '[]'::json end
    ) with ordinality as p(member, slot)
) as preview;

revoke all on public.tactic_library_public from public, anon, authenticated;
grant select on public.tactic_library_public to anon, authenticated;

-- Keep edit ownership out of the shared snapshot.
create view public.my_tactic_ids
with (security_invoker = true)
as
select id
from public.tactics
where user_id = (select auth.uid())::text;

revoke all on public.my_tactic_ids from public, anon, authenticated;
grant select on public.my_tactic_ids to authenticated;

notify pgrst, 'reload schema';

-- Roll back after disabling the new readers:
-- drop view public.my_tactic_ids, public.tactic_library_public;
-- notify pgrst, 'reload schema';
