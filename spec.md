# Home Care Nurse

## Current State
The app has a functioning backend with `registerNurse`, `listAllNurses`, and related functions. The admin dashboard uses `useListAllNurses` with `refetchInterval: 5000` and a `doRefresh` callback. The refresh button calls `qc.invalidateQueries` + `refetch()`. Registration uses `useRegisterNurse` which calls `actor.registerNurse`.

## Requested Changes (Diff)

### Add
- Auto-retry logic in admin that polls until nurses appear after login
- `refreshKey` state to force query re-initialization in admin
- Visual feedback on refresh button (spinner, timestamp)
- Error surfacing in admin if canister call fails

### Modify
- `useListAllNurses`: include `refreshKey` in query key so doRefresh forces a true new query (not just re-run same key)
- `AdminDashboardPage`: refactor data loading to use a dedicated `useEffect` that triggers fetch once actor AND authed are both true, with retry up to 3 times
- `doRefresh`: increment refreshKey to force query key change, guaranteeing a fresh canister call
- Refresh button: show spinner while loading, show "Last refreshed" timestamp
- Registration page: show detailed success message with nurse name and registration number

### Remove
- Nothing removed

## Implementation Plan
1. Add `refreshKey` state in AdminDashboardPage; pass to useListAllNurses so each refresh is a uniquely-keyed query
2. Fix doRefresh to increment refreshKey before invalidating
3. Show spinner on refresh button while isLoading is true
4. Show last-refreshed timestamp in admin header
5. Registration: show more detailed success feedback with nurse details
