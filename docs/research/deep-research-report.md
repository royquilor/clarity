# Clarity Sprint Stages: Evidence-Backed Definitions and Consequences

[Download the Markdown file](sandbox:/mnt/data/clarity-sprint-stages-deep-research.md)

## Executive summary

Clarity Sprint’s labels (Chaos → Shaped) are metaphors, but the underlying capabilities are well-studied: **requirements quality**, **stakeholder alignment**, **scope control**, and **early error detection**. Across industry and academic work, weak early clarity compounds into measurable waste (rework, schedule slips, budget overruns, delayed launches, and value shortfalls).

Key findings that anchor the stages:

- PMI reports “inaccurate requirements gathering” as a primary cause of project failure (37%) and estimates that ~**5.1% of spend** is wasted due to poor requirements management. citeturn12view0  
- PMI also cites benchmarking that low requirements maturity correlates with business objectives achieved only ~**54%** of the time and ~**35% longer** delivery. citeturn12view0  
- IAG’s benchmark summary reports poor requirements can add **$2.24M** per strategic project and correlates with **3 failures for every 1 success**; it also reports that >**40% of IT development budget** may be consumed by poor requirements at an “average company.” citeturn16view0  
- McKinsey/Oxford analysis of **5,400+ IT projects** reports large projects (defined as >$15M) average **45% over budget**, **7% over time**, and deliver **56% less value** than predicted; each additional scheduled year increases cost overruns by **15%**, and **17%** of IT projects become extreme events that can threaten a company’s existence (“black swans”). citeturn12view3  
- In software delivery, avoidable rework is often enormous: Boehm & Basili report projects spend **~40–50%** of effort on avoidable rework, and fixing issues post-delivery is often **~100×** more expensive than fixing during requirements/design. citeturn12view5  
- In complex hardware/software programs, NASA reports requirements error correction costs can escalate from **1×** early to **21–78×** in integration/test and **29× to >1500×** during operations. citeturn12view6  

Because “Chaos/Signal/Pattern/Framed/Structured/Shaped” is not a standard taxonomy in the literature, this report **maps each stage to a research-backed competency** (e.g., “Framed” → explicit boundaries + measurable success; “Structured” → small, prioritized MVP). Where a stage-to-metric mapping is indirect, it is stated plainly.

### Source links

Links are listed in a code block so you can paste them into docs or tickets.

```text
PMI (2014) Requirements Management — A Core Competency for Project and Program Success
https://www.pmi.org/-/media/pmi/documents/public/pdf/learning/thought-leadership/pulse/requirements-management.pdf

PMI (2018) Scope Patrol (scope creep rising; 52% projects experienced scope creep/uncontrolled changes)
https://www.pmi.org/learning/library/scope-creep-rising-11308

McKinsey & Company (2012) Delivering large-scale IT projects on time, on budget, and on value
https://www.mckinsey.com/capabilities/tech-and-ai/our-insights/delivering-large-scale-it-projects-on-time-on-budget-and-on-value

Standish Group (2013) CHAOS-style briefing slides (features used often vs rarely; small vs large project outcomes)
https://athena.ecs.csus.edu/~buckley/CSc231_files/Standish_2013_Report.pdf

IAG Consulting (2008) Business Analysis Benchmark summary (poor requirements cost per project; failure ratio)
https://www.iag.biz/business-analysis-benchmark-2008/

NASA (Stecklein et al., 2004) Error Cost Escalation Through the Project Life Cycle
https://ntrs.nasa.gov/api/citations/20100036670/downloads/20100036670.pdf

Westfall Team (2005–2006) The Why, What, Who, When and How of Software Requirements
https://ima.udg.edu/~sellares/EINF-ES2/The_Why_What_Who_When_and_How_Of_Software_Requirements.pdf

Kulk & Verhoef (2008) Quantifying requirements volatility effects (Science of Computer Programming)
https://www.cs.vu.nl/~x/qrv/qrv.pdf

HBR (1991) The Return Map: Tracking Product Teams (cites McKinsey study re: delay impact)
https://hbr.org/1991/01/the-return-map-tracking-product-teams
```

## Comparative view

### Stage progression timeline

```mermaid
flowchart LR
  Chaos --> Signal --> Pattern --> Framed --> Structured --> Shaped
```

### Acceptance criteria and consequence metrics by stage

