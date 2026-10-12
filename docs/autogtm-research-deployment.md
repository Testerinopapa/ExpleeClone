# AutoGTM company research

Phase 1 status: **deployed to the research project on 2026-10-12 with explicit owner approval.** Migrations `20261012000100` and `20261012000200` and the original four Edge Functions are live. The original login project's configuration was not changed.

Step 2 status: **implemented locally; migration and backend deployment require approval.** See the Step 2 commands below. No new remote changes or Firecrawl jobs were started while preparing this implementation.

Frontend status: phases 1 and 2 connect real research data to the original workflow from commit `6c061a1`. The existing loading animation, activity feed, company card, competitor card, sidebar summary, controls and six-stage presentation are retained. Step 2 waits for real results; empty results stay empty. Stages 3–6 retain their existing placeholder data and animations.

## Step 2: competitor discovery

`20261012000300_autogtm_competitors.sql` adds one JSONB column, `company_profiles.competitor_research`, and one service-role-only compare-and-swap RPC. Results inherit the profile's project, job, ownership and RLS; no new table or service is introduced. Each researched profile has a separate immutable search budget and saved results.

The new `competitor-research` function authenticates through the existing login project and looks up the completed profile by both job ID and owner. The original profile's products, description and target customers generate up to **three Firecrawl v2 Search requests**, each returning up to eight web links without scraping. The function reserves each search before the provider call, merges duplicate business domains (including subdomains and country suffixes), excludes the original company and common directories/social sites, and retains at most ten candidates.

It submits **one batch of at most ten homepage scrapes**, one per candidate, requesting Markdown and structured extraction. Names and evidence quotes must appear in the returned page text; unverified facts, cross-business redirects and non-business pages are discarded. Descriptions and fact details use the supporting quotes. Missing pricing stays empty. Results retain source URLs and are deduplicated again by business name. This first implementation reads homepages only, so pricing or other details available exclusively on deeper pages will be absent. Search and structured extraction can consume credits beyond the number of pages; these limits are not a guarantee that every run fits the remaining free allowance.

Ranking is a deterministic estimate based on shared product and audience terms. Matches with sufficient product overlap and an explicitly shared audience rank as direct; others rank as related. It favors evidence over filling all ten slots, may miss synonyms or sparse websites, and does not claim the ranking is a verified market assessment. The existing domain rows link to the source; their native hover text contains the extracted details and estimated relevance. No new result panel, animation or stylesheet is introduced.

The data hook advances one search per request and polls progress. Refreshes resume saved work; concurrent tabs cannot reserve the same search or submit a second batch. A two-minute lease allows an interrupted search to resume with the next unused query, counting the interrupted query against the limit. Failed searches require an explicit retry and only remaining budget is available. A batch submission is never repeated, even if its response was lost. The existing webhook uses a separate stage-specific HMAC to recover the provider ID and save results while the browser is closed. If the browser closes before batch submission, opening the project resumes the remaining searches. Quota failures and exhausted budgets appear in the existing competitor card and controls. Only completed results unlock further workflow progression.

Inspect the linked project's pending changes first (read-only):

```powershell
npx --yes supabase@2.120.0 migration list --linked
npx --yes supabase@2.120.0 db push --linked --dry-run
```

Expected pending migration: **only `20261012000300_autogtm_competitors.sql`**. If the list differs, investigate before applying it. After explicit approval, deploy only this migration, the new function and the updated shared webhook:

```powershell
npx --yes supabase@2.120.0 db push --linked
npx --yes supabase@2.120.0 functions deploy firecrawl-webhook --project-ref cvpeezzkzsbosyuhmhmf
npx --yes supabase@2.120.0 functions deploy competitor-research --project-ref cvpeezzkzsbosyuhmhmf
```

Then publish the frontend through the existing hosting process. No new secret, auth change, subscription or infrastructure replacement is required. Do not run the original fresh-setup SQL against this existing project. The SQL-editor alternative is the new migration itself, after approval; do not also apply it through the CLI without reconciling migration history.

