# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Portfolio site for Sergio Rueda & Eder Acuña (Freelance Fullstack Developers, Colombia). The site is a **Django 4.0** app served from a single app, `mainapp`, with the marketing site rendered via Django templates and standalone demo HTML files served as static assets.

> An older revision of this repo had a parallel static `index.html` at the root. That has been migrated into `mainapp/templates/mainapp/`. Do not look for top-level `index.html` / `css/` / `js/` / `img/` directories — they don't exist anymore.

## Commands

A virtualenv lives in `env/` (Windows layout: `env/Scripts/`). Activate it then run management commands from the repo root:

```
env\Scripts\activate
python manage.py runserver
python manage.py migrate
```

Dependencies in `requiriments.txt` (note the misspelling — keep it, it's the actual filename): Django 4.0, asgiref, sqlparse, tzdata. SQLite DB at `db.sqlite3`.

`DEBUG=True`, the dev `SECRET_KEY`, and `ALLOWED_HOSTS = ['*']` are committed in `sergio/settings.py`. The settings file is also already wired for a reverse proxy at `dev.sruedadev.com` (`CSRF_TRUSTED_ORIGINS`, `SECURE_PROXY_SSL_HEADER`, `USE_X_FORWARDED_HOST`) — fine for local dev but anything sensitive must change before a real deploy.

### Placeholder image generator
`make_placeholders.py` regenerates portfolio thumbnails into `mainapp/static/mainapp/img/projects/` using Pillow + Windows system fonts. Standalone script with a hard-coded absolute path — run only when the project list changes, and update the path if the repo moves.

## Architecture

### URL → view → template flow
`sergio/urls.py` mounts `mainapp.urls` at `/`. `mainapp` exposes four routes (`mainapp/urls.py` → `mainapp/views.py`):

- `''` → `index` → `mainapp/index.html` — the full marketing single-page site (navbar, hero, about, services, portfolio, testimonials, pricing, contact, footer). Receives `projects` from `PROJECTS`.
- `projects/<slug>/` → `project_detail` → `mainapp/project_detail.html` — case study page. Looks up the project in `PROJECTS_BY_SLUG`, raises `Http404` on miss.
- `services/api-development/` → `api_services` → `mainapp/services/apis.html`
- `services/custom-software-ai/` → `software_ai_services` → `mainapp/services/custom_software_ai.html`

`mainapp/models.py`, `admin.py`, and `tests.py` are empty stubs. There is no database content — the portfolio is a Python data structure (see below).

### Portfolio data: `mainapp/projects.py`
The portfolio catalog is a hand-maintained Python list `PROJECTS` (and a derived `PROJECTS_BY_SLUG` lookup). **This is intentional, not technical debt** — the file's docstring explicitly says: promote to a Django model only when an editor needs to manage projects without touching code.

Each project dict has: `slug`, `title`, `category`, `industry`, `image` (static path), `html_file` (static path to a standalone demo), `short_desc`, `long_desc`, `tech_stack`, `highlight_metric`, `highlight_label`, `year`. Adding a project means appending a dict here — no migration, no admin work.

### Standalone project demos
`mainapp/static/mainapp/projects/*.html` are full self-contained landing pages, one per portfolio entry. They are referenced by `project.html_file` and rendered inside an `<iframe>` (and as a "Live Demo" link) on `project_detail.html`. They are static assets, not Django templates — don't add `{% %}` tags to them.

### Templates layout
- `mainapp/templates/mainapp/base.html` — shared shell: Google Fonts, Bootstrap 5.3.3 (CSS+JS bundle from CDN), Bootstrap Icons 1.11.3, the navbar, and links to `mainapp/static/mainapp/css/styles.css`. Has `{% block title %}`, `{% block extra_css %}`, `{% block content %}`.
- `mainapp/templates/mainapp/index.html` — extends `base.html`, contains every section of the marketing page.
- `mainapp/templates/mainapp/project_detail.html` — extends `base.html`, renders one project from the dict.
- `mainapp/templates/mainapp/services/*.html` — service-specific landing pages.
- `developer.html`, `system_prompt.html`, `test.html` directly under `mainapp/templates/` are loose files **not currently routed** by `mainapp/urls.py`. Treat as scratch unless the user says otherwise.

### Static assets
Everything served to the browser lives under `mainapp/static/mainapp/`:
- `css/styles.css` — single stylesheet. Theme tokens (colors, spacing, fonts) are in `:root` at the top — `--accent: #22c55e` (green) and `--teal: #06b6d4` over a dark background. Change tokens there rather than overriding downstream.
- `js/scripts.js` — single vanilla JS IIFE, no deps beyond Bootstrap's bundle. Features: sticky navbar with active-link tracking, typed-text effect, IntersectionObserver scroll reveals, animated counters, skill bars, services tabs, portfolio category filter, testimonials carousel (autoplay + swipe), newsletter form, scroll-to-top button.
- `img/`, `img/projects/` — assets and project thumbnails.
- `projects/` — the standalone demo pages described above.

External CDNs (Bootstrap, Bootstrap Icons, Google Fonts) — no local copies, so offline editing won't render correctly.

### Conventions to preserve when editing markup
- Reveal animations are driven by classes `reveal-up` / `reveal-left` / `reveal-right` plus a `data-delay` attribute. The IntersectionObserver in `scripts.js` looks for these — new sections need them to animate in.
- Portfolio cards filter via `data-category` on each item; the filter buttons match by that attribute.
- Services tabs switch via `data-tab` on the trigger and the matching panel id.
- Testimonials carousel and newsletter form are wired by id in `scripts.js` — renaming ids will silently break them.
- In templates, always reference assets via `{% static 'mainapp/...' %}` (note the `mainapp/` prefix because of the nested `static/mainapp/` layout) and link between Django pages with `{% url 'mainapp:index' %}` etc. — the namespace `mainapp` is set in `mainapp/urls.py`.
