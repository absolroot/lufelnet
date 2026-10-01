import { readFile, writeFile, rename } from 'node:fs/promises';

const config = await readFile(new URL('../../_includes/supabase-config.html', import.meta.url), 'utf8');
const url = config.match(/const supabaseUrl = '([^']+)'/)?.[1];
const key = config.match(/const supabaseKey = '([^']+)'/)?.[1];
if (!url || !key) throw new Error('Supabase public configuration was not found');

const columns = 'id,title,author,comment,created_at,url,region,tactic_version,party:query->party';
const headers = { apikey: key, Authorization: `Bearer ${key}` };

async function select(table, fields, filters = {}) {
  const requestUrl = new URL(`/rest/v1/${table}`, url);
  requestUrl.searchParams.set('select', fields);
  for (const [name, value] of Object.entries(filters)) requestUrl.searchParams.set(name, value);
  const response = await fetch(requestUrl, { headers });
  if (!response.ok) throw new Error(`${table} snapshot request failed: HTTP ${response.status}`);
  const rows = await response.json();
  if (!Array.isArray(rows)) throw new Error(`${table} snapshot response is not a list`);
  return rows;
}

async function feed(region) {
  const filters = { order: 'created_at.desc', limit: '3' };
  if (region === 'en') filters.region = 'in.(en,sea)';
  else if (region !== 'all') filters.region = `eq.${region}`;
  const tactics = await select('tactics', columns, filters);
  const ids = tactics.map(tactic => String(tactic.id));
  const likes = ids.length
    ? await select('tactic_likes', 'tactic_id,likes', { tactic_id: `in.(${ids.join(',')})` })
    : [];
  return { tactics, likes };
}

const feeds = {};
for (const region of ['kr', 'en', 'jp', 'all']) feeds[region] = await feed(region);
const snapshot = { generatedAt: new Date().toISOString(), feeds };
const target = new URL('../../data/home-tactics-snapshot.json', import.meta.url);
const temporary = new URL('../../data/home-tactics-snapshot.json.tmp', import.meta.url);
await writeFile(temporary, `${JSON.stringify(snapshot)}\n`, 'utf8');
await rename(temporary, target);
console.log(`Generated home tactics snapshot at ${snapshot.generatedAt}`);
