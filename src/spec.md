# Specification

## Summary
**Goal:** Initialize the fflux app with a consistent themed UI, Internet Identity creator login, creator device identification/registration, and build listing + one-click build download backed by a Motoko backend.

**Planned changes:**
- Create the initial frontend app shell with a coherent, consistent visual theme and English UI text.
- Add Internet Identity login/logout and display the authenticated Principal (creator identifier) in the UI.
- Detect creator device details (OS/platform, browser, and a user-agent-derived device label) and register/store the latest device profile per creator via the backend.
- Implement backend build storage and APIs to add/upload a build, list builds (creator-scoped, optionally filtered by target), and download a build by id with exact uploaded bytes.
- Add a home screen primary “one-click download” button that registers device (if needed), selects the latest compatible build, and downloads it via Blob/object URL; show an English empty state if none match.
- Add a Builds screen that lists builds (version, date, target, filename) with loading/empty/error states and manual download per build.
- Use React Query for device registration and build list/data fetching with caching and refetch behavior on login/logout and after device registration.

**User-visible outcome:** Users can sign in with Internet Identity, see their creator identity, have their device identified/registered, view available builds, and download the latest compatible build via a single primary button or manually download specific builds from the Builds screen.
