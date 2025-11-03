from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from academias.models import Academia, Aluno, PersonalTrainer
from treinos.models import Treino


def home(request):
    """Página inicial pública"""
    if request.user.is_authenticated:
        return redirect("dashboard")
    return render(request, "core/home.html")


def login_view(request):
    """Página de login"""
    if request.user.is_authenticated:
        return redirect("dashboard")

    if request.method == "POST":
        email = request.POST.get("email")
        password = request.POST.get("password")
        user = authenticate(request, username=email, password=password)

        if user is not None:
            login(request, user)
            return redirect("dashboard")
        else:
            messages.error(request, "Email ou senha inválidos.")

    return render(request, "core/login.html")


def logout_view(request):
    """Logout do usuário"""
    logout(request)
    messages.success(request, "Você saiu com sucesso.")
    return redirect("home")


@login_required
def dashboard(request):
    """Dashboard principal - redireciona conforme tipo de usuário"""
    user = request.user

    if user.user_type in ["ADMIN", "ADMIN_SISTEMA"]:
        return redirect("admin_dashboard")
    elif user.user_type == "PERSONAL":
        return redirect("personal_dashboard")
    elif user.user_type == "ALUNO":
        return redirect("aluno_dashboard")

    return render(request, "core/dashboard.html")


@login_required
def admin_dashboard(request):
    """Dashboard do administrador"""
    if request.user.user_type not in ["ADMIN", "ADMIN_SISTEMA"]:
        messages.error(request, "Acesso negado.")
        return redirect("dashboard")

    context = {
        "total_academias": Academia.objects.count(),
        "total_alunos": Aluno.objects.count(),
        "total_personals": PersonalTrainer.objects.count(),
        "total_treinos": Treino.objects.count(),
    }
    return render(request, "core/admin_dashboard.html", context)


@login_required
def personal_dashboard(request):
    """Dashboard do personal trainer"""
    if request.user.user_type != "PERSONAL":
        messages.error(request, "Acesso negado.")
        return redirect("dashboard")

    try:
        personal = request.user.personaltrainer
        alunos = personal.alunos.all()
        treinos = Treino.objects.filter(criado_por=personal)

        context = {
            "personal": personal,
            "alunos": alunos,
            "treinos": treinos,
            "total_alunos": alunos.count(),
            "total_treinos": treinos.count(),
        }
    except PersonalTrainer.DoesNotExist:
        messages.error(request, "Perfil de Personal Trainer não encontrado.")
        context = {}

    return render(request, "core/personal_dashboard.html", context)


@login_required
def aluno_dashboard(request):
    """Dashboard do aluno"""
    if request.user.user_type != "ALUNO":
        messages.error(request, "Acesso negado.")
        return redirect("dashboard")

    try:
        aluno = request.user.aluno
        treinos = Treino.objects.filter(aluno=aluno)

        context = {
            "aluno": aluno,
            "treinos": treinos,
            "personal": aluno.personal_responsavel,
        }
    except Aluno.DoesNotExist:
        messages.error(request, "Perfil de Aluno não encontrado.")
        context = {}

    return render(request, "core/aluno_dashboard.html", context)
