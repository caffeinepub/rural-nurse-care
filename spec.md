# Home Care Nurse

## Current State
Admin dashboard at `/admin-hidden-access` allows:
- View all registered nurses
- Delete a nurse profile
- View and delete entire service proof entries

## Requested Changes (Diff)

### Add
- Edit button per nurse in admin dashboard that opens an inline edit form
- Individual delete buttons for each photo and video within a service proof (in addition to deleting the whole proof)
- Backend `updateServiceProof` method to update a proof with modified media arrays
- Backend `useUpdateServiceProof` hook

### Modify
- `updateNurse` backend: remove admin permission check so it can be called from the password-protected admin UI without requiring on-chain login
- `AdminDashboardPage.tsx`: add edit nurse modal/inline form with all editable fields (name, phone, registration number, village, mandal, district, pincode, experience, bio, isAvailable)
- `NurseServiceProofs` component: add per-photo and per-video delete buttons that call `updateServiceProof` with the media removed

### Remove
Nothing removed.

## Implementation Plan
1. Edit `main.mo`: make `updateNurse` public, add `updateServiceProof(proof: ServiceProof)` method
2. Edit `backend.d.ts`: add `updateServiceProof` to interface
3. Edit `useQueries.ts`: add `useUpdateServiceProof` mutation hook
4. Edit `AdminDashboardPage.tsx`:
   - Add edit state per nurse, inline edit form with all fields
   - Individual photo delete in NurseServiceProofs (filter out photo by index, call updateServiceProof)
   - Individual video delete in NurseServiceProofs (set videoUrl to undefined, call updateServiceProof)
