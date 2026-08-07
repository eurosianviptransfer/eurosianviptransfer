# Bug Fix Priority Plan

## Primary Goal
Fix the most critical stability issues first, with a focus on booking reliability, authentication/session safety, and worker health visibility.

## Priority Order

### P0 - Must Fix First
1. Booking flow failures and inconsistent retry behavior
2. Authentication/session role handling issues
3. Worker and queue health visibility gaps

### P1 - Important but Secondary
4. Notification reliability and error visibility
5. Release readiness and support documentation

## Immediate Execution Order

### 1) Booking Bug Fix
- Target area: src/app/api/bookings/route.ts
- Focus:
  - handle duplicate submissions safely
  - return clear messages for pricing/provider failures
  - improve retry behavior and idempotency handling
- Expected outcome:
  - fewer broken or duplicated bookings
  - clearer error paths for support and QA

### 2) Auth / Session Bug Fix
- Target area: src/lib/auth/config.ts
- Focus:
  - enforce auth/session consistency
  - handle invalid role or session mismatch safely
  - avoid inconsistent access behavior for admin/driver/greeter users
- Expected outcome:
  - safer login and session handling
  - fewer access issues during live use

### 3) Worker Health Bug Fix
- Target area: src/lib/queue/worker-entry.ts
- Focus:
  - make health endpoint more reliable
  - improve visibility of startup or queue issues
  - ensure degraded state is reported clearly
- Expected outcome:
  - faster incident detection
  - better operational awareness

## Suggested Work Sequence
- Day 1: implement booking fixes and prepare QA cases
- Day 2: implement auth/session fixes and verify behavior
- Day 3: complete worker health visibility and run smoke tests

## Definition of Done for Bug Fix Sprint
- P0 issues are resolved or explicitly deferred with mitigation
- smoke tests are completed for booking, auth, and worker health
- QA evidence exists for the main scenarios
- rollback/support notes are prepared
