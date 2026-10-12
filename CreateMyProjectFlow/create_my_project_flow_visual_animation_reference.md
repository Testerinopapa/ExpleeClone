# Create My Project Flow — Animation & Visual Reference

## Scope

This document summarizes the visible animation language, layout behavior, and UI details observed in the uploaded **Create My Project** recording.

The video runs for roughly 64 seconds. The product flow itself becomes clearly visible at about **8.9s**; the earlier portion is mostly capture/setup noise and should not be treated as product behavior.

The strongest overall observation is:

> The flow is intentionally restrained. The sense of progress comes mainly from the progressive agent activity feed, subtle card entrances, skeleton states, and previously completed results accumulating in the sidebar — not from flashy full-page transitions.

---

# 1. Initial “Create My Project” Screen

The first screen is almost completely static.

## Layout

- Fixed white sidebar on the left.
- Very thin pale-gray divider between sidebar and content.
- Explee logo at the top-left.
- `Select project` row below the logo.
- Logged-in user menu anchored at the bottom.
- Large white content area.
- Main form centered in a deliberately narrow content column, around ~560px rather than stretching across the page.

## Main content

Visible hierarchy:

```text
EXPLEE

Let's find your first customers

Your AI go-to-market agent. Enter your company website and we'll
spin up your project — research, campaigns and outreach, all set up for you.

[ Your company website               ] [ Create my project → ]

[ We research your company ]
[ We build targeted campaigns ]
[ We reach out for you ]
```

## Typography

- `EXPLEE`: tiny muted uppercase eyebrow.
- Main headline: large, bold, near-black.
- Supporting description: medium gray with generous line-height.
- Feature card titles: bold.
- Feature card descriptions: muted gray.

## Input + button

- Domain field and green CTA appear on the same row.
- Button is compact rather than oversized.
- Right-arrow icon inside the CTA.
- Focus/entry states are standard and subtle.
- No dramatic validation animation.

## Feature cards

Each of the three feature cards uses:

- white background;
- subtle gray border/shadow;
- medium-large rounded corners;
- small pale icon tile near the top-left;
- bold title;
- muted gray body text.

No visible looping animation is present on the cards.

---

# 2. Clicking “Create My Project”

At roughly **18.9s**, the page switches into the research workflow.

## Transition behavior

The change is very fast.

I do **not** observe:

- full-page fade;
- large slide transition;
- whole-page zoom;
- blur transition;
- loading overlay;
- cinematic page movement.

The old state is essentially replaced in one visual beat.

### Important implementation rule

Do not invent:

- long crossfades;
- page slides;
- spring transitions;
- dark loaders;
- animated full-screen overlays.

The reference feels like a live productivity tool, not a presentation.

---

# 3. Shared Workflow Shell

After project creation, the interface becomes a persistent workflow shell.

## Left sidebar

The sidebar remains approximately the same width throughout.

It progressively accumulates:

- completed step headings;
- company result;
- company description;
- competitors;
- campaigns;
- active agent progress.

A key behavior is that **previous results remain visible as the workflow advances**.

The completed state is compressed into the sidebar rather than discarded.

## Main content area

The main area contains:

- horizontal 1→6 progress rail;
- the current result or loading state;
- large amounts of whitespace in early phases.

---

# 4. Six-Step Progress Rail

The progress rail is visually important and stays consistent.

## Completed steps

- Solid black circular marker.
- White step number.
- Thin connector line continues from the circle.

## Current step

Displayed as a white rounded capsule/pill:

```text
• 1 Research your company
```

Visual details:

- thin gray/dark outline;
- tiny mint-green status dot on the left;
- bold number + label;
- fully rounded capsule shape.

## Future steps

- White/light interior.
- Gray outline.
- Gray step number.

## Motion

I do **not** see the active pill physically sliding between positions.

When the phase changes, the progress rail state changes quickly.

---

# 5. Agent Activity Feed — Primary Animation System

This is the most distinctive animation in the flow.

While a step is running, the sidebar shows:

```text
• Explee agent is working on step X of 6
```

The leading dot is mint/green.

Then sub-steps progressively appear below it.

## Active task

```text
› current task…
```

Characteristics:

- green `›`;
- darker/more prominent text;
- terminal-like small monospace appearance;
- blinking block/caret at the end.

## Completed task

When done, the active row becomes:

```text
✓ completed task…
```

Behavior:

1. Current line appears.
2. `›` marks it as active.
3. Blinking caret remains at the end.
4. Task completes.
5. `›` becomes `✓`.
6. Previous line stays visible.
7. Next task appears underneath.

