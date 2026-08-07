# Agent instructions for this repository

## Project context
- This repository is a Next.js 16 + TypeScript application for the Eurosian VIP Transfer platform.
- The app uses Prisma, NextAuth-style role-based auth, and a worker-based queue for WhatsApp/translation jobs.
- Primary user flows include admin operations, driver onboarding, greeter onboarding, booking, and tracking.

## Working conventions
- Prefer small, focused changes that match the existing architecture.
- Keep UI text and validation messages consistent with the current Turkish-first product language where appropriate.
- Reuse existing helpers and libraries under src/lib before introducing new abstractions.
- If a change affects data shape, update the Prisma schema and expected migrations carefully.
- Preserve existing route and auth patterns unless the task explicitly requires a change.

## Preferred implementation approach
- Favor clear TypeScript types and existing project conventions over clever shortcuts.
- When fixing a bug, identify the root cause first and keep the fix minimal.
- For new features, prefer implementing them through the current domain modules and components rather than creating parallel patterns.

## Verification
Before claiming success, run the relevant checks:
- `npm run test:smoke`
- `npx tsc --noEmit --noResolve`
- `npm run lint`

If dependencies are not installed locally, note that limitation explicitly rather than pretending the checks ran successfully.

## Important repository-specific reminders
- The worker process is separate from the Next.js app; changes affecting queue/worker behavior may require validating the worker path as well.
- Payment and messaging integrations should be handled carefully and only with the existing provider abstraction layers.
- Do not reset or overwrite existing user data during seed or setup tasks unless the task explicitly calls for it.