| Stage | Minimum acceptance criteria (what must be true) | Typical measurable consequences when weak or missing |
|---|---|---|
| Chaos | A single-sentence **problem statement**, a named **primary user**, and a clear **decision owner** exist (written, not just verbal). | Higher failure/waste risk: “inaccurate requirements gathering” cited as a primary cause of failure (37%); ~5.1% of spend wasted due to poor requirements management; low requirements maturity linked to ~35% longer delivery and only ~54% objective achievement. citeturn12view0 |
| Signal | Key stakeholders can repeat the same problem statement; top assumptions are listed; the “why now” is explicit. | When goals are missed, poor requirements management is the primary cause ~47% of the time; poor communication commonly harms requirements work (reported by ~75% in PMI’s analysis when comms drive failure). citeturn12view2 |
| Pattern | At least one validated user scenario/JTBD exists, with evidence of recurrence; “must-have” outcomes prioritized over feature wish lists. | Feature waste risk: Standish reports ~50% of features are hardly ever or never used (with only ~20% used often). citeturn21view0 |
| Framed | A measurable success signal is defined, and “out of scope” boundaries are explicit; constraints (time/budget/tech/legal) are recorded. | Scope creep is common: PMI reports ~52% of projects experienced scope creep or uncontrolled scope changes (up from 43% five years prior). citeturn15view0 |
| Structured | The MVP is a small, prioritized plan (what’s first, what’s later), with risks called out; work is broken into increments. | Project size matters: Standish reports small projects have >70% chance of success; large projects are ~10× more likely to fail outright and have ~2× the chance of being late/over budget/missing critical features. citeturn21view1 |
| Shaped | The brief is sprint-ready: acceptance criteria exist, unknowns are surfaced, and the team can start without major resets. | Late discovery is expensive: software effort can be ~40–50% avoidable rework; fixing issues after delivery is often ~100× costlier than during requirements/design. Complex systems show requirements error cost escalation up to 21–78× in integration/test and 29× to >1500× in operations. citeturn12view5turn12view6turn14view1 |

### Consequence severity visualization

This is an **estimated** relative severity scale (1–5) intended to help facilitators prioritize earlier stages; it is not a measured index.

```text
Estimated consequence severity if a stage is weak (higher = more compounding waste)

Chaos      █████  (5)
Signal     ████   (4)
Pattern    ████   (4)
Framed     ███    (3)
Structured ███    (3)
Shaped     ██     (2)
```

## Chaos

### Plain-language definition

Chaos means there is **no shared understanding** of the problem, user, or success—so planning is mostly assumptions and opinions.

### Typical symptoms when missing or weak

- Different stakeholders describe different problems (“It’s onboarding” vs “It’s activation” vs “It’s retention”).
- The team jumps straight to solutions (“Add AI”) without agreeing on the underlying pain.
- Discussions end with “We’ll figure it out during the sprint.”
- No decision owner exists; the brief shifts depending on who you ask.

### Quantified consequences

- PMI reports “inaccurate requirements gathering” as a primary cause of project failure (37%) and estimates ~5.1% of spend is wasted due to poor requirements management. citeturn12view0
- PMI cites benchmarking where low requirements maturity correlates with business objectives achieved only ~54% of the time and ~35% longer delivery. citeturn12view0
- IAG reports poor requirements add $2.24M per strategic project on average and correlate with 3 failures per 1 success; it also reports >40% of IT development budget may be consumed by poor requirements for an average company. citeturn16view0
- NASA shows the cost to fix a requirements error can escalate dramatically if discovered late (1× early, 3–8× design, 21–78× integration/test, and 29× to >1500× operations). citeturn12view6

### Recommended minimum acceptance criteria

To consider Chaos complete (ready to move to Signal):

- A one-sentence problem statement exists in plain language.
- A primary user/customer group is named (not “everyone”).
- A decision owner/sponsor is named and agrees to arbitrate tradeoffs.
- At least one piece of evidence exists (even weak): tickets, sales calls, user quotes, workflow observation, or a metric trend.

### Suggested micro-actions in meetings

- Ask for a “one breath” statement: “We are solving ___ for ___ because ___.”
- Ask: “What happens if we don’t build this?”
- Ask: “What would we measure to prove this problem exists?”
- Put the statement on screen; require each stakeholder to say what they’d change.

### Example scenario

A founder says, “We need an AI assistant.” No one can name the user, the scenario, or why now, so the team prototypes broadly and later rebuilds when the real problem (support triage) is discovered.

## Signal

### Plain-language definition

Signal means you have a **written hypothesis** of problem + user + why now, with enough alignment to run targeted discovery.

### Typical symptoms when missing or weak