This creates the perception of intelligence/activity without heavy animation.

### Important

The activity feed **accumulates lines**.

Do not replace one line with the next.

---

# 6. Step 1 — Research Company Loading

Approximate visible period:

```text
18.9s → 27.8s
```

## Main workspace

The center of the page is extremely sparse.

Visible content:

```text
Researching

keethub.lovable.app
```

Details:

- `Researching` is small and light gray.
- Domain is darker and bold.
- Both are centered in a large empty white space.

## Not present

There is no visible:

- spinner;
- progress bar;
- large loading card;
- illustration;
- shimmer;
- modal.

The active progress experience exists primarily in the sidebar.

## Sidebar task example

Observed pattern:

```text
✓ fetching keethub.lovable.app…
✓ reading /pricing and /about…
✓ extracting what you sell and to wh…
› building the company profile…
```

The last/current line includes the blinking terminal block.

---

# 7. Step 1 Result Card

At roughly **27.8s**, the company result appears.

## Entrance

The result appears very quickly.

It feels like a restrained micro entrance rather than a large transition.

Recommended approximation:

```css
opacity: 0 → 1
transform: scale(0.93) → scale(1)
```

Duration should only be a couple hundred milliseconds.

No bounce.

## Card

Small centered card with:

- white background;
- thin pale border;
- medium-large radius;
- almost no heavy shadow.

Layout:

```text
[K]  PrimKeet                         ✓ Found
     keethub.lovable.app

Company description...
```

Visual details:

- circular outline avatar with initial;
- bold company name;
- muted domain;
- small `Found` badge top-right;
- muted-gray description with comfortable line-height.

The card is surrounded by a lot of whitespace.

---

# 8. Step 1 Compresses Into Sidebar

Once Step 2 begins, the company result becomes sidebar context.

Example structure:

```text
✓ step 1 · Research your company

[K] PrimKeet  keethub.lovable.app    ^
```

Company description appears below.

Important behavior:

> The result is not conceptually discarded. It is compressed into a persistent sidebar summary.

A divider separates completed stages.

---

# 9. Step 2 — Competitor Loading

Around **32s**, the company result is replaced by a competitor skeleton card.

The progress rail updates:

- Step 1 → solid black.
- Step 2 → active pill.

## Skeleton geometry

The skeleton preserves the final card structure.

Approximate layout:

```text
PRODUCT                   COMPETITORS

[light bars]              [light bars]
[light bars]              [light bars]

QUERIES
[light bar]
[light bar]
[light bar]
```

## Skeleton appearance

- Very pale gray.
- Very low contrast.
- White card underneath.
- Rounded border.
- Almost completely static.

### Important

I do **not** observe a visible shimmer wave.

Do not automatically add a conventional animated skeleton shimmer unless intentionally deviating from the reference.

---

# 10. Step 2 Agent Activity

Sidebar repeats the terminal/progressive pattern.

Observed examples:

```text
✓ listing keethub.lovable.app produc…
✓ searching "alternatives to keethub…
› checking 12 candidates…
```

Same grammar:

- `✓` completed;
- green `›` active;
- blinking block cursor;
- previous rows remain visible.

---

# 11. Step 2 Result Population

Around **36.4s**, the skeleton becomes the final competitor content.

The populated content appears rapidly.

I do not observe a slow multi-second row-by-row build.

## Left column — PRODUCT

- tiny uppercase gray section label;
- bold product statement;
- muted explanatory text;
- selective bold phrases/keywords embedded inside body copy.

## Left bottom — QUERIES

Three compact query rows:

- pale rounded boxes;
- magnifying-glass icon;
- query text.

## Right column — COMPETITORS

Header contains:

```text
COMPETITORS       ✓ 14 found
```

Then compact rows:

- tiny favicon;
- domain;
- subtle pale-gray row background.

Bottom:

```text
+2 more ⌄
```

The whole card is compact and dense.

---

# 12. Competitor Sidebar Summary

When Step 3 begins, competitor data compresses into the sidebar.

Header:

```text
COMPETITORS 14   ⚙
```

Then competitor chips in **two columns**.

Each chip includes:

- favicon;
- truncated domain;
- external-link icon;
- subtle rounded border/background.

Examples visible:

```text
langly.es
playdiom...
wonderla...
the-conv...
revision...
immersiv...
englishg...
oxford-ge...
```

Then:

```text
⌄ +6 more
```

---

# 13. Step 3 — Define Campaigns

