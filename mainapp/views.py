from django.http import Http404, HttpResponse
from django.shortcuts import render
from django.urls import reverse
from django.views.decorators.cache import cache_control

from .projects import PROJECTS, PROJECTS_BY_SLUG


def index(request):
    return render(request, 'mainapp/index.html', {'projects': PROJECTS})


def project_detail(request, slug):
    project = PROJECTS_BY_SLUG.get(slug)
    if project is None:
        raise Http404("Project not found")
    return render(request, 'mainapp/project_detail.html', {'project': project})


def api_services(request):
    return render(request, 'mainapp/services/apis.html')


def software_ai_services(request):
    return render(request, 'mainapp/services/custom_software_ai.html')


# ----------------------------------------------------------------
# SEO endpoints — robots.txt and sitemap.xml served at the site root.
# Both are cached aggressively (1 day) since their content rarely changes.
# ----------------------------------------------------------------

SITE_ORIGIN = "https://dev.sruedadev.com"


@cache_control(max_age=86400, public=True)
def robots_txt(request):
    lines = [
        "User-agent: *",
        "Allow: /",
        "Disallow: /admin/",
        "",
        f"Sitemap: {SITE_ORIGIN}{reverse('mainapp:sitemap')}",
    ]
    return HttpResponse("\n".join(lines), content_type="text/plain")


@cache_control(max_age=86400, public=True)
def sitemap_xml(request):
    urls = [
        (reverse('mainapp:index'), "1.0", "weekly"),
        (reverse('mainapp:api_services'), "0.9", "monthly"),
        (reverse('mainapp:software_ai_services'), "0.9", "monthly"),
    ]
    for project in PROJECTS:
        urls.append((
            reverse('mainapp:project_detail', kwargs={'slug': project['slug']}),
            "0.7",
            "monthly",
        ))

    body = ['<?xml version="1.0" encoding="UTF-8"?>',
            '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" '
            'xmlns:xhtml="http://www.w3.org/1999/xhtml">']
    for path, priority, changefreq in urls:
        loc = f"{SITE_ORIGIN}{path}"
        body.append("  <url>")
        body.append(f"    <loc>{loc}</loc>")
        body.append(f"    <changefreq>{changefreq}</changefreq>")
        body.append(f"    <priority>{priority}</priority>")
        body.append(f'    <xhtml:link rel="alternate" hreflang="en-us" href="{loc}" />')
        body.append("  </url>")
    body.append("</urlset>")

    return HttpResponse("\n".join(body), content_type="application/xml")
