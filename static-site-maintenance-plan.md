# Static Site Maintenance Plan

This plan explains how to make the portfolio easier to maintain while working between ChatGPT Desktop, the ChatGPT extension in VS Code, and GitHub.

The goal is not to rebuild the site. The goal is to make careful, small changes so future edits are easier and less risky.

## Current Situation

This project is a static portfolio site. Each page is a separate `.html` file:

- `index.html`
- `about.html`
- `caribou.html`
- `oportun.html`
- `geico.html`
- `personal-projects.html`

The site also has images and videos in the `assets/` folder.

Right now, the HTML pages include a lot of repeated CSS inside each file. This means that a simple design change, like updating the navigation or changing shared spacing, may need to be repeated across several files.

There is also a GitHub Pages deployment workflow, but it appears to be in the wrong folder:

```text
.github/workflows/.github/workflows/deploy.yml
```

GitHub usually expects workflow files here:

```text
.github/workflows/deploy.yml
```

## Recommended End State

Keep the site simple. Do not move to React, Astro, Eleventy, or another framework unless the portfolio grows much larger.

Recommended structure:

```text
my-project/
  index.html
  about.html
  caribou.html
  oportun.html
  geico.html
  personal-projects.html

  assets/
    css/
      site.css
    js/
      geico.js
    images/
    gifs/
    documents/

  .github/
    workflows/
      deploy.yml
```

## Important Rule

Make one kind of change at a time.

Do not extract CSS, rename images, move workflow files, and edit page copy all in one pass. That makes it much harder to tell what caused a problem if something breaks.

## Roles

### ChatGPT Desktop

Use ChatGPT Desktop for planning, review, and quality checks.

Good tasks for ChatGPT Desktop:

- Review the overall project structure.
- Explain risks before making changes.
- Create checklists.
- Review Git diffs.
- Summarize what changed.
- Help decide whether a change is worth making.

Use ChatGPT Desktop when you want a second set of eyes before or after editing files.

### ChatGPT Extension in VS Code

Use the ChatGPT extension in VS Code for hands-on file edits.

Good tasks for the VS Code extension:

- Create `assets/css/site.css`.
- Move shared CSS out of the HTML files.
- Add stylesheet links to each HTML page.
- Move the small GEICO script into `assets/js/geico.js`.
- Update the GitHub workflow location.
- Search for broken or outdated file paths.

When asking the VS Code extension to make changes, be specific and narrow.

Example instruction:

```text
Extract only the CSS that is clearly shared across all six HTML files into assets/css/site.css.
Add a link to that CSS file in each HTML page.
Do not change page copy.
Do not rename image or video files.
Do not redesign the pages.
Show me the diff when finished.
```

### GitHub

Use GitHub as the checkpoint and deployment system.

Good GitHub tasks:

- Keep a backup of each safe checkpoint.
- Review commits.
- Run GitHub Pages deployment.
- Confirm whether the deployment workflow succeeds.

GitHub should not be used as the place to discover problems for the first time. Test locally before pushing changes.

## Step-by-Step Plan

### Step 1: Create a Branch

Create a new branch before changing files.

Suggested branch name:

```text
codex/refactor-static-site-structure
```

This keeps the cleanup separate from the current working version of the site.

### Step 2: Fix the GitHub Workflow Location

Move this file:

```text
.github/workflows/.github/workflows/deploy.yml
```

To this location:

```text
.github/workflows/deploy.yml
```

Reason:

GitHub Actions usually only detects workflow files placed directly inside `.github/workflows/`.

Risk:

Once moved, GitHub may start running the deployment workflow on pushes to `main`. That is probably good, but it means deployment problems may become visible.

Check:

- Confirm that `.github/workflows/deploy.yml` exists.
- Confirm that there is no extra nested `.github/workflows/.github/` folder left behind.
- Push only after reviewing the change.

### Step 3: Create a Shared CSS File

Create:

```text
assets/css/site.css
```

Move only obviously shared CSS into this file first.

Good candidates:

- Reset styles, such as `* { margin: 0; padding: 0; box-sizing: border-box; }`
- CSS variables in `:root`
- Body font and background styles
- Navigation styles
- Footer styles
- Shared responsive navigation styles

Do not move page-specific case study styles in the first pass unless they are truly identical across pages.

Risk:

If styles that look similar are not actually the same, combining them may change the layout on one or more pages.

Check:

- Open every page locally.
- Confirm the navigation looks right.
- Confirm the page backgrounds and fonts look right.
- Confirm the footer still looks right.

