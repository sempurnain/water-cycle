# Security Specification — WATER CYCLE

## 1. Data Invariants
1. **Teacher Ownership Invariant**: Every `classes`, `students`, `sessions`, `session_participants`, `attempts`, `progress`, `achievements`, and `questions` document MUST carry `teacherId == request.auth.uid` and require `request.auth.token.email_verified == true`.
2. **PII Isolation Invariant**: Teacher `email` is stored exclusively inside `/teachers/{teacherId}` and readable only by `request.auth.uid == teacherId`. Student records store only `nickname` and `studentNumber`—never student email, phone, or home address.
3. **Immutable Ownership & Temporal Integrity**: `teacherId` and `createdAt` cannot be modified after creation (`createdAt == request.time` on create; `updatedAt == request.time` on update).
4. **Terminal State Locking**: Once a `ClassroomSession` reaches `status == 'completed'`, no further updates are permitted.
5. **Relational Integrity**: On create, `students.classId` must reference an existing `/classes/{classId}` document owned by the same teacher (`teacherId`), and `session_participants.sessionId` must reference an existing `/sessions/{sessionId}` document owned by the same teacher.
6. **Strict Payload Boundaries**: Every collection enforces `keys().hasAll(...) && keys().hasOnly(...)` and bounded string/array sizes to prevent shadow fields and payload bloat.

## 2. Dirty Dozen Adversarial Payloads (Expected: PERMISSION_DENIED)
1. **Shadow Field Injection on Class Create**: `{ teacherId, name: "5A", grade: "5", academicYear: "2026", studentCount: 0, createdAt: serverTimestamp, updatedAt: serverTimestamp, isAdmin: true }`
2. **Identity Spoofing on Student Create**: Authenticated as Teacher B, sending `teacherId: TeacherA_UID` on `/students/{id}`.
3. **Unverified Email Write**: Authenticated user with `email_verified: false` attempting to create `/classes/{id}`.
4. **PII Cross-Read on Teacher Profile**: Teacher B calling `get` on `/teachers/{TeacherA_UID}`.
5. **Blanket List Scraping**: Any user listing `/classes` without `where('teacherId', '==', uid)`.
6. **Document ID Poisoning**: Creating `/classes/bad$id..with/../../junk` or >128 char ID.
7. **Orphan Student Creation**: Creating a student with a non-existent `classId` or a `classId` owned by another teacher.
8. **Immutable Field Mutation**: Updating `teacherId` or `createdAt` on an existing `/classes/{id}`.
9. **Client Timestamp Forgery**: Sending a hardcoded past timestamp instead of `request.time` for `createdAt`.
10. **Terminal Session Mutation**: Updating `currentStep` on a `/sessions/{id}` whose `status` is already `'completed'`.
11. **Oversized String Bloating**: Submitting a 2,000-char string into `nickname` or `prompt`.
12. **Type Poisoning on Session Mode**: Submitting `mode: "hacked"` or `options: ["a", "b", ...20 items]` outside allowed enum/array bounds.