- Stakeholders “agree in the room” but later reinterpret what was agreed.
- The goal shifts when new people join the thread.
- You see repeated clarification loops (“Can you restate that?”).
- Requirements churn starts early because assumptions were never captured.

### Quantified consequences

- PMI finds that when projects fail to meet original goals, inaccurate requirements management is the primary cause almost half the time (47%). citeturn12view2
- When poor communication is a primary failure cause, PMI reports it disproportionately harms requirements management (reported by ~75% in their analysis). citeturn12view2
- Westfall links poorly defined requirements to requirements churn and reports requirements errors may account for ~70–85% of rework costs on software projects. citeturn14view1
- In a portfolio study (84 IT projects; bancassurance), a 5% monthly requirements growth rate is described as a “critical failure factor” benchmark; the authors also note some successful projects exceed that, implying volatility must be monitored and tolerated intelligently rather than ignored. citeturn14view0

### Recommended minimum acceptance criteria

To consider Signal complete:

- Problem statement + primary user are written and approved by the decision owner.
- “Why now” is explicit (trigger, deadline, compliance, market shift).
- Top assumptions are listed (what must be true for this to matter).
- Stakeholders are identified (who decides, who contributes, who must be consulted).

### Suggested micro-actions in meetings

- Ask each stakeholder to write the problem statement in 10 words; reconcile into one.
- Ask: “What do we believe is true but haven’t verified?”
- Ask: “Who decides tradeoffs if we can’t do everything?”
- Read the hypothesis aloud and get a clear verbal “yes” from the owner.

### Example scenario

A team says they’re solving “activation,” but sales later reframes it as “lead capture.” Writing the hypothesis and naming a decision owner stops drift and turns discovery into a short, focused test of the true activation bottleneck.

## Pattern

### Plain-language definition

Pattern means you understand the **recurring user scenario(s)** well enough to prioritize outcomes over feature guesses.

### Typical symptoms when missing or weak

- The brief is a feature list, not a user scenario and desired outcome.
- Decisions are driven by internal preference instead of observed behavior.
- “Nice-to-have” features slip in without validation (gold plating).
- User segments are too broad (“all users”).

### Quantified consequences

- Standish reports strong evidence of feature waste: ~20% of features are used often, while ~50% are hardly ever or never used, and ~30% are used sometimes or infrequently. citeturn21view0
- McKinsey/Oxford’s dataset of 5,400+ IT projects finds large projects deliver ~56% less value than predicted on average—consistent with weak value patterns and mismatched needs at scale. citeturn12view3
- Westfall notes missing stakeholder groups and incomplete elicitation can create gaps in expected requirements, increasing churn and downstream correction. citeturn14view1

### Recommended minimum acceptance criteria

To consider Pattern complete:

- At least one core user scenario exists as a short narrative (“When X, the user tries Y, but Z happens…”).
- There is evidence the scenario repeats (frequency estimate or multiple corroborations).
- Outcomes are defined (what changes for the user), not just interfaces/features.
- A short list of must-have outcomes exists (max 3).

### Suggested micro-actions in meetings

- Ask: “Tell me about the last time this happened” (forces a concrete story).
- Ask: “How often does this happen in a week?” (even if estimated).
- Ask: “What do users do today instead?” (reveals workarounds and constraints).
- Convert features into outcomes: “What should be faster/easier/safer/cheaper?”

### Example scenario

Stakeholders request “a dashboard.” The team discovers a recurring pattern: managers need two signals daily but must pull data from three systems. The MVP becomes a focused daily summary, not a full dashboard suite.

## Framed

### Plain-language definition

Framed means success and boundaries are explicit: you can say what “good” looks like—and what you will not do.

### Typical symptoms when missing or weak

- Teams can’t agree whether the project worked.
- Scope expands via “quick additions” without offsetting cuts.
- Estimates swing wildly because constraints are unstated.
- Stakeholders treat the backlog as infinite capacity.

### Quantified consequences

- PMI reports 52% of projects experienced scope creep or uncontrolled changes to scope (up from 43% five years prior). citeturn15view0
- McKinsey/Oxford reports large IT projects average 45% over budget and 7% over time, and each additional scheduled year increases cost overruns ~15%. citeturn12view3
- A Harvard Business Review article citing a McKinsey study reports shipping products six months late costs ~33% of after-tax profit on average, compared with ~3.5% profit loss from a 50% development budget overrun—highlighting the outsized cost of delay. citeturn11search1

### Recommended minimum acceptance criteria

To consider Framed complete:

