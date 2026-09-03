# Asset Organization

Use this structure for all site media:

- `assets/images/projects/<slug>/` for project stills, hero images, galleries, and thumbnails
- `assets/gifs/projects/<slug>/` for motion demos
- `assets/documents/projects/<slug>/` for PDFs and downloadable files
- `assets/images/about/` for profile or biography images
- `assets/images/shared/` for logos, icons, or images used on more than one page

Current project slugs:

- `caribou`
- `oportun`
- `geico`
- `personal-projects`

Recommended naming:

- `hero.png` or `hero.webp`
- `gallery-01.png`, `gallery-02.png`
- `thumb.png`
- `demo.gif` or, preferably for web performance, `demo.mp4`
- `case-study.pdf`

Keep filenames lowercase and hyphenated.

## Adding New Assets

- Keep each project's media in its existing project-slug directory.
- Use WebP or AVIF for still images when the source quality and browser support are acceptable.
- Prefer MP4 for motion demos instead of GIF when practical.
- Compress large media before committing it. Review any still image over 1 MB or video over 10 MB before adding it to a page.
- Use `loading="lazy"` for below-the-fold images unless the image is part of the initial viewport.
- Give images stable dimensions through intrinsic image dimensions or CSS sizing to reduce layout shift.
- Write descriptive alt text for informative images. Use empty alt text for purely decorative images.

## Project Content Checklist

Each new project page should define:

- Project title and concise summary
- Role, methods, and outcomes
- Captions for evidence images and videos
- Descriptive alt text for every informative media asset
- A matching lowercase, hyphenated project slug

Do not rename existing assets as part of an unrelated change. Treat renames as a separate inventory, reference update, validation, and visual-review task.
