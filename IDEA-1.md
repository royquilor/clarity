# Clarity Sprint – Design Iteration v2
## From Questionnaire → Clarity System

This iteration evolves Clarity Sprint from a simple questionnaire into a **clarity system for product discovery**.

The goal is not only to collect answers, but to:

- visualize project clarity
- guide stakeholders through problem definition
- generate structured context for AI tools
- create a shareable clarity report

---

# Core Design Principle

Before building anything, teams should answer one question:

> Do we actually understand the problem?

Clarity Sprint helps teams move from:

Chaos → Signal → Pattern → Framed → Structured → Shaped

This progression is visualized through the **Clarity Meter**.

---

# User Flow

The experience is intentionally simple.

Landing
↓
Start Clarity Sprint
↓
Question Flow (1 question per screen)
↓
Clarity Meter updates dynamically
↓
Clarity Scorecard generated
↓
Export options

---

# Question Flow UX

Each question appears on a dedicated screen.

This reduces cognitive overload and encourages thoughtful answers.

Example flow:

### Question 1
What problem are we solving?

### Question 2
Who is experiencing this problem?

### Question 3
Why does this problem matter now?

### Question 4
What does success look like?

### Question 5
What constraints do we have?

### Question 6
What is the smallest version we could build?

### Question 7
What risks could make this project fail?

### Question 8
What would happen if we didn’t build this?

---

# Clarity Meter

The Clarity Meter visualizes how well the project is defined.

As users answer questions, the meter fills.

Example:
Clarity: 65%
Status: Framed

Clarity stages:

| Progress | Stage |
|--------|--------|
| 0% | Chaos |
| 20% | Signal |
| 40% | Pattern |
| 60% | Framed |
| 80% | Structured |
| 100% | Shaped |

Narrative:

Projects move from **chaos to clarity**.

---

# Status Badge

Each stage is represented by a badge.

Example:

Status: Pattern

This gives stakeholders a quick understanding of project readiness.

---

# Clarity Scorecard (New Feature)

At the end of the questionnaire, the system generates a **Clarity Scorecard**.

The scorecard summarizes the project clarity.

Example:

CLARITY SPRINT REPORT

Clarity Score: 82%

Status: STRUCTURED

Problem ✓
User ✓
Why Now ✓
Success ✓
Constraints ✓
MVP ✓
Risks ⚠

Ready for Sprint: Almost

---

# Purpose of the Scorecard

The scorecard has two goals:

### Internal

Helps teams understand if they are ready to begin a sprint.

### External

Creates a **shareable artifact**.

Users can screenshot or export the scorecard to share on:

- X
- LinkedIn
- team documentation

This introduces a **viral loop**.

Example social post:

> We ran our project through Clarity Sprint.  
> Turns out we only had 62% clarity before starting development.

---

# Export Options

After completion users can export:

### Markdown

Structured documentation ready for:

- AI tools
- developers
- project documentation

Example:

Project Scope
Problem

Users struggle to prioritize design feedback.

User

Startup designers collaborating with developers.

Why Now

AI tools accelerate development but increase workflow chaos.

Success

Designers can prioritize feedback in under 5 minutes.

Constraints

Must integrate with Figma.

MVP

A simple plugin that groups comments by priority.

### Image Export

Export the **Clarity Scorecard** as an image.

This supports:

- sharing
- documentation
- presentations

---

# AI Context Generation

The exported markdown is optimized for AI tools.

Examples:

- Cursor
- Claude
- AI agents
- developer assistants

This allows teams to move directly from **problem clarity → product building**.

---

# UX Principles

### Focus

One question per page.

### Momentum

Clarity meter provides progress feedback.

### Simplicity

No login required.

### Speed

Entire flow should take **under 10 minutes**.

---

# Narrative Fit

Clarity Sprint is an experiment within the Enter404 ecosystem.

Enter404 explores how designers navigate the AI era.

Clarity Sprint demonstrates one key insight:

> AI works best when the problem is clearly defined.

This tool helps teams move from:
Chaos → Clarity → Creation