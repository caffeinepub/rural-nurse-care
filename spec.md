# Home Care Nurse

## Current State
Full-stack app with Motoko backend and React frontend. Features: nurse registration, nurse directory (pincode + GPS), nurse dashboard (availability toggle, location update, service proof upload), admin dashboard (list, edit, delete nurses, manage service proofs), bilingual (EN/TE), PWA.

The last build failed. Four bugs are reported:
1. Availability toggle (ON/OFF) not saving in nurse dashboard
2. Location update not saving in nurse dashboard
3. Delete nurse not working in admin
4. Registered nurse data not showing in admin dashboard

## Requested Changes (Diff)

### Add
- Nothing new

### Modify
- Regenerate backend with stable nurse storage, correct mutation methods for availability toggle, location update, and delete
- Ensure `listAllNurses` always returns current data
- Ensure `deleteNurse`, `setNurseAvailability`, `updateNurseLocation` all work reliably

### Remove
- Nothing

## Implementation Plan
1. Regenerate Motoko backend with clear, simple function requirements
2. Verify frontend hooks are correctly calling backend methods
3. Validate and deploy