Around **47.2s**, the competitor result is replaced by the campaign/segment grid.

## Rail

- Step 1 → black.
- Step 2 → black.
- Step 3 → current active pill.

## Transition

Again, very fast.

No large full-screen transition.

In this particular recording, no clearly separate Step 3 loading screen is visible before the result appears.

Important implication:

> Not every backend `*_loading` state needs to wipe the main content to a blank loading page.

---

# 14. Campaign Grid

The main Step 3 view is a **two-column grid** of large white cards.

Visible examples include:

- Private tutors
- After-school centers
- Homeschool parents
- Small training firms

## Card top row

Each card contains:

- small category icon;
- bold campaign name;
- count at far right;
- tiny circular progress/ring visual near the count.

## Use-case sentence

Muted body text with selective bold phrases.

Examples of bold fragments:

```text
home practice
speaking drills
English practice
playful practice
reading and vocabulary
English modules
group practice
```

The mixed text weight is visually important.

## PAIN block

Tiny uppercase pill/label:

```text
PAIN
```

Then a muted explanatory sentence.

## CRITERIA block

Tiny uppercase label:

```text
CRITERIA
```

Then rows using gray circular bullets.

## Example chips

Some cards end in pale tags such as:

```text
Kumon
Helen Doron
Oxford Learning
Busy Bees
Kiddie Academy
```

These use:

- pale gray fill;
- little or no visible border;
- compact spacing.

---

# 15. Campaign Card Animation

I examined the Step 3 transition closely.

I do **not** observe:

- cards flying in;
- large staggered cascades;
- spring/bounce motion;
- long scale transitions.

The grid appears almost immediately.

If adding motion, keep it subtle:

```text
opacity: 0 → 1
translateY: 4–8px → 0
~150–250ms
```

Anything more dramatic will diverge from the reference.

---

# 16. Vertical Scrolling in Step 3

The campaign grid exceeds the viewport.

The page becomes naturally vertically scrollable.

Scrollbar:

- thin;
- medium gray;
- native/browser-like.

Later positions in the video reflect normal scrolling, not an automatic transition animation.

---

# 17. Transition to Step 4

Around **54.4s**, three major changes happen almost simultaneously:

1. Campaign data compresses into the sidebar.
2. A free-credit banner appears above the main workflow.
3. The main area changes to a large companies-table skeleton.

The switch remains fast and restrained.

---

# 18. Campaign Sidebar Summary

Sidebar header:

```text
CAMPAIGNS 6   ⚙
```

Then stacked campaign rows.

Each row includes:

- category icon;
- segment name;
- count right-aligned;
- tiny horizontal indicator below the name.

Examples:

```text
ESL teachers          8.0K
Language schools      5.0K
Private tutors       12.0K
After-school centers  4.0K
Homeschool parents    6.0K
Small training firms  1.2K
```

## Selected campaign

The first/active campaign has:

- darker outline;
- stronger white card appearance;
- circled check at right;
- more pronounced horizontal indicator.

Inactive rows remain softer and more muted.

---

# 19. Free-Credit Banner

From Step 4 onward, a wide banner appears above the progress rail.

## Left section

Credit-card icon:

- gray outline;
- pale square container.

Headline:

```text
$30 free credits — get new clients on autopilot
```

Secondary line:

```text
No upfront charge · 750 emails included · Start outbound in 60s
```

## Right section

Large green CTA:

```text
Start outreach for free →
```

Visual behavior:

- persistent;
- full-width inside main content;
- pale gray/white background;
- bottom divider.

It is not floating and does not behave like a toast.

---

# 20. Step 4 Progress Rail

Rail moves beneath the credit banner.

States:

- 1–3 → solid black circles.
- Current:

```text
• 4 Find potential customers
```

- 5–6 → future gray-outline circles.

Same tiny mint-green active dot.

---

# 21. Step 4 Table Skeleton

The loading state becomes much wider and denser than prior cards.

## Structure

Large rounded table with:

- header row;
- many data rows;
- vertical separators;
- horizontal separators;
- pale rectangular placeholders.

Columns visually reserve room for:

```text
Company
Description
Location
Size
Monthly Traffic
```

## Skeleton motion

It remains extremely faint and nearly static.

Again, I do not observe an obvious shimmer sweep.

The sense of progress comes from the sidebar activity feed.

---

# 22. Step 4 Agent Activity

Visible pattern:

```text
• Explee agent is working on step 4 of 6

✓ building search queries from cam…
✓ querying the company index — 312…
› scoring fit for 1,284 domains…
```

