# Sanitized Post-Login Workflow Specification

**Purpose:** Recreate the post-login AutoGTM-style onboarding/research workflow captured from the reference site, while removing account data, tokens, personal identifiers, production secrets, analytics IDs, payment secrets, and real lead PII.

**Source capture:** Browser workflow recording + HAR, captured from the initial post-login project-creation screen through the final phase.

---

## 1. Sanitization rules

This document intentionally replaces sensitive or user-specific values with placeholders.

### Never copy from the raw capture
- authenticated user email or account IDs
- organization IDs
- session claims / JWT-related values
- support tokens
- device/session IDs
- analytics visitor IDs
- payment `client_secret`
- Stripe publishable/configuration values from the reference site
- real lead names, personal email addresses, LinkedIn profile URLs, or profile-photo URLs
- real run IDs / segment IDs if used as durable examples
- raw cookies / Authorization headers
- third-party tracking payloads

### Placeholder conventions
- `<company-domain>` — website entered by the user
- `<company-name>` — researched company name
- `<run-id>` — internal workflow/agent run ID
- `<segment-id>` — campaign/segment ID
- `<person-id>` — internal person identifier
- `<project-id>` — local project ID
- `<count>` — dynamic count returned by the workflow
- `<percent>` — dynamic percentage
- `<country>` / `<city>` — dynamic geography

Use synthetic fixture data for development screenshots and tests.

---

# 2. High-level user journey

The authenticated user lands on:

```text
/app-auto-gtm
```

The page asks for a company website.

Visible structure:

```text
Sidebar
  Explee logo
  Select project
  authenticated-user menu

Main
  EXPLEE
  Let's find your first customers

  Your AI go-to-market agent. Enter your company website and we'll
  spin up your project — research, campaigns and outreach, all set up for you.

  [ Your company website               ] [ Create my project → ]

  [ We research your company ]
  [ We build targeted campaigns ]
  [ We reach out for you ]
```

After the user submits a valid domain, navigate to:

```text
/auto-gtm/company/<company-domain>/explore?src=cabinet
```

The workflow then advances through six research/outreach steps and a final state.

---

# 3. Route-driven state machine

Treat the `phase` query parameter as the canonical visual state.

Observed state order:

```text
/app-auto-gtm
    ↓
/auto-gtm/company/<company-domain>/explore?src=cabinet
    ↓
phase=research_company_loading
    ↓
phase=research_company
    ↓
phase=research_competitors_loading
    ↓
phase=research_competitors
    ↓
phase=research_segments_loading
    ↓
phase=research_segments
    ↓
phase=outreach_companies_loading
    ↓
phase=outreach_companies
    ↓
phase=outreach_people_loading
    ↓
phase=outreach_people
    ↓
phase=outreach_emails_loading
    ↓
phase=outreach_emails
    ↓
phase=final
```

Use `history.replaceState()` for phase changes so the browser history is not polluted with every internal animation state.

Direct refresh of any valid phase should restore that visual state from stored project data.

---

# 4. Observed cadence

The captured run already existed on the backend, but the UI still revealed stages progressively.

Approximate observed dwell times:

| Transition | Approx. time |
|---|---:|
| `research_company_loading` → `research_company` | 5.47 s |
| `research_competitors_loading` → `research_competitors` | 5.05 s |
| `research_segments_loading` → `research_segments` | 5.01 s |
| `outreach_companies_loading` → `outreach_companies` | 4.96 s |
| `outreach_people_loading` → `outreach_people` | 4.59 s |
| `outreach_emails_loading` → `outreach_emails` | 14.34 s |
| `outreach_emails` → `final` | 4.17 s |

### Implementation rule

Do **not** hardcode the workflow to finish after those exact times.

Use:

```text
minimum visual dwell
+
actual data readiness
```

Example:

```js
await Promise.all([
  wait(MIN_STAGE_DWELL),
  waitUntilStageDataReady()
])
```

If data is already cached/completed, retain the staged reveal so the reference animation still feels intentional.

---

# 5. Shared six-step shell

After project creation, the main workflow uses a two-part layout:

```text
LEFT SIDEBAR
  Explee logo
  completed/current step summaries
  researched company/project context

MAIN AREA
  horizontal 1 → 6 progress rail
  current result/loading card centered in the workspace
```

Progress labels:

1. Research your company
2. Explore competitors
3. Identify campaigns
4. Find companies
5. Find people
6. Write emails

Reference terminology also maps the six data steps as:

```text
Company
Competitors
Campaigns
Companies
People
Emails
```

Completed steps remain visible in the left sidebar and can reveal summarized context from prior stages.

---

# 6. Loading-state visual pattern

Every stage uses a progressive activity panel rather than a generic spinner.

Base copy:

```text
Explee agent is working on step X of 6
```

Each subtask starts with a current marker:

```text
› current task…
```

Completed subtasks change to:

```text
✓ completed task…
```

The current line should advance while previous lines remain visible.

Use a subtle activity animation rather than instantly swapping all text.

---

# 7. Step 1 — Research company

## Route

```text
phase=research_company_loading
phase=research_company
```

## Loading activity sequence

Captured wording pattern:

```text
Explee agent is working on step 1 of 6
› fetching <company-domain>…
```

For a genuinely live run, the activity feed can consume backend `step_update` events rather than inventing text.

## Result card

The completed company result contains:

```text
[initial/logo]  <company-name>                       ✓ Found
                <company-domain>

<company-description>
```

Recommended normalized model:

```ts
type CompanyProfile = {
  id: string
  domain: string
  name: string
  description: string
  logoUrl?: string | null

  founded?: number | null
  employeeCount?: number | null
  industry?: string | null
  city?: string | null
  country?: string | null

  traffic?: number | null
  trafficGrowth?: number | null
  fundingStage?: string | null

  productSummary?: string | null

  determinants: string[]
  searchQueries: string[]
  competitors: Competitor[]
}
```

Do not make the captured example company a permanent fixture.

---

# 8. Step 2 — Explore competitors

## Route

```text
phase=research_competitors_loading
phase=research_competitors
```

## Loading activity sequence

Observed pattern:

```text
Explee agent is working on step 2 of 6

› listing <company-domain> product keywords…
✓ listing <company-domain> product keywords…

› searching "alternatives to <company-domain>"…
✓ searching "alternatives to <company-domain>"…

› checking <count> candidates…
✓ checking <count> candidates…

› keeping the <count> closest…
```

Counts must be dynamic.

## Result card structure

Two-column card:

```text
PRODUCT                              COMPETITORS   ✓ <count> found

<Product determinant/summary>        <competitor-domain>
                                     <competitor-domain>
<Product determinant>                <competitor-domain>
<Product determinant>                ...
                                     +<count> more

QUERIES
[ search query ]
[ search query ]
[ search query ]
```

Normalized structures:

```ts
type Competitor = {
  domain: string
  name?: string
  faviconUrl?: string | null
}

type CompetitorResearch = {
  determinants: string[]
  searchQueries: string[]
  competitors: Competitor[]
}
```

The captured reference used Google favicon-style images for some domain rows. Your implementation may use a safe favicon resolver or local fallback initials.

---

# 9. Step 3 — Identify campaigns / segments

## Route

```text
phase=research_segments_loading
phase=research_segments
```

## Loading activity sequence

Observed pattern:

```text
Explee agent is working on step 3 of 6

› clustering use cases…
✓ clustering use cases…

› matching pains to buyers…
✓ matching pains to buyers…

› scoring <count> campaign ideas…
✓ scoring <count> campaign ideas…

› writing campaign briefs…
```

## Dynamic result

Campaigns arrive as structured segments.

Normalized schema:

```ts
type CampaignSegment = {
  id: string
  label: string
  icon?: string

  useCase: string
  pain: string

  criteria: string[]
  negativeCriteria: string[]

  keywords: string[]
  exampleClients: string[]

  percentage?: number
  estimatedCompanies?: number
  buyerType?: string
  decisionMaker?: string
}
```

### Incremental behavior

The captured agent stream emitted each segment independently using a `segment_ready` event.