Local checks cover all three migrations, access isolation, the three-search/ten-candidate limits, concurrent requests, failed/interrupted searches, webhook scope/recovery, evidence validation, ranking, deduplication, initial null auth/job state, mobile widths, failure/retry, saved results and empty results. All provider traffic in these checks is mocked. A signed-in live run remains a post-deployment check; it will consume existing Firecrawl credits.

Step 2 API reference: [Firecrawl v2 Search](https://docs.firecrawl.dev/api-reference/endpoint/search).

Research project: `cvpeezzkzsbosyuhmhmf` (`https://cvpeezzkzsbosyuhmhmf.supabase.co`).

Login project: `hpkmrpezybhtyjcsxfiq` (`https://hpkmrpezybhtyjcsxfiq.supabase.co`). Keep its existing LinkedIn configuration.

## Configuration inspected

- The old `supabase/config.toml` referenced `emlggkmtbosahpzrxaul`.
- The four local/frontend environment files referenced `hpkmrpezybhtyjcsxfiq`.
- `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` now identify the research project. The separate `VITE_AUTH_SUPABASE_URL` and `VITE_AUTH_SUPABASE_PUBLISHABLE_KEY` identify the original login project. All local environment files and `.env.example` include both pairs. The auth client only reads `VITE_AUTH_*`; research requests use the research pair.
- There were no existing SQL migrations or Edge Functions in this checkout.
- Supabase CLI 2.120.0 was authenticated and linked to the existing research project. Before deployment, remote inspection confirmed there were no public tables, AutoGTM database functions, deployed Edge Functions or applied migrations. The dry run identified only the two prepared migrations. Public Auth settings previously confirmed that LinkedIn OIDC is enabled on the original login project and disabled on the research project.
- The remote secrets inventory confirmed `FIRECRAWL_API_KEY` exists. Its secret value was neither requested nor read, and no secrets were changed. Do not put it in any `VITE_` variable.

## Implementation

`20261012000100_autogtm_research.sql` adds `projects`, `research_jobs`, `company_profiles`, and `job_events`. `20261012000200_autogtm_external_auth.sql` adds `research_owners`, maps each verified `(auth issuer, subject)` to a local owner ID, and changes the project foreign key to that owner table. Composite foreign keys keep job/profile/event ownership consistent.

The follow-up migration preserves existing data under its original issuer. Accounts from different projects are not merged by matching email or UUID. Research created through the research project's own login before this change stays stored under that identity; it is not silently reassigned to an original-project LinkedIn account. Account deletion across projects requires explicit cleanup of the corresponding research owner; there is no cross-database cascade.

All five tables retain RLS, with **no direct browser read or write access**. Every research operation uses an Edge Function that validates the original project's session through `auth.getUser` and then filters by the mapped owner ID. Only the backend service role accesses the database or transactional reservation/completion RPCs. No research-project Auth user needs to be created or copied.

Each owner can start five jobs per rolling 24 hours, with one active job per company. A request UUID is retained by the browser during an interrupted submission. Reusing it returns the existing job, including after completion. There is no automatic crawl retry.

| Function | Authentication | Purpose |
| --- | --- | --- |
| `start-research` | Original login project's `auth.getUser` validates the bearer token | Reserves a job, maps the company site, selects up to 10 pages, submits a Firecrawl v2 batch |
| `research-status` | Same user validation, followed by owner-filtered job lookup | Reconciles progress and returns the saved project, job, profile and events |
| `research-projects` | Same user validation and owner filtering | Lists saved projects or finds the latest job for a domain |
| `firecrawl-webhook` | Per-job HMAC token in a custom request header | Reconciles the provider result even with the browser closed |

Gateway `verify_jwt` is disabled only for these functions; authentication happens inside each handler. The webhook token is derived from the server service-role key and job ID. Only Firecrawl receives that token; it is never sent to the frontend or stored in public tables. Rotating the service-role key invalidates callbacks for in-flight jobs; authenticated status polling can still recover their results.

`_shared/auth-project.ts` pins the trusted login project and its **public publishable key**. It does not use a client-selected issuer or accept a user ID supplied in the request body. The frontend sends the login project's bearer token with the research project's publishable key to research functions. No additional backend secrets are required.

Firecrawl Map discovers at most 100 candidate URLs; discovery is not 100 page scrapes. The batch contains **at most 10 URLs**, with one homepage, About, Products/Services, Pricing and Contact page prioritized before additional pages. Only the same hostname (allowing `www`) is accepted. Credentials, custom ports, literal IP/local hosts, auth/cart/legal pages and document/media files are excluded. PDFs are not parsed.

JSON extraction uses Firecrawl's existing service, with no additional AI provider. Every description/product/customer/location keeps source URLs from the returned page metadata. Missing facts stay empty, failed/empty pages produce a partial-results warning, and a wholly empty extraction fails. Extracted facts should still be reviewed against their citations. Firecrawl's JSON extraction and Map may consume credits beyond the number of scraped pages; a 10-page limit is not a 10-credit guarantee. Quota/rate-limit errors are surfaced without upgrading a plan or purchasing credits.

Both entry forms preserve the submitted website through the existing sign-in flow and open the original research animation immediately. A data-only hook resumes the latest job for that company or starts one if none exists. Refreshing uses the job ID retained in the URL without submitting another crawl. Phase 1 cannot show the company card or advance until a matching real profile arrives; pause/resume still controls the presentation. Errors use the existing status text and Next Phase button as a retry action. Only an explicit retry of a failed company job starts another company crawl. Stages 3–6 continue their original demo progression and do not perform real lead discovery or outreach. Existing landing-page routing and mobile navigation are retained.

## Deployment verification — 2026-10-12

- Remote migration history contains `20261012000100` and `20261012000200`.
- All four deployed endpoints return HTTP 204 to browser CORS preflight requests, including the required `authorization`, `apikey` and `content-type` headers. Previously they returned HTTP 404.
- Unauthenticated POST requests return the handlers' HTTP 401 responses; the webhook also rejects missing callback credentials.
- All five research tables have RLS enabled. Anonymous and authenticated database roles have no direct SELECT permission; the service role has access. Both AutoGTM RPCs restrict execution to the service role, and project ownership references `research_owners`.
- A complete signed-in Firecrawl run still needs verification in the app. Deployment checks did not start a crawl or consume Firecrawl credits.

## Local verification

```powershell
npm ci
npm run test:db
npm run test:edge
npm run check:edge
npm run build
```

The existing database check runs all three actual migrations in in-memory PostgreSQL (PGlite). It checks ownership, forbidden client access, page/search limits, request deduplication, the daily limit, atomic/idempotent completion and upgrading existing data to isolated external identities. It does not replace a staging check against the hosted Supabase runtime.

Edge tests mock all HTTP calls; no credentials or paid credits are needed. Browser tests mock all Supabase/provider traffic and cover research progress, saved profiles/sources, refresh, retry, mobile widths and OTP failure/success.

With Python Playwright and Chrome installed, start Vite in one terminal and run the browser check in another:

```powershell
node node_modules/vite/bin/vite.js --port 4180 --host 127.0.0.1
python tests/autogtm-browser.py
```

## Authenticate and inspect before deployment

These commands authenticate the CLI locally, link the existing project, and inspect metadata. Use interactive login; do not paste an access token or database password into chat.

```powershell
npx --yes supabase@2.120.0 login
npx --yes supabase@2.120.0 link --project-ref cvpeezzkzsbosyuhmhmf
npx --yes supabase@2.120.0 migration list --linked
npx --yes supabase@2.120.0 functions list --project-ref cvpeezzkzsbosyuhmhmf
npx --yes supabase@2.120.0 secrets list --project-ref cvpeezzkzsbosyuhmhmf
```

Inspect existing remote tables and functions before applying anything. For a fresh setup, confirm these five table names, two `autogtm_*` RPC names and four Edge Function names are unused. For an existing AutoGTM setup, inspect the first migration's objects and apply only the pending follow-up migration. New tables deliberately fail on collisions. If remote migration history differs from this checkout, reconcile it before proceeding; do not reset the database or repair migration history blindly.

For the SQL-editor workflow, `supabase/sql/autogtm_setup.sql` is the combined **fresh setup**. If the original four-table setup has already run, use **only** `supabase/sql/autogtm_external_auth.sql` for this fix. Both require deployment approval. Do not run the fresh setup over existing tables.

Once the linked project and history are confirmed, this command previews pending migrations without applying SQL:

```powershell
npx --yes supabase@2.120.0 db push --linked --dry-run
```

Keep existing Auth settings on `hpkmrpezybhtyjcsxfiq`. Its application's `/app-auto-gtm` URL must remain an allowed redirect. Keep its existing LinkedIn client and callback; LinkedIn does not need enabling on the research project. Email links and 6–8 digit OTP entry use the same original auth project. Inspect the hosting provider's environment variables and set both `VITE_AUTH_*` variables to the original project; hosting variables override checked-in values.

## Deployment commands — only after explicit approval

Run only after the project owner approves the inspected migration and functions:

```powershell
npx --yes supabase@2.120.0 db push --linked
npx --yes supabase@2.120.0 functions deploy firecrawl-webhook --project-ref cvpeezzkzsbosyuhmhmf
npx --yes supabase@2.120.0 functions deploy research-status --project-ref cvpeezzkzsbosyuhmhmf
npx --yes supabase@2.120.0 functions deploy research-projects --project-ref cvpeezzkzsbosyuhmhmf
npx --yes supabase@2.120.0 functions deploy start-research --project-ref cvpeezzkzsbosyuhmhmf
```

Do not run `supabase secrets set` for the existing Firecrawl key. Supabase supplies `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` to the functions. No cron, queue extension, paid plan or additional provider is required.

Publish the frontend through the existing hosting process with both public configuration pairs from `.env.example`. The auth client and LinkedIn redirect will use the original project as soon as that frontend is published; research requires the follow-up migration and updated functions. No hosting infrastructure changes are included here.

## Post-deployment smoke check

1. Sign in using a real Supabase session and submit a company you are permitted to research.
2. Confirm the Firecrawl batch contains no more than 10 URLs and progress updates in AutoGTM.
3. Close the browser during research, then return to confirm the callback saved the profile. Check the company name, domain and description in the original company card and sidebar. Products, customers, locations and source URLs remain stored in the profile for later integrations; they do not introduce new phase 1 panels.
4. Reload the profile and confirm no new crawl starts. Use a second account to confirm the first account's job/profile cannot be read.
5. Check free-plan quota and error displays before requesting another run. Each explicit new attempt can consume more existing credits.

The callback retries according to Firecrawl delivery policy; status polling provides recovery while the app is open. If submission confirmation is lost, the job waits for its callback instead of automatically repeating a potentially billable POST. An unconfirmed job becomes failed on the next status check after 30 minutes, with a message to inspect Firecrawl activity before retrying. If callbacks were missed and provider results have expired, a new explicit run is necessary. There is no always-on worker or scheduler in this implementation.

API references used: [Firecrawl batch scrape](https://docs.firecrawl.dev/api-reference/endpoint/batch-scrape), [batch status](https://docs.firecrawl.dev/api-reference/endpoint/batch-scrape-get), [webhooks](https://docs.firecrawl.dev/webhooks/overview), [Supabase function authentication](https://supabase.com/docs/guides/functions/auth), [passwordless email sign-in](https://supabase.com/docs/guides/auth/auth-email-passwordless).