Same repeated animation vocabulary:

- mint status dot;
- mono small text;
- `✓` done;
- green `›` current;
- blinking block at line end.

The current task can remain on screen for several seconds without additional UI motion.

That is consistent with the reference.

---

# 23. Global Visual Language

## Backgrounds

- warm white/off-white;
- not heavily blue/gray;
- early stages intentionally contain large empty white areas.

## Accent color

Mint/green is used sparingly for:

- current status dot;
- active task arrow;
- CTA buttons;
- tiny status accents.

It does **not** dominate the interface.

## Borders

Most elements use:

- ~1px very pale gray line;
- little or no strong shadow.

## Corner radius

- medium-large card rounding;
- smaller chip rounding;
- fully rounded active progress pill.

## Typography

Two distinct families/styles:

### Normal UI
Sans-serif for:

- headings;
- body text;
- table content;
- labels.

### Agent activity
Small mono/terminal-like text for:

- workflow logs;
- step activity.

## Density

The UI changes density as the flow progresses:

- initial page → airy;
- company result → small centered card;
- competitor result → compact;
- sidebar → dense;
- campaign cards → information-rich;
- tables → very dense.

---

# 24. Animation Vocabulary to Reproduce

## A. Progressive terminal reveal

Primary animation:

```text
active task appears
↓
green › marker
↓
blinking block/caret
↓
task finishes
↓
› becomes ✓
↓
next row appears
```

This is the strongest observed animation behavior.

---

## B. Result-card micro entrance

Use something approximately like:

```css
opacity: 0 → 1
transform: scale(0.93) → scale(1)
```

Short duration.

No bounce.

---

## C. Row/item entrance

If needed:

```css
opacity: 0 → 1
transform: translateY(4px–8px) → translateY(0)
```

Very short.

---

## D. Immediate state swaps

Many major screen changes are almost instantaneous:

```text
old stage
→
new stage
```

Do not animate every route change.

---

## E. Skeleton replacement

```text
skeleton geometry
→
real content using same geometry
```

Avoid layout jumps.

---

## F. Blinking caret

Tiny terminal-like block at the end of the current task.

Repeated on/off blink.

---

## G. Current-status dot

Tiny green/mint dot.

If animated, use only a subtle opacity pulse.

No large glowing halo.

---

# 25. Animations NOT Observed

Do not add these unless intentionally departing from the reference:

- whole-page crossfades;
- full-screen slide transitions;
- 3D transforms;
- parallax;
- animated gradient backgrounds;
- large bouncing loaders;
- spinning brand logo;
- skeleton shimmer waves;
- cards flying in from offscreen;
- spring physics;
- top progress bars filling continuously;
- auto-scroll between phases;
- active progress pill sliding between steps;
- large modal transition sequences during the captured first four stages.

The reference behaves like:

> a live tool steadily updating itself

rather than:

> a highly animated product demo.

---

# 26. Approximate Timeline From the Recording

```text
~8.9s
Initial Create My Project page visible

~18.9s
Create project submitted
→ Step 1 loading

18.9–27.8s
Research company
sidebar tasks progress line-by-line

~27.8s
Company result appears

~32.0s
Step 2 begins
competitor skeleton + sidebar activity

~36.4s
Competitor result appears

~47.2s
Step 3 campaign result appears

47.2–54.4s
Campaign grid visible

~54.4s
Step 4 begins
credit banner appears
campaign summary compresses into sidebar
companies-table skeleton appears

54.4–64.4s
Step 4 remains loading
sidebar activity continues
table remains skeletonized
```

---

# 27. Important Limitation of This Recording

This video ends during:

```text
Step 4 — Find potential customers
loading
```

It does **not** visibly cover:

- finished Step 4 company table;
- Step 5 decision makers;
- Step 6 email-writing result;
- final checkout/trial modal.

Those later stages should continue to use the separate screenshot and workflow-capture references.

---

# 28. Core Direction for the Agent

Use this as the highest-level animation rule:

> **The animation is in the progressive agent log, restrained micro-entrances, and the accumulation of completed context in the sidebar — not in flashy transitions between screens.**

Implementation priorities:

1. Progressive sidebar activity feed.
2. Blinking active-task caret.
3. `›` → `✓` task completion transitions.
4. Fast route/state swaps.
5. Small fade/scale result-card entrances.
6. Stable skeleton geometry.
7. Persistent prior-stage context in the sidebar.
8. Very limited use of mint/green accents.
9. Preserve large whitespace in early stages.
10. Avoid unnecessary animation.
