# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Portfolio site for Sergio Rueda & Eder Acuña (Fullstack Developers). The repo currently contains **two unrelated halves**:

1. **A finished static single-page site** (`index.html` + `css/` + `js/` + `img/`) — this is what's actually served today. No build tools, no bundler, no package manager.
2. **An empty Django 4.0 scaffold** (`manage.py`, `sergio/`, `mainapp/`, `env/`) — `django-admin startproject sergio` + `startapp mainapp`, nothing wired up. `mainapp/models.py`, `views.py` are empty stubs and `sergio/urls.py` only registers `admin/`. Treat it as a placeholder for a future migration of the static site into Django; do not assume any of its files are load-bearing.

When the user asks for a change to "the site," they almost always mean the static `index.html` half. Confirm before touching the Django scaffold.

## Commands

### Static site (primary)
Open `index.html` directly, or serve the repo root:
```
python -m http.server 8000
```

### Django scaffold
A virtualenv lives in `env/` (Windows layout: `env/Scripts/`). Activate then run management commands from the repo root:
```
env\Scripts\activate
python manage.py runserver
python manage.py migrate
```
SQLite DB at `db.sqlite3`. `DEBUG=True` and the dev `SECRET_KEY` are committed in `sergio/settings.py` — fine for local, must change before any deploy.

### Placeholder image generator
`make_placeholders.py` regenerates the portfolio thumbnails into `img/projects/` using Pillow + Windows system fonts. Standalone script — run only when the project list changes.

## Static Site Architecture

- **Single file** `index.html` contains every section (navbar, hero, stats, about, services, portfolio, testimonials, pricing, contact, footer). All edits to copy/structure happen here.
- **CSS**: `css/styles.css`. Theme tokens (colors, spacing, fonts) live in `:root` at the top — `--accent: #22c55e` (green) and `--teal: #06b6d4` over a dark background. Change tokens there rather than overriding downstream.
- **JS**: `js/scripts.js` — vanilla JS in a single IIFE, no dependencies beyond Bootstrap's bundle. Features: sticky navbar with active-link tracking, typed-text effect, IntersectionObserver scroll reveals, animated counters, skill bars, services tabs, portfolio category filter, testimonials carousel (autoplay + swipe), newsletter form, scroll-to-top button.
- **External CDNs**: Bootstrap 5.3.3 (CSS+JS bundle), Bootstrap Icons 1.11.3, Google Fonts (Poppins + Nunito). No local copies — offline editing won't render correctly.

### Conventions to preserve when editing markup
- Reveal animations are driven by classes `reveal-up` / `reveal-left` / `reveal-right` plus a `data-delay` attribute. The IntersectionObserver in `scripts.js` looks for these — new sections need them to animate in.
- Portfolio cards filter via `data-category` on each item; the filter buttons match by that attribute.
- Services tabs switch via `data-tab` on the trigger and the matching panel id.
- Testimonials carousel and newsletter form are wired by id in `scripts.js` — renaming ids will silently break them.