Do not wait for all segments if you are reproducing the live feel.

Preferred behavior:

```text
segment_ready #1 → animate card/row in
segment_ready #2 → animate next card/row in
...
workflow complete → mark stage complete
```

---

# 10. Step 4 — Find companies

## Route

```text
phase=outreach_companies_loading
phase=outreach_companies
```

## Loading activity sequence

Observed pattern:

```text
Explee agent is working on step 4 of 6

› building search queries from campaigns…
✓ building search queries from campaigns…

› querying the company index — <count> matches…
✓ querying the company index — <count> matches…

› scoring fit for <count> domains…
✓ scoring fit for <count> domains…

› ranking the outreach list…
```

## Result table

Observed visible columns:

```text
Company
Description
Location
Size
Monthly traffic
```

Normalized company row:

```ts
type ProspectCompany = {
  id?: string
  domain: string
  name: string
  description?: string

  country?: string
  city?: string
  employeeCount?: number | string

  monthlyTraffic?: number
  trafficGrowth?: number

  industry?: string
  founded?: number
  fundingStage?: string
  linkedinId?: string

  engagement?: number
  tags?: string[]
}
```

### Data loading shape

The captured implementation returned tabular data with:

```ts
{
  columns: Array<{
    name: string
    dtype: string
  }>

  rows: ProspectCompany[]
  total_rows: number
  offset: number
  limit: number
}
```

For your clone, implement an equivalent internal endpoint or Supabase-backed query.

**Do not call the reference site's production endpoint.**

---

# 11. Step 5 — Find people

## Route

```text
phase=outreach_people_loading
phase=outreach_people
```

## Loading activity sequence

Observed pattern:

```text
Explee agent is working on step 5 of 6

› picking top companies from the list…
✓ picking top companies from the list…

› finding decision makers on LinkedIn…
✓ finding decision makers on LinkedIn…

› verifying emails — <percent>% deliverable…
✓ verifying emails — <percent>% deliverable…

› assembling the contact list…
```

## Result table

Observed visible columns:

```text
Name
Job Title
Company
Geo
```

Normalized model:

```ts
type ProspectPerson = {
  id: string

  firstName: string
  lastName: string
  title?: string
  headline?: string

  companyDomain: string
  companyId?: string

  country?: string

  profileUrl?: string
  profilePhotoUrl?: string

  email?: string | null
  emailStatus?: string | null
  emailProvider?: string | null
}
```

### Important privacy rule

For local fixtures/tests, use synthetic people.

Never commit real people/emails extracted from the captured reference run.

---

# 12. Email enrichment stream

The captured workflow used a provider-race style stream for email discovery.

Observed event concepts:

```ts
type EmailStreamEvent =
  | {
      type: "init"
      total_people: number
    }
  | {
      type: "person_start"
      person_id: string
      name: string
      company: string
      providers: string[]
    }
  | {
      type: "provider_result"
      person_id: string
      provider: string
      found: boolean
      email?: string | null
      status?: string | null
    }
  | {
      type: "person_done"
      person_id: string
      found: boolean
      email?: string | null
      provider?: string | null
      status?: string | null
      found_count: number
    }
  | {
      type: "stream_end"
      status: "done" | "error"
    }
```

For the clone, these event names can be preserved internally if useful, but provider names should come from your own services rather than pretending to be the reference site's production providers.

---

# 13. Step 6 — Write email

## Route

```text
phase=outreach_emails_loading
phase=outreach_emails
```

## Loading activity sequence

Observed pattern:

```text
Explee agent is working on step 6 of 6

› picking the hottest lead…
✓ picking the hottest lead…

› reading their company signals…
✓ reading their company signals…

› drafting the first email…
✓ drafting the first email…

› personalizing the opener…
```

This is the longest loading phase in the capture.

## Draft request contract

Use your own endpoint with a contract equivalent to:

```ts
type GenerateDraftRequest = {
  segmentId: string

  personId?: string
  personProfileUrl?: string

  firstName: string
  lastName?: string
  title?: string

  companyDomain: string
  companyName?: string
  companyDescription?: string
}
```

