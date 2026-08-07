# Short Sprint Action Plan — Live Monday

## Sprint Summary
- Sprint Name: Live Monday Stabilization Sprint
- Duration: 3 working days + launch day
- Target Live Date: Monday, 2026-08-10
- Goal: Reduce the highest operational risks before the live release by fixing booking reliability, auth/session stability, and worker health issues.
- Scope: P0 issues only. No large refactors or new features.

## In Scope
1. Booking flow resilience and idempotency
2. Authentication and role/session hardening
3. Worker and queue health visibility
4. Basic release readiness and rollback preparation

## Out of Scope
- Broad UI redesign
- New business features
- Large architectural refactor
- Non-critical quality improvements

## Workstreams and Owners

### 1) Booking Reliability
- Owner: Senior Fullstack Developer
- Focus: Improve error handling, safe retries, and clearer error responses in the booking API flow.
- Relevant area: [src/app/api/bookings/route.ts](../../src/app/api/bookings/route.ts)
- Deliverables:
  - Duplicate submission is handled safely
  - Clear failure messages are returned for pricing/provider issues
  - Support and QA can reproduce the flow easily

### 2) Authentication and Session Stability
- Owner: Senior Fullstack Developer
- Focus: Harden role checks and invalid-session handling for admin, driver, and greeter users.
- Relevant area: [src/lib/auth/config.ts](../../src/lib/auth/config.ts)
- Deliverables:
  - Invalid or mismatched sessions are handled predictably
  - Inactive user paths are clear and safe
  - Role access behavior is tested

### 3) Worker and Queue Health
- Owner: Senior Fullstack Developer
- Focus: Improve health checks, logging, and failure visibility.
- Relevant area: [src/lib/queue/worker-entry.ts](../../src/lib/queue/worker-entry.ts)
- Deliverables:
  - Health endpoint reflects degraded state correctly
  - Worker startup failures are visible in logs
  - Basic recovery guidance is documented

### 4) QA and Release Readiness
- Owner: QA / Test Engineer + PM
- Deliverables:
  - Regression checklist completed
  - Smoke test evidence captured
  - Rollback and support notes prepared

## Day-by-Day Execution Plan

### Friday — 2026-08-07
- Finalize sprint scope and P0 priorities
- Start implementation for booking and auth fixes
- Prepare QA test cases for the main flows
- Create a short branch and keep changes focused

### Saturday — 2026-08-08
- Complete booking and auth hardening work
- Add or update regression checks where feasible
- Start worker health/logging improvements

### Sunday — 2026-08-09
- Finish worker monitoring changes
- Run smoke tests and regression checks
- Prepare release notes, rollback guidance, and support notes
- Freeze the scope by end of day

### Monday — 2026-08-10
- Deploy to production or staging as planned
- Monitor errors, health endpoints, and booking/auth flows closely
- Validate the launch with a short smoke test
- Keep a live incident channel open for the first hours

## Daily Standup Questions
- What was completed yesterday?
- What will be done today?
- What is blocking the work?
- Are there any live-risk items or dependencies?

## Definition of Done
- All P0 work is implemented or explicitly deferred with mitigation
- Smoke tests pass for booking, auth, and worker health paths
- QA evidence exists for the main scenarios
- Rollback and support notes are ready
- The team is prepared for Monday launch

## Launch Checklist
- Code reviewed
- Smoke tests completed
- Monitoring enabled
- Rollback path documented
- Support team informed
- Owner assigned for first-hour monitoring
