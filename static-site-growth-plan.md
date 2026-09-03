# Static Site Growth Plan

This plan covers the next maintenance steps for the portfolio after the initial structural cleanup. The site should remain a static site while it is small, readable, and inexpensive to deploy.

## Item 3: Automated Validation

### Goal
Catch broken pages, links, asset paths, and same-page navigation before deployment.

### Implementation

1. Add a lightweight repository-local validator for the six HTML pages.
2. Check that each local `href` and `src` target exists.
3. Check that every `#fragment` link points to an element with the matching `id`.
4. Check required top-level navigation destinations.
5. Reject paths that escape the site root.
6. Run the validator locally with one documented command.
7. Run the same check in GitHub Actions before the Pages artifact is uploaded.
8. Add a temporary broken-reference test during implementation to prove the validator fails correctly, then restore the repository.

### Acceptance criteria

- All current pages and local assets pass.
- A missing asset or fragment causes a non-zero exit status.
- Validation runs before deployment.
- No external URL checks are required for the first version.

## Item 4: Security And Deployment

### Goal
Reduce avoidable browser and deployment risks without adding application complexity.

### Implementation

1. Add `rel="noopener noreferrer"` to every external link using `target="_blank"`.
2. Review the GitHub Pages artifact boundary so private notes, source material, secrets, and unrelated repository files cannot be published accidentally.
3. Consider pinning third-party GitHub Actions to reviewed commit SHAs. Document the update and review process if this is adopted.
4. Keep workflow permissions limited to the permissions required for Pages deployment.
5. Document that GitHub Pages does not provide repository-controlled response headers. If CSP, Referrer-Policy, Permissions-Policy, or frame protection becomes necessary, use a host or CDN that permits those headers.
6. Treat the Firebase-backed personal applications as separate security reviews; portfolio copy does not secure those applications.

### Acceptance criteria

- No blank-target external link lacks `noopener` protection.
- No credentials or private project material are included in the published tree.
- Workflow permissions and action versions have been reviewed.
- Header limitations and any hosting decision are documented.

## Item 5: Asset And Content Conventions

### Goal
Make new projects predictable to add and reduce broken references or oversized media.

### Implementation

1. Extend `assets/README.md` with required lowercase, hyphenated filenames.
2. Define preferred formats: WebP or AVIF for still images where browser support and source quality are acceptable; MP4 for motion demos instead of GIF when practical.
3. Document a practical file-size review threshold and require compression before adding large media.
4. Use the existing project-slug directories for images, motion media, and documents.
5. Add a repeatable project-content template covering title, summary, role, methods, outcomes, captions, and alt text.
6. Use `loading="lazy"` for below-the-fold images when it does not interfere with the initial presentation.
7. Add intrinsic image dimensions or stable CSS sizing to reduce layout shift.
8. Do not rename existing assets in this phase. Handle any rename as a separate inventory, mechanical update, validation, and visual-review change.

### Acceptance criteria

- New asset additions follow one documented naming and location convention.
- New project pages have consistent content fields and accessible media descriptions.
- Large media receives an explicit size and format review.
- Existing URLs remain unchanged during this phase.

## Item 6: Verification And Future Generator Threshold

### Goal
Define repeatable release checks and avoid introducing a generator before it solves a real maintenance problem.

### Verification checklist

1. Validate HTML, local links, asset paths, and fragment targets.
2. Click through all navigation destinations.
3. Check image loading and responsive layout at desktop and mobile widths.
4. Test keyboard focus and external-link behavior.
5. Confirm GEICO videos load or display their fallback images.
6. Review the Git diff for unexpected files or public documents.
7. Run the GitHub Actions workflow and inspect the deployed Pages site after deployment changes.

### Stay with hand-maintained HTML while

- The page count remains small.
- Most pages are meaningfully different.
- Navigation edits are infrequent.
- Validation remains fast and understandable.

### Reconsider a static-site generator when

- Repeated navigation and page templates dominate normal edits.
- Project count grows materially beyond the current six pages.
- Multiple contributors need consistent generated structure.
- Content updates are frequent enough that manual HTML becomes the main source of defects.

At that point, evaluate a minimal static generator such as Eleventy. Do not introduce React or a client-rendered application solely to remove duplicated HTML.

## Implementation Order

1. Build and run the local validator.
2. Add the validator to GitHub Actions before deployment.
3. Harden external links and review the published artifact boundary.
4. Update asset and project-content documentation.
5. Run the full verification checklist.
6. Reassess the generator threshold only after these checks are in regular use.

## Scope Boundaries

- Keep the current static hosting model.
- Do not rename existing assets in the first implementation pass.
- Do not migrate to React, Astro, or Eleventy yet.
- Do not treat portfolio references to Firebase as evidence that this repository contains or secures those applications.
