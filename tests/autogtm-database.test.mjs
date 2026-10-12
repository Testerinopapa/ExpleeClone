import { PGlite } from '@electric-sql/pglite';
import { readFile } from 'node:fs/promises';
import { strict as assert } from 'node:assert';
import { test } from 'node:test';

test('migration, ownership isolation, write permissions, idempotency and atomic completion', async () => {
  const db = new PGlite();
  const owner = 'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa';
  const other = 'bbbbbbbb-bbbb-4bbb-bbbb-bbbbbbbbbbbb';
  try {
    // Minimal Supabase auth contract, using real PostgreSQL roles and RLS.
    await db.exec(`create role anon; create role authenticated; create role service_role bypassrls;
      create schema auth; create table auth.users(id uuid primary key);
      create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid$$;
      grant usage on schema public, auth to anon, authenticated, service_role;
      grant execute on function auth.uid() to authenticated;
      insert into auth.users values ('${owner}'), ('${other}');`);
    await db.exec(await readFile(new URL('../supabase/migrations/20261012000100_autogtm_research.sql', import.meta.url), 'utf8'));
    await db.exec('set role service_role');
    const reserve = async (who, domain, request = crypto.randomUUID()) => (await db.query('select public.autogtm_reserve_job($1, $2, $3, $4) as result', [who, domain, `https://${domain}/`, request])).rows[0].result;
    const request = crypto.randomUUID();
    const first = await reserve(owner, 'company.com', request);
    assert.equal(first.created, true);
    assert.equal((await reserve(owner, 'company.com', request)).job.id, first.job.id);
    assert.equal((await reserve(owner, 'company.com')).created, false);
    await assert.rejects(reserve(owner, 'different.com', request), /REQUEST_CONFLICT/);
    const second = await reserve(other, 'company.com');
    assert.notEqual(second.job.project_id, first.job.project_id);
    const update = async (status, profile = null, completed = 0) => db.query('select (public.autogtm_update_job($1, $2, p_completed => $3, p_profile => $4)).*', [first.job.id, status, completed, profile]);
    await assert.rejects(db.query('select public.autogtm_update_job($1, $2, p_urls => $3)', [first.job.id, 'scraping', Array(11).fill('https://company.com/')]), /check constraint/);
    await update('scraping', null, 2);
    await update('scraping', null, 1);
    assert.equal((await db.query('select pages_completed from public.research_jobs where id=$1', [first.job.id])).rows[0].pages_completed, 2);
    await assert.rejects(update('completed'), /PROFILE_REQUIRED/);
    assert.equal((await db.query('select status from public.research_jobs where id=$1', [first.job.id])).rows[0].status, 'scraping');
    await update('completed', { company_name: 'Company', business_description: 'Widgets', descriptions: [], products: [], customers: [], locations: [], source_urls: ['https://company.com/'], warnings: [] }, 2);
    await update('failed'); // stale callback must not override success
    await update('completed', {});
    assert.equal((await db.query('select count(*)::int as n from public.company_profiles')).rows[0].n, 1);
    assert.equal((await db.query("select count(*)::int as n from public.job_events where status='completed'")).rows[0].n, 1);

    await db.exec(`set role authenticated; select set_config('request.jwt.claim.sub', '${owner}', false)`);
    for (const table of ['projects', 'research_jobs', 'company_profiles', 'job_events']) {
      const rows = (await db.query(`select * from public.${table}`)).rows;
      assert.ok(rows.length > 0);
      assert.ok(rows.every(row => row.owner_id === owner), table);
      await assert.rejects(db.query(`delete from public.${table}`), /permission denied/);
      await assert.rejects(db.query(`update public.${table} set owner_id = $1`, [other]), /permission denied/);
    }
    await assert.rejects(reserve(owner, 'evil.com'), /permission denied/);
    await assert.rejects(update('failed'), /permission denied/);
    await assert.rejects(db.exec(`insert into public.projects(owner_id, domain, website_url) values ('${owner}', 'evil.com', 'https://evil.com')`), /permission denied/);
    await db.exec('set role anon');
    await assert.rejects(db.query('select * from public.projects'), /permission denied/);
    await db.exec('set role service_role');
    for (let i = 0; i < 4; i++) await reserve(owner, `company${i}.com`);
    await assert.rejects(reserve(owner, 'over-limit.com'), /DAILY_LIMIT/);
    assert.equal((await reserve(owner, 'company.com', request)).job.id, first.job.id);
  } finally { await db.close(); }
});
