from django.urls import path

from . import views

app_name = 'mainapp'

urlpatterns = [
    path('', views.index, name='index'),
    path('projects/<slug:slug>/', views.project_detail, name='project_detail'),
    path('services/api-development/', views.api_services, name='api_services'),
    path('services/custom-software-ai/', views.software_ai_services, name='software_ai_services'),
]
