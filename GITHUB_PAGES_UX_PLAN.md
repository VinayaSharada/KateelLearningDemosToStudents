# GitHub Pages UX Plan

This document defines the next-step information architecture for the public GitHub Pages experience in `KateelLearningDemosToStudents`.

It is based on a repo review of:
- the current landing page
- course pages
- demo pages
- README and course catalog files
- recent navigation and demo-standardization commits

## Why This Plan Exists

The repo is now serving two different needs:

1. a curated, classroom-ready GitHub Pages experience
2. a broader repo library with legacy, partial, local-only, and experimental assets

Today those two layers are mixed together. That creates UX issues:
- too many entry points
- inconsistent counts and labels
- stale demo-index links
- unclear difference between curated demos and full repo inventory
- poor signaling of run modes such as Browser, Colab, Local, and Multi-Mode

## Goals

The public site should make these things obvious within one minute:

1. what the platform is
2. who it is for
3. how to start
4. how demos are organized
5. which demos are classroom-ready
6. which run modes each demo supports
7. how course packs, demos, and assignments relate

## Public Information Architecture

The GitHub Pages site should use five public layers.

### 1. Home

Purpose:
- orient first-time visitors
- explain the learning model
- route visitors into the right entry path

Home should answer:
- start with demos or course packs?
- what run modes exist?
- how many curated demos are public?

### 2. Browse Demos

Purpose:
- serve as the canonical public demo catalog
- replace older manually maintained demo indexes as the main browsing surface

Browse Demos should support:
- search
- filtering by course
- filtering by level
- filtering by mode
- clear About vs Launch actions

### 3. Course Packs

Purpose:
- package demos into teaching journeys
- connect course pages, assignments, and supporting course-catalog docs

Each pack should show:
- course purpose
- number of curated demos
- likely audience
- related assignments
- supporting catalog or course-map docs

### 4. Demo Unit

Each public demo should continue to use:
- `about.html`
- `index.html`
- `README.md`

Public labels should be:
- `About`
- `Launch`
- `README`

Run-mode expectations must be visible on the demo unit.

### 5. Library / Archive

Purpose:
- keep the full repo valuable without cluttering the student-facing site

This includes:
- local-only demos without polished Pages surfaces
- partial demos
- legacy demos
- backend folders
- development assets

The archive should stay discoverable from GitHub, but not dominate the public Pages UX.

## Source Of Truth Strategy

The site should stop using multiple hand-maintained indexes as primary navigation.

Recommended source-of-truth order:

1. curated course pages
2. demo-level About and Launch pages
3. supporting course-catalog and assignment files

Manual demo-index pages should be treated as legacy until regenerated from structured data.

## Naming and Page Roles

Keep these standard roles:
- `index.html` = Launch
- `about.html` = About
- `README.md` = Repo documentation

Do not rename README files for public UX. Instead standardize public labels.

## Run Mode Model

Every public surface should support these mode labels:
- `Browser`
- `Colab`
- `Local`
- `Multi-Mode`
- `Browser AI`

Expectation language should be plain:
- starts immediately
- may download a local model
- best in Colab
- local Python setup required

## Phase 1 Implementation

This implementation slice introduces:

1. a documented public UX plan
2. a canonical `Browse Demos` page
3. a `Course Packs` page
4. a generated source-of-truth catalog at `data/site-catalog.json`
5. shared navigation links to those new surfaces
6. landing-page count hydration from the curated public catalog
7. de-emphasis of the legacy HTML demo index

Supporting implementation:

- `scripts/build_site_catalog.py` regenerates the curated public catalog from the current course-pack pages
- `assets/catalog.js` now prefers the static JSON catalog and only falls back to runtime scraping if needed

## Phase 2 Implementation

Next steps after this commit:

1. move from page-scraping catalog hydration to a structured demo registry file
2. regenerate course pages from that registry
3. add readiness badges such as `Classroom Ready`, `Needs Setup`, `Archive`
4. expand multi-mode visibility across more banking and domain demos
5. decide whether to add a public archive/library page

## Success Criteria

The Pages UX is improved when:
- users have one obvious browsing path
- counts match across public pages
- legacy indexes are no longer primary
- course packs feel different from raw demo browsing
- About vs Launch is preserved clearly
- run modes are visible before launch
