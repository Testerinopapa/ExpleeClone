# AutoGTM company research

Status: **deployed to the research project on 2026-10-12 with explicit owner approval.** Both migrations and all four Edge Functions are live. The original login project's configuration was not changed.

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

The frontend now uses real jobs and stored profiles. Refreshing or opening a saved project only retrieves results. The previous timed demo progression is removed from the live workflow. Competitor discovery, leads and outbound email remain future steps; this implementation does not fabricate those results or send outreach. Existing landing-page routing and the mobile navigation are retained.

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

The existing database check runs both actual migrations in in-memory PostgreSQL (PGlite). It checks ownership, forbidden client access, the 10-page constraint, request deduplication, the daily limit, atomic/idempotent completion and upgrading existing data to isolated external identities. It does not replace a staging check against the hosted Supabase runtime.

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
3. Close the browser during research, then return to confirm the callback saved the profile. Check products, customers, locations and source links.
4. Reload the profile and confirm no new crawl starts. Use a second account to confirm the first account's job/profile cannot be read.
5. Check free-plan quota and error displays before requesting another run. Each explicit new attempt can consume more existing credits.

The callback retries according to Firecrawl delivery policy; status polling provides recovery while the app is open. If submission confirmation is lost, the job waits for its callback instead of automatically repeating a potentially billable POST. An unconfirmed job becomes failed on the next status check after 30 minutes, with a message to inspect Firecrawl activity before retrying. If callbacks were missed and provider results have expired, a new explicit run is necessary. There is no always-on worker or scheduler in this implementation.

API references used: [Firecrawl batch scrape](https://docs.firecrawl.dev/api-reference/endpoint/batch-scrape), [batch status](https://docs.firecrawl.dev/api-reference/endpoint/batch-scrape-get), [webhooks](https://docs.firecrawl.dev/webhooks/overview), [Supabase function authentication](https://supabase.com/docs/guides/functions/auth), [passwordless email sign-in](https://supabase.com/docs/guides/auth/auth-email-passwordless).
