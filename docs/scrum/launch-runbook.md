# Launch Runbook

## Purpose
This runbook is for the short live-readiness sprint and provides the operational steps needed for a controlled launch on Monday.

## Before Launch
- Confirm the scope of the sprint is limited to P0 fixes
- Verify the implementation is reviewed and tested
- Confirm monitoring and health checks are enabled
- Prepare rollback instructions and escalation contacts

## Launch Checklist
- [ ] Code is deployed successfully
- [ ] Booking flow smoke test passes
- [ ] Authentication flow smoke test passes
- [ ] Worker/queue health endpoint is healthy
- [ ] Alerts and logs are visible
- [ ] Rollback path is known
- [ ] Support channel is active

## Smoke Test Steps
1. Create a booking request with a valid payload
2. Verify the response is successful or returns a clear error
3. Retry the same request to confirm safe duplicate handling
4. Log in as an admin/driver/greeter user and verify access behavior
5. Check worker health endpoint and confirm status
6. Review logs for any startup or queue issues

## Rollback Plan
- Revert to the previous stable deployment if critical errors appear
- Disable any newly introduced risky feature flag if applicable
- Inform support and stakeholders immediately
- Capture the issue details and owner for follow-up

## Incident Handling
- If booking failures spike, pause further rollout and investigate the API response path
- If auth failures appear, verify session handling and role validation logic
- If worker health degrades, inspect queue connectivity and startup logs

## Post-Launch Review
- Review the first-hour monitoring results
- Capture any new issues or workaround actions
- Document follow-up items for the next sprint
