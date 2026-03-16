# Feature Request: AI Model Selection (Upgrade Validation)

## Overview

Introduce an AI model selector within the Clarity interface that allows users to view and attempt to select different AI models (Haiku, Sonnet, Opus).

The goal of this feature is **not immediate monetization**, but **product validation**. We want to measure whether users are interested in upgrading to more powerful AI models.

When a user selects a locked model, they will be prompted with an upgrade dialog requesting their email for early access.

This allows us to:

- Validate demand for premium AI models
- Capture early adopter emails
- Track upgrade interest via analytics
- Avoid building payments infrastructure too early

---

# Primary Goal

Validate whether users are interested in paying for access to more powerful AI models.

---

# Default Model

Haiku 4.5

Reason:

- Fastest
- Cheapest
- Good enough for MVP
- Keeps operating costs low

---

# UI Placement

Position: **Top-right of the interface**

Rationale:

- Model selection represents a **global AI environment setting**
- Bottom-right is reserved for **task actions** such as Analyze, Next, Previous
- Aligns with UI patterns used in Claude, ChatGPT, and Cursor

Example layout:

---

# Component

Use the **shadcn/ui DropdownMenu component**

This gives us:

- a lightweight UI
- flexible content
- ability to show locked states
- easy interaction control

---

# Example Implementation

```tsx
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Button } from "@/components/ui/button"

export function ModelSelector() {

  const currentModel = "Haiku 4.5"

  return (
    <DropdownMenu>

      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          {currentModel}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">

        <DropdownMenuItem>
          Haiku 4.5
          <span className="ml-2 text-xs text-muted-foreground">
            Fastest
          </span>
        </DropdownMenuItem>

        <DropdownMenuItem>
          Sonnet 4.6 🔒
        </DropdownMenuItem>

        <DropdownMenuItem>
          Opus 4.6 🔒
        </DropdownMenuItem>

      </DropdownMenuContent>

    </DropdownMenu>
  )
}

## Upgrade Interaction

If a user selects a locked model, the model should not change.

Instead:

Open Upgrade Dialog

## Modal Content

Title:

Upgrade to Pro

Description:

Clarity currently runs on Claude Haiku.

We're testing support for more powerful models like Sonnet and Opus for deeper analysis.

Pro plan (coming soon).

Enter your email if you'd like early access.

Inputs:

Email field

Notify Me button

## Analytics Events

Track using Vercel Analytics

### Model selector opened
model_selector_opened

### Locked model selected
model_upgrade_click
model: sonnet

or
model_upgrade_click
model: opus

### Email submitted
model_upgrade_email_submit
model: sonnet

## Success Metrics
We want to measure the following signals:
| Metric              | Meaning                  |
| ------------------- | ------------------------ |
| Dropdown opens      | Users notice the feature |
| Locked model clicks | Users want better models |
| Email submissions   | Strong upgrade demand    |
