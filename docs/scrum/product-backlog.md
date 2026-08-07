# Product Backlog

## Product Goal
Yolcu rezervasyon, operatör yönetimi, sürücü/karşılamacı onboarding, ücretlendirme ve takip akışlarını tek bir profesyonel operasyon platformu üzerinden yönetmek.

## Prioritization Framework
- Value: İşin müşteri ve işletme değeri
- Urgency: Zaman baskısı / rekabet / operasyonel risk
- Dependency: Diğer özelliklere bağlılık
- Effort: Gerçekleme zorlanması
- Risk: Teknik veya operasyonel risk

## Backlog Item Format
- ID: PB-XXX
- Title
- User Story
- Why / Value
- Priority (Must / Should / Could)
- Estimate (S / M / L / XL)
- Dependencies
- Acceptance Criteria

## Proposed Product Backlog

### EPIC 1 — Reservation & Guest Experience
- PB-001: Guest booking flow improvements
  - User Story: As a guest, I want to book a transfer easily so that I can complete my trip planning quickly.
  - Value: Higher conversion and fewer abandoned bookings.
  - Priority: Must
  - Estimate: M
  - Acceptance Criteria:
    - Booking form validates required fields.
    - Confirmation is shown after successful booking.
    - Booking code is displayed to the guest.

- PB-002: Booking status tracking for guests
  - User Story: As a guest, I want to track my booking status so that I know what is happening in real time.
  - Value: Transparency and reduced support load.
  - Priority: Must
  - Estimate: M
  - Acceptance Criteria:
    - Guest can access tracking page via booking code.
    - Booking progress is visible in a clear status view.
    - Updates are reflected without manual refresh where supported.

### EPIC 2 — Operations & Dispatch
- PB-003: Admin booking assignment workflow
  - User Story: As an admin, I want to assign bookings to drivers and greeters so that operations stay organized.
  - Value: Faster and more reliable dispatching.
  - Priority: Must
  - Estimate: M
  - Acceptance Criteria:
    - Admin can view pending bookings.
    - Admin can assign driver and greeter.
    - Assignment is reflected in booking state.

- PB-004: Driver and greeter status visibility
  - User Story: As an operator, I want to see active staff availability so that I can dispatch work efficiently.
  - Value: Better operational efficiency.
  - Priority: Should
  - Estimate: S
  - Acceptance Criteria:
    - Active/inactive status is visible.
    - Staff can update availability.
    - Dispatch view reflects current availability.

### EPIC 3 — Pricing & Payouts
- PB-005: Pricing rule management improvements
  - User Story: As an admin, I want to manage pricing rules easily so that pricing stays accurate and up to date.
  - Value: Reduced manual pricing errors.
  - Priority: Must
  - Estimate: M
  - Acceptance Criteria:
    - Admin can create/edit pricing rules.
    - Rules are reflected in booking calculations.
    - Invalid data is rejected with clear validation.

- PB-006: Payout reporting and review
  - User Story: As an admin, I want payout data to be reviewable so that finance oversight is easier.
  - Value: Trust and finance control.
  - Priority: Should
  - Estimate: M
  - Acceptance Criteria:
    - Payout summary is visible.
    - Driver and greeter fee breakdown is displayed.
    - Export or report view is available.

### EPIC 4 — Onboarding & Compliance
- PB-007: Driver onboarding workflow
  - User Story: As a driver, I want to submit my profile and documents so that I can join the platform.
  - Value: Faster onboarding and better data quality.
  - Priority: Must
  - Estimate: M
  - Acceptance Criteria:
    - Driver can submit application form.
    - Required documents are collected.
    - Admin can approve or reject the application.

- PB-008: Greeter onboarding workflow
  - User Story: As a greeter, I want to submit my profile and documents so that I can join the platform.
  - Value: Faster activation of operational staff.
  - Priority: Must
  - Estimate: M
  - Acceptance Criteria:
    - Greeter can submit application form.
    - Required information is stored.
    - Admin can approve or reject the application.

### EPIC 5 — Communication & Reliability
- PB-009: WhatsApp / notification delivery reliability
  - User Story: As an operator, I want notifications to be delivered reliably so that operations are not disrupted.
  - Value: Reduced operational delays.
  - Priority: Must
  - Estimate: M
  - Acceptance Criteria:
    - Message sending is retried or queued safely.
    - Failures are logged clearly.
    - Operators can identify failed delivery attempts.

- PB-010: Health monitoring for worker service
  - User Story: As an operator, I want the worker system to be monitored so that issues are discovered early.
  - Value: Better stability and supportability.
  - Priority: Should
  - Estimate: S
  - Acceptance Criteria:
    - Worker exposes health endpoint.
    - Health status is understandable.
    - Alerting path is documented.

## Suggested Backlog Maintenance Rules
- Review backlog every sprint.
- Split large items into smaller stories when needed.
- Re-prioritize based on business impact and delivery risk.
- Keep acceptance criteria measurable and testable.