## Draft response contract

```ts
type DraftHighlight = {
  text: string
  kind: "research" | "instructions" | string
  title?: string
  explanation?: string
  sources?: string[]
}

type GenerateDraftResponse = {
  draftId?: string
  cached: boolean

  subject: string
  body: string

  highlights: DraftHighlight[]

  languageUsed?: string
  languageReason?: string
}
```

### Dynamic language

The reference workflow can generate an email in a recipient-appropriate language.

Do not assume English-only output.

---

# 14. After step 6

The captured UI shows a transition/upsell section similar to:

```text
What happens next

7  Send emails
8  Book meetings
9  Learn & double down

$<trial-credit> free credits
No upfront charge

[ Start outreach ]
```

Keep trial-credit/pricing values configuration-driven.

Do not copy payment credentials or production checkout behavior from the capture.

Payment integration should be implemented separately using your own Stripe/Supabase/Lovable configuration.

---

# 15. Final state

## Route

```text
phase=final
```

The final state exposes the completed pipeline rather than another loading card.

Observed high-level tabs/sections include:

```text
Companies
People
Emails
```

The final screen should be driven from the same project/run state accumulated during the six-step flow.

Do not duplicate result data into separate hardcoded final-page fixtures.

---

# 16. Project aggregate response

The captured app had a project-level aggregate shape equivalent to:

```ts
type ProjectWorkflowState = {
  company: CompanyProfile

  determinants: string[]
  competitors: Competitor[]
  searchQueries: string[]

  segments: CampaignSegment[]

  segmentRuns: Record<string, {
    status?: string
    companiesCount?: number
    peopleCount?: number
    // other internal run metadata
  }>

  domains: Array<{
    domain: string
    available: boolean
  }>

  pipelineLog: PipelineEvent[]
}
```

This aggregate endpoint is useful for:
- refresh
- browser back/forward
- resuming a completed project
- replaying the phase sequence
- rendering the sidebar summary

---

# 17. Agent/event-stream model

The captured flow used Server-Sent Events (SSE).

Useful normalized event family:

```ts
type PipelineEvent =
  | {
      type: "step_update"
      step: string
      status: "running" | "done" | "error"
      message?: string
      count?: number
      timings?: Record<string, number>
    }
  | {
      type: "segment_ready"
      step: "segments"
      index: number
      segment: CampaignSegment
    }
  | {
      type: "domain_ready"
      step: "infra"
      domain: string
      available: boolean
    }
  | {
      type: "infra_progress"
      step: "infra"
      message: string
    }
  | {
      type: "tool_call"
      tool: string
      input: unknown
      description?: string
    }
  | {
      type: "tool_result"
      output: unknown
    }
  | {
      type: "preview_ready"
      step: "companies" | "people"
      count: number
    }
  | {
      type: "preview_updated"
      step: "companies" | "people"
      count: number
    }
  | {
      type: "finished"
      status: "done"
    }
  | {
      type: "done"
      reason?: string
    }
```

Captured event types also included provider/email-enrichment events described above.

---

# 18. Suggested clone-side API boundary

Do not copy the reference production URLs literally into the clone.

Implement your own equivalent endpoints, for example:

```text
POST /api/projects
GET  /api/projects/:domain

POST /api/projects/:projectId/runs/ensure
GET  /api/runs/:runId/events

GET  /api/runs/:runId/companies?limit=100&offset=0
GET  /api/runs/:runId/people?limit=100&offset=0

POST /api/drafts/generate
POST /api/runs/:runId/draft-shown
```

The frontend should depend on these contracts, not on Explee's live backend.

---

# 19. Animation specification

## Result-card entrance

Captured keyframe:

```css
@keyframes cardEnter {
  from {
    transform: scale(0.93);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
```

Use on primary result cards as a short ease-out entrance.

---

## Row/item entrance

Observed named animation:

```text
slideUp
```

Use approximately:

```css
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

Stagger rows/items slightly when a list becomes visible.

---

## Activity pulse

Observed:

```text
pulse
```

Use on current-step dots/status indicators.

Do not pulse every completed element.

---

## Loader

Observed:

```text
spin
```

Use for compact spinner states where needed.

---

## Typing/activity blink

Observed:

```text
blink
```

Use sparingly around active generation/cursor-style indicators.

---

## General transitions

Frequently changing properties in the capture:

```text
background-color
opacity
transform
color
border colors
height / width
```

Favor subtle 150–300 ms transitions.

Do not use exaggerated spring physics unless visible in the reference.

---

# 20. Loading activity animation behavior

Recommended component:

```tsx
<AgentActivity
  step={2}
  totalSteps={6}
  items={[
    { label: "...", status: "done" },
    { label: "...", status: "done" },
    { label: "...", status: "active" },
  ]}
/>
```

Statuses:

```ts
type ActivityStatus =
  | "pending"
  | "active"
  | "done"
  | "error"
```

Visual behavior:

```text
pending → muted
active  → › + normal/high contrast + subtle pulse
done    → ✓ + muted/confirmed
error   → error icon/message
```

Animate only the transition between states; do not remount the entire panel on every update.

---

# 21. State architecture

Recommended frontend state:

```ts
type WorkflowPhase =
  | "research_company_loading"
  | "research_company"
  | "research_competitors_loading"
  | "research_competitors"
  | "research_segments_loading"
  | "research_segments"
  | "outreach_companies_loading"
  | "outreach_companies"
  | "outreach_people_loading"
  | "outreach_people"
  | "outreach_emails_loading"
  | "outreach_emails"
  | "final"
```

Project state should be separate from visual phase:

```ts
type WorkflowStore = {
  project: ProjectWorkflowState | null
  phase: WorkflowPhase

  companies: ProspectCompany[]
  people: ProspectPerson[]
  drafts: GenerateDraftResponse[]

  activities: ActivityItem[]

  isConnectedToStream: boolean
  error?: string | null
}
```

The route phase controls what is shown.

The data store controls what content is available.

Do not combine both into a giant boolean soup such as:

```text
showCompany
showCompetitors
isCompanyLoading
isCompetitorsLoading
...
```

---

# 22. Resume / cached-run behavior

Important observation from the capture:

The backend run could already be `done`, yet the frontend still displayed the stages sequentially.

Required behavior:

```text
existing completed run
    ↓
load aggregate project data
    ↓
replay/reveal workflow stages in reference cadence
    ↓
do NOT rerun expensive research unnecessarily
```

If a run truly needs to start:

```text
ensure run
    ↓
subscribe to event stream
    ↓
merge incoming events into project state
    ↓
advance phases when required data is ready
```

---

# 23. Failure states

Implement at least:

### Company lookup failure

```text
Company not found

We couldn't find <company-domain> in our database or retrieve data
from the website.

[ Try another company ]
```

### Network failure

```text
Connection error

Something went wrong. Please check your connection and try again.