- One success metric is chosen (or a proxy if measurement isn’t available yet).
- Out-of-scope boundaries are written (at least 3 explicit exclusions).
- Constraints are explicit: timebox, budget boundary (even rough), and non-negotiable platform/legal constraints.
- A tradeoff rule exists: what gets cut first if time runs short.

### Suggested micro-actions in meetings

- Ask: “What number would we be proud of in 30 days?”
- Ask: “What are we explicitly not doing in v1?”
- Ask: “If we can only ship one thing, what is it?”
- Run a tradeoff drill: “If we add this, what do we remove?”

### Example scenario

A team wants to “improve onboarding.” By framing success as “reduce time-to-first-success from 5 minutes to 2,” and listing exclusions (referrals, pricing changes), the sprint avoids constant add-ons and ships a measurable first iteration.

## Structured

### Plain-language definition

Structured means the work is broken into a small, testable MVP with clear priorities and known risks—so the team can execute quickly and learn.

### Typical symptoms when missing or weak

- The MVP is still a large wish list (“just one more feature…”).
- Everything is “high priority”; no sequencing exists.
- Risks are discovered mid-build (legal, data access, platform constraints).
- The team designs/builds the “whole system” before shipping any value.

### Quantified consequences

- Standish reports small projects have >70% chance of success; large projects are ~10× more likely to fail outright and have ~2× the chance of being late/over budget/missing critical features. citeturn21view1
- Standish also reports high rates of lateness and cost overruns across their reference periods (e.g., 71–84% “not completed on time”; 46–59% “exceeded initial cost estimates” in selected years). citeturn12view8
- Westfall reports requirements errors can account for ~70–85% of rework costs, linking poor structuring and churn to downstream waste. citeturn14view1

### Recommended minimum acceptance criteria

To consider Structured complete:

- A smallest shippable MVP is defined (one or two workflows, not a platform).
- Priorities are forced: a top 3 exists; everything else explicitly “later.”
- Top risks are listed (max 3) and mitigations chosen.
- Work is sliced into increments that can deliver value within a short timebox.

### Suggested micro-actions in meetings

- Force rank: “If we can only do one thing, what is it?”
- Do “merciless pruning”: cut 50% of features and ask what breaks. citeturn21view0
- Ask: “What’s the fastest way to test whether this matters?”
- Ask: “What risk could kill this—and how do we reduce it in the first increment?”

### Example scenario

A team plans “a new analytics platform.” By structuring the MVP around one repeated decision workflow and shipping a thin slice, they avoid a multi-month build and learn early which insights drive action.

## Shaped

### Plain-language definition

Shaped means the project is **sprint-ready**: requirements are clear enough to start without major resets, and success/constraints are already agreed.

### Typical symptoms when missing or weak

- Stories enter a sprint with missing acceptance criteria.
- Designers and developers repeatedly pause to ask “what do you mean?”
- Mid-sprint changes pile up, causing carryover and rework.
- Post-launch, the team discovers the “real requirement,” triggering rebuilds.

### Quantified consequences

- Boehm & Basili report software projects can spend ~40–50% of effort on avoidable rework; fixing issues after delivery is often ~100× more expensive than fixing during requirements/design. citeturn12view5
- Westfall reports requirements errors can account for ~70–85% of rework costs and notes late-stage requirements defect fixes can exceed 100× cost if discovered after release. citeturn14view1turn14view2
- NASA reports requirements error correction cost factors can rise from 1× early to 3–8× design, 7–16× build, 21–78× integration/test, and 29× to >1500× operations. citeturn12view6
- McKinsey/Oxford reports large IT projects average 45% over budget and 7% over time; 17% of IT projects become black swans that can threaten company existence, with budget overruns >200%. citeturn12view3

### Recommended minimum acceptance criteria

To consider Shaped complete:

- The brief can be exported as one page (Markdown) and read end-to-end without confusion.
- Clear acceptance criteria exist for the MVP (what must be true for “done”).
- Unknowns are explicitly listed, and each has an owner.
- The first increment, measurement plan, and “kill criteria” (if it doesn’t work) are stated.

### Suggested micro-actions in meetings

- Do a 2-minute brief read-through; if someone can’t paraphrase the goal, it’s not shaped.
- Ask: “What is the first increment we can ship, and what do we measure in 7 days?”
- Ask: “What’s the biggest unknown—and who closes it by when?”
- Run a final constraints check: “Any legal/platform/brand constraints we missed?”

### Example scenario

Before sprint start, the team exports a one-page scope brief with success metric, constraints, MVP, and risks. During the sprint, fewer clarifying meetings are needed and fewer mid-sprint changes occur—because unknowns were surfaced up front and assigned owners.