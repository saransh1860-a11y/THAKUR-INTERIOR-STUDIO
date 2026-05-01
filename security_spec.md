# Security Specification

## Data Invariants
- A `consultation` must have a valid name, phone, service, and status.
- `createdAt` must be set using `request.time`.
- Only authorized admins can read or update `consultations`.
- Only authorized admins can read `messages`.
- `admins` collection is strictly read-only for the admin themselves (to check status) and locked for everyone else.

## The Dirty Dozen Payloads (Target: Deny)
1. **Unauthorized Read**: `get('/consultations/someId')` by unauthenticated user.
2. **Unauthorized Status Update**: `update('/consultations/someId', {status: 'completed'})` by malicious user.
3. **Identity Spoofing**: `create('/consultations/newId', {name: 'Attacker', ownerId: 'victimUid'})`.
4. **Timestamp Bypass**: `create('/consultations/newId', {createdAt: timestamp('2030-01-01T00:00:00Z')})`.
5. **Ghost Field Injection**: `create('/consultations/newId', {name: 'Test', isVerified: true})`.
6. **Unauthorized Deletion**: `delete('/consultations/someId')` by non-admin.
7. **Admin Collection Probe**: `get('/admins/maliciousUid')`.
8. **Self-Promotion**: `create('/admins/maliciousUid', {authorized: true})`.
9. **ID Poisoning**: Attempting to write to `/consultations/` + ('a' * 2000).
10. **Enum Violation**: `update('/consultations/someId', {status: 'invalid_status'})`.
11. **Resource Exhaustion**: `create('/messages/newId', {message: 'a' * 1000000})` (1MB message).
12. **Query Scraping**: `list('/consultations')` by unauthenticated user.

## Verification
Rules must be tested against these payloads using the Firestore emulator or equivalent logic.