[ Retry ]
```

Never leave the user trapped in an infinite loading phase.

---

# 24. Reference-side UI labels worth preserving

These labels were explicitly present in the captured application configuration:

```text
Analyzing your website…
Finding competitors…
Identifying campaigns…
Finding companies…
Finding people…
Writing emails…
Outreach ready
```

Sidebar/result labels:

```text
Found
PRODUCT
QUERIES
COMPETITORS
CAMPAIGNS
Pain
Criteria
Examples
```

Feedback prompts supported by the reference configuration:

```text
Did we get this right?
Competitors on point?
Do these segments fit?
Companies on point?
People on point?
Would you send these?
```

These can be added after the core workflow fidelity is correct.

---

# 25. What NOT to reproduce from the capture

Do not reproduce or depend on:

- third-party analytics trackers
- ad pixels
- visitor-identification scripts
- Crisp configuration from the reference
- reference Stripe account/config
- reference payment endpoints
- reference authentication/session system
- real customer testimonials/data leaked into initial SSR markup
- raw production IDs
- real lead PII
- reference support tokens
- tracking-device IDs
- reference company's internal analytics payloads

Those are implementation noise, not required product behavior.

---

# 26. Synthetic development fixture

Use a fake fixture for deterministic UI testing:

```js
export const demoProject = {
  company: {
    id: "demo-company-1",
    domain: "example-learning.test",
    name: "Example Learning",
    description:
      "A fictional learning platform used only to test the onboarding workflow.",
    determinants: [
      "Game-based learning",
      "Education teams",
      "Recurring learner engagement"
    ],
    searchQueries: [
      "game based learning platform",
      "learning engagement software",
      "education practice app"
    ],
    competitors: [
      { domain: "sample-one.test" },
      { domain: "sample-two.test" },
      { domain: "sample-three.test" }
    ]
  },

  segments: [
    {
      id: "segment-demo-1",
      label: "Language educators",
      icon: "graduation-cap",
      useCase: "Assign interactive practice between lessons",
      pain: "Learners need more practice outside class",
      criteria: [
        "Runs recurring classes",
        "Uses digital learning tools"
      ],
      negativeCriteria: [
        "No recurring learners"
      ],
      keywords: [
        "language teacher",
        "learning games",
        "student engagement"
      ],
      exampleClients: [
        "Example School A",
        "Example School B"
      ],
      percentage: 30,
      estimatedCompanies: 8000
    }
  ]
}
```

Synthetic prospect:

```js
{
  id: "person-demo-1",
  firstName: "Taylor",
  lastName: "Example",
  title: "Language Instructor",
  companyDomain: "example-school.test",
  country: "US",
  email: "taylor@example-school.test",
  emailStatus: "verified"
}
```

Synthetic draft:

```js
{
  draftId: "draft-demo-1",
  cached: false,
  subject: "Practice between lessons",
  body:
    "Hi Taylor,\n\nSaw your team runs recurring language classes...\n\nWould it be useful to try a small game set with one class?\n\nBest,",
  highlights: [
    {
      text: "Saw your team runs recurring language classes...",
      kind: "research",
      title: "Relevant company signal",
      sources: ["company.description"]
    }
  ],
  languageUsed: "English"
}
```

---

# 27. Acceptance checklist

## Routing
- [ ] `/app-auto-gtm` renders project creation
- [ ] valid domain starts the workflow
- [ ] every phase has a direct/restorable URL
- [ ] refresh preserves the active phase
- [ ] internal phase changes use replace-state behavior

## Loading stages
- [ ] six loading phases exist
- [ ] each shows “step X of 6”
- [ ] activity lines progress from `›` to `✓`
- [ ] stages wait for data readiness
- [ ] cached data still uses staged reveal

## Results
- [ ] company card
- [ ] competitor/product/query card
- [ ] campaign/segment results
- [ ] companies table
- [ ] people table
- [ ] dynamic email draft
- [ ] final Companies / People / Emails state

## Animation
- [ ] result cards scale/fade in
- [ ] rows slide/fade in
- [ ] active indicators pulse
- [ ] loading spinner only where appropriate
- [ ] no exaggerated animations
- [ ] previous-stage context remains stable during transitions

## Data
- [ ] project aggregate can restore the UI
- [ ] SSE/event stream can incrementally update state
- [ ] companies and people support pagination/limits
- [ ] email generation is based on selected segment/person/company
- [ ] generated language may vary by recipient/context

## Security / sanitization
- [ ] no reference-site API calls
- [ ] no reference credentials
- [ ] no captured account/session identifiers
- [ ] no real lead PII in fixtures
- [ ] no captured payment secrets
- [ ] no raw HAR/workflow dump committed to the repo

---

# 28. Implementation priority

Build in this order:

1. route/state machine
2. shared six-step shell + sidebar
3. loading activity component
4. company result
5. competitor result
6. campaign/segment result
7. companies table
8. people table
9. draft-generation result
10. final state
11. SSE/live-data integration
12. animation fine-tuning
13. optional feedback controls
14. payment/trial CTA as a separate integration

The first milestone should work entirely with the synthetic fixture.

Only after the visual/behavioral clone is stable should the synthetic fixture be replaced by your own backend/Supabase/AI pipeline.
