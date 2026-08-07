# Admin UX Spec — Prioritized Implementation

Overview
- Source: analyst + tester audits. Objective: deliver an accessible, testable admin UI focused on reliability and core workflows.

Priorities (first sprint)
1. Admin sidebar: navigation, current-item affordance, compact/collapsed state.
2. Topbar: global actions, notifications, user menu, responsive layout.
3. Design tokens: add admin tokens in `src/app/globals.css` (done) and use them across components.
4. Core dashboard: KPI cards, bookings quick list, worker health widget.
5. Forms & tables: CRUD patterns with strong accessibility and server-side validation.

Acceptance criteria
- Core pages (overview, content, media, users, settings) load without JS errors.
- Admin login/session flows are preserved; seed admin user can authenticate.
- Smoke tests for admin journeys pass locally.

Next steps
- Implement `AdminSidebar` and `AdminTopbar` components (present in `src/components/admin/`).
- Add small unit tests for new components and integration tests for admin pages.
- Iterate visual polish and introduce Playwright e2e for sign-in and booking management.

Notes
- Keep copy Turkish-first when adding UI text.
- Revoke exposed tokens before deploying.
