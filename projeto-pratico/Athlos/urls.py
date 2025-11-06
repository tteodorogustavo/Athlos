"""
URL configuration for Athlos project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path
from core import views

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", views.home, name="home"),
    path("login/", views.login_view, name="login"),
    path("logout/", views.logout_view, name="logout"),
    path("dashboard/", views.dashboard, name="dashboard"),
    path("dashboard/admin/", views.admin_dashboard, name="admin_dashboard"),
    path("dashboard/personal/", views.personal_dashboard, name="personal_dashboard"),
    path("dashboard/aluno/", views.aluno_dashboard, name="aluno_dashboard"),
    # Academias (admin)
    path("academias/", views.academia_list, name="academia_list"),
    path("academias/novo/", views.academia_create, name="academia_create"),
    path("academias/<int:pk>/", views.academia_detail, name="academia_detail"),
    path("academias/<int:pk>/editar/", views.academia_edit, name="academia_edit"),
    # Treinos
    path("treinos/", views.treino_list, name="treino_list"),
    path("treinos/novo/", views.treino_create, name="treino_create"),
    path("treinos/<int:pk>/", views.treino_detail, name="treino_detail"),
    path("treinos/<int:pk>/editar/", views.treino_edit, name="treino_edit"),
    # Alunos
    path("alunos/", views.aluno_list, name="aluno_list"),
    path("alunos/novo/", views.aluno_create, name="aluno_create"),
    path("alunos/<int:pk>/", views.aluno_detail, name="aluno_detail"),
    path("alunos/<int:pk>/editar/", views.aluno_edit, name="aluno_edit"),
    path("alunos/<int:pk>/excluir/", views.aluno_delete, name="aluno_delete"),
]
