
## Overview

**Clarity Sprint** is a lightweight web tool that helps designers and stakeholders define project scope before a design or development sprint begins.

The tool guides users through a series of structured questions to clarify:

- the problem
    
- the user
    
- the context
    
- the success criteria
    
- the constraints
    
- the MVP scope
    

As users answer questions, a **Clarity Meter** fills to visually indicate how well-defined the project is.

At the end, users can **export a structured Markdown document** that can be used by:

- designers
    
- developers
    
- AI coding tools
    
- AI agents
    

The goal is to create **clear project context before work begins**, reducing wasted effort and improving AI-assisted development workflows.

---

# Problem

Many product teams begin design or development without clearly defining the core problem.

Common issues include:

- Stakeholders cannot clearly articulate the problem
    
- Teams jump straight into UI design
    
- AI tools generate solutions for poorly defined problems
    
- Scope constantly changes during the sprint
    
- Designers are expected to "figure it out later"
    

This leads to:

- wasted design effort
    
- engineering rework
    
- poor product outcomes
    

Clarity Sprint ensures that **essential questions are answered before work begins**.

---

# Target Users

Primary users:

- Product designers
    
- Startup founders
    
- Product managers
    
- Developers working in small teams
    

Typical context:

- Early-stage startups
    
- AI product teams
    
- small design/dev teams
    
- discovery or sprint planning meetings
    

Secondary use case:

Designers can **fill out the tool live during stakeholder meetings**.

---

# Goals

### Primary Goal

Create a simple tool that helps teams define project scope clearly before starting a sprint.

### Secondary Goals

- Create structured context for AI tools
    
- Improve design sprint alignment
    
- Reduce ambiguous project briefs
    
- Allow fast documentation export
    

---

# Non Goals

Clarity Sprint is **not**:

- a project management tool
    
- a roadmap planner
    
- a task tracker
    
- a complex requirements system
    

The tool focuses only on **problem clarity before execution**.

---

# Core Concept

The product asks a sequence of structured questions.

Each answer increases a **Clarity Meter**.

Once all questions are answered, the project reaches **"Shaped" status**, meaning the project is ready for a sprint.

---

# Clarity Meter

The meter visually represents how defined the project is.

Stages:

|Progress|Status|
|---|---|
|0%|Chaos|
|20%|Signal|
|40%|Pattern|
|60%|Framed|
|80%|Structured|
|100%|Shaped|

This reinforces the narrative:

**From chaos → clarity.**

---

# Question Flow

The app presents **one question per page**.

Users answer and proceed to the next step.

### Question 1 – Problem

What problem are we solving?

Example:  
Users struggle to prioritize feedback across multiple design tools.

---

### Question 2 – User

Who is experiencing this problem?

Example:  
Startup product designers working with developers.

---

### Question 3 – Why Now

Why does this problem matter now?

Example:  
AI tools accelerate development but create workflow chaos.

---

### Question 4 – Success

What does success look like?

Example:  
Designers can prioritize feedback in under 5 minutes.

---

### Question 5 – Constraints

What constraints should we consider?

Example:  
Must integrate with Figma and Slack.

---

### Question 6 – MVP

What is the smallest version we could build?

Example:  
A simple Figma plugin that groups comments by priority.

---

### Question 7 – Risk

What could make this project fail?

Example:  
Users may prefer existing tools.

---

### Question 8 – No Build Scenario

What would happen if we didn’t build this?

Example:  
Design teams continue wasting time triaging feedback.

---

# Output

After completing all questions, users can export a **structured Markdown file**.

Example output:

```markdown
# Project Scope

## Problem
Users struggle to prioritize feedback across design tools.

## User
Startup designers collaborating with developers.

## Why Now
AI tools increase development speed but create workflow chaos.

## Success
Designers can triage feedback in under 5 minutes.

## Constraints
Must integrate with Figma.

## MVP
Figma plugin that groups comments by priority.

## Risks
Users may prefer existing tools.

## If Not Built
Teams continue wasting time managing feedback.
```

This output is optimized for:

- AI coding assistants
    
- developer handoffs
    
- documentation
    
- design briefs
    

---

# Core Features (MVP)

### 1 Question-per-page Flow

Each question appears on a dedicated screen.

Purpose:

- reduce cognitive overload
    
- encourage thoughtful answers
    

---

### 2 Clarity Meter

Visual indicator showing scope maturity.

Updates dynamically as questions are answered.

---

### 3 Status Badge

Displays the current clarity stage:

Example:

```
Clarity Status: Pattern
```

---

### 4 Markdown Export

Users can export the final scope as:

- Copy to clipboard
    
- Download `.md` file
    

---

### 5 Local Storage

User progress is saved locally in the browser.

No login required.

---

# UX Principles

### Fast

The entire process should take **5–10 minutes**.

### Focused

No distractions or complex UI.