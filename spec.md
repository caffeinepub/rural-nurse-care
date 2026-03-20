# Home Care Nurse

## Current State
The app has a Motoko backend with `registerNurse`, `listAllNurses`, `setNurseAvailability`, `updateNurseLocation`, and related functions. Three backing variables (`stableNurses`, `stableFeedbacks`, `stableServiceProofs`) are declared as `var` instead of `stable var`, causing ALL nurse data to be wiped on every canister upgrade/redeployment. This is why registration doesn't appear in the admin panel, the refresh button seems broken (it fetches correctly but gets empty data), and the nurse dashboard shows no nurses.

## Requested Changes (Diff)

### Add
- Nothing new

### Modify
- `src/backend/main.mo`: Change `var stableNurses`, `var stableFeedbacks`, `var stableServiceProofs` to `stable var` so data persists across upgrades
- `src/frontend/src/pages/AdminDashboardPage.tsx`: Simplify the double-effect refresh pattern to avoid race conditions; add a loading state guard so the panel shows nurses as soon as actor + data are ready
- `src/frontend/src/pages/NurseRegisterPage.tsx`: Add explicit error display when actor is not ready; ensure submit button disabled state is correct

### Remove
- Nothing

## Implementation Plan
1. Fix `main.mo`: add `stable` keyword to the three data variables
2. Fix `AdminDashboardPage.tsx`: consolidate useEffect refresh calls, ensure actor readiness before rendering nurse list
3. Fix `NurseRegisterPage.tsx`: clear up any edge case that silently blocks submission