### Step 4: Link Each HTML Page to the Shared CSS

Add this line inside the `<head>` of each HTML file:

```html
<link rel="stylesheet" href="assets/css/site.css">
```

Then remove only the CSS rules that were moved into `site.css`.

Risk:

If the link is missing or typed incorrectly, the page may load without shared styling.

Check all six pages:

- `index.html`
- `about.html`
- `caribou.html`
- `oportun.html`
- `geico.html`
- `personal-projects.html`

### Step 5: Move the GEICO Script

The GEICO page has a small script that handles video fallback behavior.

Move it into:

```text
assets/js/geico.js
```

Then reference it from `geico.html` before the closing `</body>` tag:

```html
<script src="assets/js/geico.js"></script>
```

Risk:

If the script path is wrong, the video fallback behavior may stop working.

Check:

- Open `geico.html`.
- Confirm the videos still appear.
- Confirm the fallback image still works if a video cannot load.

### Step 6: Do Not Rename Assets Yet

Many asset filenames currently contain spaces, uppercase letters, and mixed naming styles.

Examples:

```text
GEICO cover image.png
Offer selection page - After.png
grocery list two active trips.png
```

These names are not ideal, but they currently work.

Do not rename them during the CSS or workflow cleanup.

Reason:

Renaming assets requires updating every matching HTML reference. A single missed reference will create a broken image or video.

Make asset renaming a separate future project.

### Step 7: Test Locally

Before pushing to GitHub, open the site locally and check every page.

Minimum checklist:

- Home page loads.
- Every navigation link works.
- Every project card image loads.
- Caribou page images load.
- Oportun page images load.
- GEICO videos load or show fallback images.
- Personal Projects images load.
- About page image loads.
- Mobile-width layout still looks acceptable.

### Step 8: Review the Git Diff

Before committing, review the changed files.

Expected changes for the first cleanup pass:

- New `assets/css/site.css`
- Updated HTML files with stylesheet links
- Removed duplicated shared CSS from HTML files
- Moved GitHub workflow file
- Possibly new `assets/js/geico.js`

Unexpected changes to watch for:

- Page copy changes
- Image filename changes
- Deleted assets
- Large redesigns
- New framework files
- Package manager files like `package.json`, unless intentionally added

### Step 9: Commit in Small Pieces

Prefer separate commits:

```text
Fix GitHub Pages workflow location
Extract shared site styles
Move GEICO video fallback script
```

This makes it easier to undo one change without undoing everything.

### Step 10: Push and Check GitHub

After pushing:

- Open the repository on GitHub.
- Go to the Actions tab.
- Confirm the GitHub Pages workflow appears.
- Confirm the workflow succeeds.
- Open the live GitHub Pages site.
- Click through every page again.

## What Could Go Wrong

### Broken Styling

Cause:

The shared CSS file is missing, linked incorrectly, or contains rules that conflict with page-specific styles.

How to reduce risk:

Move only clearly shared styles first.

### Broken Images or Videos

Cause:

Asset paths were changed incorrectly.

How to reduce risk:

Do not rename assets during the first cleanup.

### GitHub Pages Deployment Fails

Cause:

The workflow starts running after being moved, but GitHub Pages settings or permissions are not configured correctly.

How to reduce risk:

Move the workflow separately and review the Actions result before doing more cleanup.

### Too Many Changes at Once

Cause:

A cleanup turns into a redesign, copy edit, asset rename, and deployment change all together.

How to reduce risk:

Keep each pass narrow and commit each successful checkpoint.

## Recommended First VS Code Prompt

Use this with the ChatGPT extension in VS Code:

```text
Please help with a conservative maintenance refactor.

Create assets/css/site.css.
Move only clearly shared CSS from all six HTML files into assets/css/site.css.
Add <link rel="stylesheet" href="assets/css/site.css"> to each HTML file.
Do not change page copy.
Do not rename image or video files.
Do not redesign the pages.
Do not introduce a framework or build system.
Keep page-specific CSS in each HTML file for now.
After editing, summarize the changed files and any risks.
```

## Recommended GitHub Workflow Prompt

Use this separately:

```text
Move the GitHub Pages workflow from .github/workflows/.github/workflows/deploy.yml to .github/workflows/deploy.yml.
Do not change the workflow contents unless required.
Remove only the now-empty nested workflow folders if they are empty.
Show the resulting file structure under .github.
```

## Final Recommendation

Start with the smallest useful improvement: fix the workflow location and extract only shared CSS.

That will make the project easier to maintain while keeping the site simple, readable, and easy to publish with GitHub Pages.
