# Glamer Onboarding Wizard

A 3-step React + TypeScript wizard that collects, validates, and summarises
information for a new team member. Built with Vite, plain CSS, and zero UI
libraries — kept intentionally small so every line is easy to read and
explain.

## How to run

```bash
npm install
npm run dev
```

Then open the URL printed by Vite (defaults to <http://localhost:5173>).

Other useful commands:

- `npm run build` — type-check (`tsc -b`) and produce a production bundle.
- `npm run preview` — serve the built bundle locally.
- `npm run lint` — run ESLint over the project.

## Project structure

```
src/
  App.tsx                       # Page shell + heading
  main.tsx                      # React entry
  index.css / App.css           # Design tokens + component styles
  types.ts                      # Domain types (PersonalInfo, SkillsAvatar, ...)
  validation.ts                 # Pure validation functions + constants
  data/options.ts               # Roles, departments, role → skills map
  components/
    Wizard.tsx                  # State, navigation, step orchestration
    Stepper.tsx                 # Accessible progress indicator
    ui/Field.tsx                # Reusable label + error wiring
    steps/
      Step1PersonalInfo.tsx     # Step 1 form
      Step2SkillsAvatar.tsx     # Step 2 — avatar upload + skill chips
      Step3Review.tsx           # Step 3 — summary + edit/submit
      Success.tsx               # Terminal success screen
```

### State model

All wizard state lives in a single component (`Wizard.tsx`):

- `personal: PersonalInfo` — Step 1 fields
- `skillsAvatar: SkillsAvatar` — Step 2 fields (`avatar: { file, previewUrl } | null`, `skills: string[]`)
- `step: 1 | 2 | 3` — current step
- `highestCompleted: number` — latest step the user has successfully validated
- `submitted: boolean` — once `true`, only the success screen renders

Children are dumb: each step receives `value`, `onChange`, and navigation
callbacks. This makes navigation trivial — going back never resets data, it
just changes which step renders.

### Important rules implemented

- **Per-step validation**: each step validates only its own fields and shows
  inline error messages (no `alert()`). The Next button always submits the
  form so the user can press Enter from any field.
- **Email validation** uses a simple but practical regex.
- **Avatar validation order**: file type/extension is checked first, then
  size, then the preview URL is created via `URL.createObjectURL`. Invalid
  files never produce a preview, and rejected uploads clear the file input
  so the user can immediately re-upload the same name.
- **Object URLs are revoked** when the avatar is replaced/removed and on
  unmount, to avoid leaks.
- **Role change clears skills only**: this is enforced inside `Wizard.updatePersonal`,
  not in Step 1, so the rule lives in one place near the state it touches.
  Avatar and other Step 2 state are preserved.
- **Back navigation**: always available except on the success screen, which
  is terminal.
- **Success is terminal**: once submitted, the wizard renders only `Success`
  and no longer mounts the stepper or step forms — the user cannot navigate
  back into the form.

### Accessibility

- Every input has a real `<label>` (via the `Field` wrapper) and errors are
  linked through `aria-describedby` + `aria-invalid`.
- Skill chips are real buttons with `role="switch"` and `aria-checked` so
  screen readers announce toggle state.
- The stepper is wrapped in `<nav aria-label="Onboarding progress">`, uses
  an ordered list, and marks the active step with `aria-current="step"`.
- Errors render as `role="alert"`; the live skill counter uses
  `aria-live="polite"`.
- Focus rings are preserved (`:focus-visible`) and the entire wizard is
  keyboard operable — Enter submits each step, Tab moves through chips.

## Trade-offs (what I simplified due to time)

- **No router.** Wizard state is in-memory only; refreshing the page
  resets it. A real implementation would either persist to `sessionStorage`
  or push step IDs into the URL so deep links work.
- **No animation between steps.** Easy win to add later (e.g. small fade
  via CSS transitions) but not part of the brief.
- **No unit tests.** The validation module is pure and easy to test — see
  the “What I’d do next” section below.
- **One CSS file (`App.css`).** With more time I’d split per-component CSS
  modules, but at this size a single sheet is faster to read end-to-end.
- **No avatar cropping/zoom.** The brief only requires a circular preview.

## What I’d do next

1. **Tests** — add Vitest + React Testing Library:
   - Pure tests for `validatePersonal`, `validateAvatarFile`, `validateSkillsAvatar`.
   - Component tests for: cannot advance with invalid fields, role change
     clears skills but preserves avatar, success is terminal, file rejection
     never shows preview.
2. **Persist state** to `sessionStorage` so accidental refreshes don’t lose
   progress (excluding the `File` object — store metadata + re-prompt for
   the avatar).
3. **Real avatar upload** on Submit (see “If You Finish Early” below).
4. **Form library** — for a larger wizard I’d swap to React Hook Form +
   Zod to centralise schemas and reduce boilerplate.
5. **Mobile polish** — the current layout already collapses to one column,
   but I’d also make the stepper a compact “Step 2 of 3” pill on small
   screens.

## Answers to the “If You Finish Early” questions

- **Testing.** Highest-risk flows are: (1) role change clears skills only;
  (2) file validation order — invalid files must not show a preview; (3)
  the success screen being truly terminal; (4) the email regex on
  edge-case inputs. I’d cover validation with pure unit tests and the
  flows above with RTL.
- **Scalability to 10+ steps with branching.** I would lift the step
  configuration into a single declarative array (`{ id, component,
  validate, isApplicable(state) }`) and let the wizard derive `nextStep`
  from `isApplicable`. Validation would move to per-step Zod schemas so
  branching logic is data, not code. State would still live in one place
  to keep the “go back, nothing is lost” guarantee easy to reason about.
- **Real upload — when?** I’d upload **on final submit**, not on step
  change. Uploading on step 2 would orphan files whenever a user abandons
  the wizard or decides to replace the image, and it makes “Back” feel
  slow. Uploading on submit lets us post the avatar + the rest of the
  payload as one transaction (or use a presigned URL flow if files are
  large), and it’s easy to retry.
- **Mobile, first thing I’d change.** Make the stepper a compact
  “Step 2 of 3 · Skills & Avatar” summary, give the skill chips larger
  hit targets, make the primary action a sticky full-width button at the
  bottom of the viewport, and switch the avatar preview + controls to
  stack vertically.

## Resources used

- The brief screenshots provided in the task.
- React 19 / Vite 8 docs for project scaffolding defaults.
- General accessibility references for the patterns used (toggle buttons
  with `role="switch"`, `aria-current="step"`, `aria-describedby` for
  errors).

No AI chat transcripts to link — code was written in this editor with
small targeted prompts to the assistant for boilerplate (types, CSS
tokens). Every line was reviewed and is something I can explain.
