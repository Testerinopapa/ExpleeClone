# AutoGTM company research

Status: implementation prepared locally. **No remote migrations or functions have been deployed.**

Target project: `cvpeezzkzsbosyuhmhmf` (`https://cvpeezzkzsbosyuhmhmf.supabase.co`).

## Configuration inspected

- The old `supabase/config.toml` referenced `emlggkmtbosahpzrxaul`.
- The four local/frontend environment files referenced `hpkmrpezybhtyjcsxfiq`.
- Those local project references now match the supplied target. Only the URL and public publishable key were changed. `.env.example` contains the same public settings.
- There were no existing SQL migrations or Edge Functions in this checkout.
- Supabase CLI 2.120.0 is available through `npx`; its read-only project-list request reported that no access token is configured. Remote schema, migration history, function names and Auth settings have **not** been inspected yet.
- `FIRECRAWL_API_KEY` is expected to exist on Supabase as supplied by the project owner. Its value was neither requested nor read. Do not put it in any `VITE_` variable.

## Implementation

`20261012000100_autogtm_research.sql` adds `projects`, `research_jobs`, `company_profiles`, and `job_events`. Composite foreign keys keep job/profile/event ownership consistent. All four tables have owner-only SELECT policies. Authenticated clients cannot write them or execute the two backend RPCs. The service role uses transactional reservation and completion RPCs.

Each owner can start five jobs per rolling 24 hours, with one active job per company. A request UUID is retained by the browser during an interrupted submission. Reusing it returns the existing job, including after completion. There is no automatic crawl retry.

| Function | Authentication | Purpose |
| --- | --- | --- |
| `start-research` | Supabase `auth.getUser` validates the bearer token | Reserves a job, maps the company site, selects up to 10 pages, submits a Firecrawl v2 batch |
| `research-status` | Same user validation, followed by owner-filtered job lookup | Reconciles progress and returns the saved project, job, profile and events |
| `firecrawl-webhook` | Per-job HMAC token in a custom request header | Reconciles the provider result even with the browser closed |

Gateway `verify_jwt` is disabled only for these functions; authentication happens inside each handler. The webhook token is derived from the server service-role key and job ID. Only Firecrawl receives that token; it is never sent to the frontend or stored in public tables. Rotating the service-role key invalidates callbacks for in-flight jobs; authenticated status polling can still recover their results.

Firecrawl Map discovers at most 100 candidate URLs; discovery is not 100 page scrapes. The batch contains **at most 10 URLs**, with one homepage, About, Products/Services, Pricing and Contact page prioritized before additional pages. Only the same hostname (allowing `www`) is accepted. Credentials, custom ports, literal IP/local hosts, auth/cart/legal pages and document/media files are excluded. PDFs are not parsed.

JSON extraction uses Firecrawl's existing service, with no additional AI provider. Every description/product/customer/location keeps source URLs from the returned page metadata. Missing facts stay empty, failed/empty pages produce a partial-results warning, and a wholly empty extraction fails. Extracted facts should still be reviewed against their citations. Firecrawl's JSON extraction and Map may consume credits beyond the number of scraped pages; a 10-page limit is not a 10-credit guarantee. Quota/rate-limit errors are surfaced without upgrading a plan or purchasing credits.

The frontend now uses real jobs and stored profiles. Refreshing or opening a saved project only retrieves results. The previous timed demo progression is removed from the live workflow. Competitor discovery, leads and outbound email remain future steps; this implementation does not fabricate those results or send outreach. Existing landing-page routing and the mobile navigation are retained.

## Local verification

```powershell
npm ci
npm run test:db
npm run test:edge
npm run check:edge
npm run build
```

The database test runs the actual migration in in-memory PostgreSQL (PGlite), with Supabase-compatible auth roles stubbed locally. It checks RLS across owners, forbidden writes/RPC access, the 10-page constraint, request deduplication, the daily limit and atomic/idempotent completion. It does not replace a staging check against the hosted Supabase runtime.

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

Inspect the existing remote tables and functions before applying anything. Confirm that these four table names, two `autogtm_*` RPC names, and three Edge Function names are unused. The migration deliberately fails on collisions instead of replacing infrastructure. If remote migration history contains files absent from this checkout, reconcile that history in a separate checkout before proceeding; do not reset the database or repair migration history blindly.

Once the linked project and history are confirmed, this command previews pending migrations without applying SQL:

```powershell
npx --yes supabase@2.120.0 db push --linked --dry-run
```

Check existing Supabase Auth settings: email sign-in must be enabled and the application's `/app-auto-gtm` URL must be an allowed redirect. Both magic-link emails and 6–8 digit OTP entry are supported. To use codes, the existing email template must include `{{ .Token }}`. Keep any existing SMTP/LinkedIn setup; do not enable or buy another service. Also inspect the hosting provider's existing environment variables, since they override checked-in frontend values.

## Deployment commands — only after explicit approval

Run only after the project owner approves the inspected migration and functions:

```powershell
npx --yes supabase@2.120.0 db push --linked
npx --yes supabase@2.120.0 functions deploy firecrawl-webhook --project-ref cvpeezzkzsbosyuhmhmf
npx --yes supabase@2.120.0 functions deploy research-status --project-ref cvpeezzkzsbosyuhmhmf
npx --yes supabase@2.120.0 functions deploy start-research --project-ref cvpeezzkzsbosyuhmhmf
```

Do not run `supabase secrets set` for the existing Firecrawl key. Supabase supplies `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` to the functions. No cron, queue extension, paid plan or additional provider is required.

Publish the frontend through the existing hosting process after backend deployment, using the target public environment settings. No hosting infrastructure changes are included here.

## Post-deployment smoke check

1. Sign in using a real Supabase session and submit a company you are permitted to research.
2. Confirm the Firecrawl batch contains no more than 10 URLs and progress updates in AutoGTM.
3. Close the browser during research, then return to confirm the callback saved the profile. Check products, customers, locations and source links.
4. Reload the profile and confirm no new crawl starts. Use a second account to confirm the first account's job/profile cannot be read.
5. Check free-plan quota and error displays before requesting another run. Each explicit new attempt can consume more existing credits.

The callback retries according to Firecrawl delivery policy; status polling provides recovery while the app is open. If submission confirmation is lost, the job waits for its callback instead of automatically repeating a potentially billable POST. An unconfirmed job becomes failed on the next status check after 30 minutes, with a message to inspect Firecrawl activity before retrying. If callbacks were missed and provider results have expired, a new explicit run is necessary. There is no always-on worker or scheduler in this implementation.

API references used: [Firecrawl batch scrape](https://docs.firecrawl.dev/api-reference/endpoint/batch-scrape), [batch status](https://docs.firecrawl.dev/api-reference/endpoint/batch-scrape-get), [webhooks](https://docs.firecrawl.dev/webhooks/overview), [Supabase function authentication](https://supabase.com/docs/guides/functions/auth), [passwordless email sign-in](https://supabase.com/docs/guides/auth/auth-email-passwordless).
