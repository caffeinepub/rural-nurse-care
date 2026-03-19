# Home Care Nurse

## Current State
Full-stack app with React frontend and Motoko backend. The app is in English only except for the disclaimer popup which already shows both English and Telugu. Pages include: HomePage, NursesPage, NurseRegisterPage, NurseProfilePage, NurseDashboardPage, AdminDashboardPage.

## Requested Changes (Diff)

### Add
- A `LanguageContext` (React context) in `src/frontend/src/contexts/LanguageContext.tsx` providing `lang` ('en' | 'te') and `setLang` toggle.
- A `translations.ts` file with all UI strings in both English and Telugu for: Layout/nav, HomePage buttons & headings, NursesPage labels & filters, NurseRegisterPage form fields & labels, NurseProfilePage labels, NurseDashboardPage labels, FeedbackForm labels, NurseCard labels.
- A language toggle button (EN / తె) in the top navigation bar (Layout.tsx) that persists selection in localStorage.

### Modify
- `Layout.tsx` -- wrap app in LanguageProvider, add EN/తె toggle button in header.
- `HomePage.tsx` -- use translated strings for all button labels, headings, and descriptions.
- `NursesPage.tsx` -- translate search labels, tab names (Pincode/Nearby), filter UI, nurse card distance label, no-results text.
- `NurseRegisterPage.tsx` -- translate all form field labels, placeholders, button text, success/error messages.
- `NurseProfilePage.tsx` -- translate section headings, call button, feedback section labels.
- `NurseDashboardPage.tsx` -- translate form labels, upload section, success messages.
- `FeedbackForm.tsx` -- translate form labels and submit button.
- `NurseCard.tsx` -- translate Call Now button and badge text.
- `App.tsx` -- translate splash screen text.

### Remove
- Nothing removed.

## Implementation Plan
1. Create `LanguageContext.tsx` with EN/TE toggle, localStorage persistence.
2. Create `translations.ts` with all strings.
3. Update `Layout.tsx` to wrap with LanguageProvider and add toggle in header.
4. Update all pages and components to use `useLanguage()` hook and translated strings.
5. Validate build.
