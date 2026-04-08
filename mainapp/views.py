from django.http import Http404
from django.shortcuts import render

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
