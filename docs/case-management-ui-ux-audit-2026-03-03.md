# Case Management UI/UX Audit (2026-03-03)

## Scope and Method

- Reviewed reported UX issues and screenshots for KYB/KYC case management and sidebar behavior.
- Reviewed implementation paths in backoffice case tabs, sidebar navigation, and SL seed filters.
- Ran browser automation against `https://admin.verify.mikashboksapis.com/` up to sign-in boundary (no authenticated session available in this environment).

## Implemented in This Patch

### 1) KYB tabs no longer appear broken/inactive when data is missing

- KYB tabs are now always enabled in tab definition logic:
  - `/Users/saltonmassally/Projects/MiKashBoks/namkha/identity/ballerine/apps/backoffice-v2/src/lib/blocks/variants/DefaultBlocks/hooks/useCaseBlocksLogic/utils/get-variant-tabs.ts:24`
- Added explicit empty-state cards per KYB tab (`Summary`, `KYB`, `Documents`, `Web Presence`, `Store`, `Associated Companies`, `Custom Data`) when there is no data:
  - `/Users/saltonmassally/Projects/MiKashBoks/namkha/identity/ballerine/apps/backoffice-v2/src/lib/blocks/variants/DefaultBlocks/hooks/useCaseBlocksLogic/utils/useTabsToBlocksMap.tsx:56`
  - `/Users/saltonmassally/Projects/MiKashBoks/namkha/identity/ballerine/apps/backoffice-v2/src/lib/blocks/variants/DefaultBlocks/hooks/useCaseBlocksLogic/utils/useTabsToBlocksMap.tsx:740`

### 2) Sidebar readability and clarity improved

- Increased visual contrast for nav text and sub-items so they do not look disabled:
  - `/Users/saltonmassally/Projects/MiKashBoks/namkha/identity/ballerine/apps/backoffice-v2/src/domains/auth/components/AuthenticatedLayout/components/NavItem.tsx:168`
  - `/Users/saltonmassally/Projects/MiKashBoks/namkha/identity/ballerine/apps/backoffice-v2/src/domains/auth/components/AuthenticatedLayout/components/NavMain.tsx:48`
- Sidebar filter label normalization is now narrowly scoped to SL filters only (no cross-tenant reorder behavior):
  - `/Users/saltonmassally/Projects/MiKashBoks/namkha/identity/ballerine/apps/backoffice-v2/src/domains/auth/components/AuthenticatedLayout/hooks/useSidebarItems/useSidebarItems.tsx:22`

### 3) Loan docs menu naming clarified at seed level

- Preferred UI label changed from `Loan Documents Review` to `Loan Documents Queue` for SL:
  - `/Users/saltonmassally/Projects/MiKashBoks/namkha/identity/ballerine/services/workflows-service/scripts/sierraleone-seed.ts:1504`

## Why you see both “Loan Applications” and “Loan Documents Queue”

This is intentional separation:

- `Loan Applications` = parent orchestration workflow (`loan_kyc_kyb_sierra_leone`).
- `Loan Documents Queue` = child docs-review workflow (`loan_documents_review_sierra_leone`).

Current flow behavior explains empty docs queue in some scenarios:

- Parent skips docs-review child when no financial/employment docs are present and moves directly to financial/risk stages.
- Code path:
  - `/Users/saltonmassally/Projects/MiKashBoks/namkha/identity/ballerine/services/workflows-service/scripts/workflows/sl/loan-kyc-kyb-sierra-leone.ts:156`
  - `/Users/saltonmassally/Projects/MiKashBoks/namkha/identity/ballerine/services/workflows-service/scripts/workflows/sl/loan-kyc-kyb-sierra-leone.ts:191`

## Remaining Issues / Risks (Not fully closed in this patch)

### High

1. Auth/session 401s still block case APIs for affected users/sessions.

- This patch does not change auth guards or session lifecycle.
- Symptoms match your logs (`/internal/*` and `/external/*` returning 401).

### Medium

1. Cannot complete authenticated UI audit in this environment without valid session credentials.

- Browser automation reaches sign-in route and app shell, but case pages cannot be traversed without auth.

### Medium

2. Login page still renders a floating loader dot below the sign-in form (visual polish issue).

- Observed in automated capture at sign-in boundary.
- Needs a quick check in auth layout/loading-state component logic.

### Low

1. NavMain still mutates nav item object inline when preserving search params.

- `/Users/saltonmassally/Projects/MiKashBoks/namkha/identity/ballerine/apps/backoffice-v2/src/domains/auth/components/AuthenticatedLayout/components/NavMain.tsx:65`
- Works today but is brittle pattern in React render paths.

2. No dedicated tests yet for new sidebar label normalization and KYB no-data tab fallbacks.

## Browser Audit Evidence (Unauthenticated)

- Navigates to: `https://admin.verify.mikashboksapis.com/en/auth/sign-in`
- Console errors: none observed in unauthenticated flow.
- Network 4xx/5xx during sign-in load: none observed.
- Screenshots captured locally:
  - `/tmp/admin-verify-root-debug.png`

## Validation Run Notes

- `@ballerine/backoffice-v2` production build completed successfully after first patch iteration.
- A subsequent rebuild was manually terminated due process hang in this shell session.
- Targeted formatting checks pass for changed files.
- Repository-wide TS typecheck reports many pre-existing baseline errors unrelated to this patch.
