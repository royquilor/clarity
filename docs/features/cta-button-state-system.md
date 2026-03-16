You are helping implement a CTA button state system for a React / Next.js app.

Context:
This app has a primary action button in the bottom-right of the screen. The button currently triggers an AI analysis process. The interface is minimal and typography-focused, so the button should stay visually simple.

There is already a Spinner component available that can be used during loading.

Goal:
Implement a three-state CTA button system:

1. Idle state
2. Processing state
3. Completed state

Requirements:

1. Default (idle) state
   The button displays text only.

Example:
Analyze

2. Processing state
   When the user clicks the button:

* The button becomes disabled
* The Spinner component appears on the left
* The label changes to "Analyzing…"

Example:
[Spinner] Analyzing…

3. Completed state
   Once the analysis finishes:

* Spinner disappears
* Button label changes to "Next"

Example:
Next

4. Important UI rules

* The button width should remain stable between states (avoid layout shift)
* Spinner should appear to the left of the label with a small gap
* Button remains in the same fixed bottom-right position
* The button should be disabled while processing

5. Example interaction flow

Idle:
Analyze

User clicks:
Spinner + "Analyzing…" (button disabled)

When process finishes:
Next

6. Implementation details

* Use React state to manage the button state
* States could be: "idle", "loading", "done"
* The Spinner component is already available and should be reused
* Use flex layout inside the button to align spinner and text

Example visual structure inside the button:

<button>
  <Spinner />
  <span>Analyzing…</span>
</button>

7. Output
   Provide a clean React component implementation showing:

* the button state logic
* the button UI
* how the spinner is conditionally rendered
* how the click handler transitions states
