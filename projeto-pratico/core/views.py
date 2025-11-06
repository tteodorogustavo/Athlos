from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from django.db.models import Q
from academias.models import Academia, Aluno, PersonalTrainer
from academias.forms import AcademiaForm, AlunoForm
from treinos.models import Treino
from treinos.forms import TreinoForm, ItemTreinoFormSet
from django.shortcuts import get_object_or_404


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
        treinos = Treino.objects.filter(personal_criador=personal)
        academias = Academia.objects.all()

        context = {
            "personal": personal,
            "alunos": alunos,
            "treinos": treinos,
            "academias": academias,
            "total_alunos": alunos.count(),
            "total_treinos": treinos.count(),
            "total_academias": academias.count(),
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


@login_required
def academia_list(request):
    """Listagem de academias (ADMINs e PERSONAL)."""
    if request.user.user_type not in ["ADMIN", "ADMIN_SISTEMA", "PERSONAL"]:
        messages.error(request, "Acesso negado.")
        return redirect("dashboard")

    academias = Academia.objects.all()
    return render(
        request, "core/academias/academia_list.html", {"academias": academias}
    )


@login_required
def academia_detail(request, pk):
    if request.user.user_type not in ["ADMIN", "ADMIN_SISTEMA", "PERSONAL"]:
        messages.error(request, "Acesso negado.")
        return redirect("dashboard")

    academia = get_object_or_404(Academia, pk=pk)
    return render(
        request, "core/academias/academia_detail.html", {"academia": academia}
    )


@login_required
def academia_create(request):
    if request.user.user_type not in ["ADMIN", "ADMIN_SISTEMA", "PERSONAL"]:
        messages.error(request, "Acesso negado.")
        return redirect("dashboard")

    if request.method == "POST":
        form = AcademiaForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, "Academia criada com sucesso.")
            return redirect("academia_list")
    else:
        form = AcademiaForm()

    return render(request, "core/academias/academia_form.html", {"form": form})


@login_required
def academia_edit(request, pk):
    if request.user.user_type not in ["ADMIN", "ADMIN_SISTEMA", "PERSONAL"]:
        messages.error(request, "Acesso negado.")
        return redirect("dashboard")

    academia = get_object_or_404(Academia, pk=pk)
    if request.method == "POST":
        form = AcademiaForm(request.POST, instance=academia)
        if form.is_valid():
            form.save()
            messages.success(request, "Academia atualizada com sucesso.")
            return redirect("academia_detail", pk=academia.pk)
    else:
        form = AcademiaForm(instance=academia)

    return render(
        request,
        "core/academias/academia_form.html",
        {"form": form, "academia": academia},
    )


@login_required
def treino_list(request):
    """Listagem de treinos. ADMIN vê todos; PERSONAL vê os seus; ALUNO vê os seus."""
    user = request.user
    if user.user_type in ["ADMIN", "ADMIN_SISTEMA"]:
        treinos = Treino.objects.all()
    elif user.user_type == "PERSONAL":
        try:
            personal = user.personaltrainer
            treinos = Treino.objects.filter(personal_criador=personal)
        except PersonalTrainer.DoesNotExist:
            treinos = Treino.objects.none()
    elif user.user_type == "ALUNO":
        try:
            aluno = user.aluno
            treinos = Treino.objects.filter(aluno=aluno)
        except Aluno.DoesNotExist:
            treinos = Treino.objects.none()
    else:
        treinos = Treino.objects.none()

    # Implementar busca
    busca = request.GET.get("busca", "").strip()
    if busca:
        treinos = treinos.filter(
            Q(nome_treino__icontains=busca)
            | Q(aluno__user__first_name__icontains=busca)
            | Q(aluno__user__last_name__icontains=busca)
            | Q(aluno__user__email__icontains=busca)
        )

    treinos = treinos.select_related("aluno__user", "personal_criador__user").order_by(
        "-data_criacao"
    )

    return render(request, "core/treinos/treino_list.html", {"treinos": treinos})


@login_required
def treino_detail(request, pk):
    treino = get_object_or_404(Treino, pk=pk)

    # Simple access control: aluno, personal criador or admin can view
    user = request.user
    allowed = False
    if user.user_type in ["ADMIN", "ADMIN_SISTEMA"]:
        allowed = True
    elif (
        user.user_type == "PERSONAL"
        and hasattr(user, "personaltrainer")
        and treino.personal_criador == user.personaltrainer
    ):
        allowed = True
    elif (
        user.user_type == "ALUNO"
        and hasattr(user, "aluno")
        and treino.aluno == user.aluno
    ):
        allowed = True

    if not allowed:
        messages.error(request, "Acesso negado ao treino.")
        return redirect("dashboard")

    return render(request, "core/treinos/treino_detail.html", {"treino": treino})


@login_required
def treino_create(request):
    # Only ADMIN or PERSONAL can create treinos
    if request.user.user_type not in ["ADMIN", "ADMIN_SISTEMA", "PERSONAL"]:
        messages.error(request, "Acesso negado.")
        return redirect("dashboard")

    if request.method == "POST":
        form = TreinoForm(request.POST, request_user=request.user)
        formset = ItemTreinoFormSet(request.POST)

        if form.is_valid() and formset.is_valid():
            treino = form.save()
            formset.instance = treino
            formset.save()
            messages.success(request, "Treino criado com sucesso.")
            return redirect("treino_detail", pk=treino.pk)
    else:
        form = TreinoForm(request_user=request.user)
        formset = ItemTreinoFormSet()

    return render(
        request, "core/treinos/treino_form.html", {"form": form, "formset": formset}
    )


@login_required
def treino_edit(request, pk):
    treino = get_object_or_404(Treino, pk=pk)
    # Only admin or the personal criador can edit
    user = request.user
    if not (
        user.user_type in ["ADMIN", "ADMIN_SISTEMA"]
        or (
            user.user_type == "PERSONAL"
            and hasattr(user, "personaltrainer")
            and treino.personal_criador == user.personaltrainer
        )
    ):
        messages.error(request, "Acesso negado.")
        return redirect("dashboard")

    if request.method == "POST":
        form = TreinoForm(request.POST, instance=treino, request_user=request.user)
        formset = ItemTreinoFormSet(request.POST, instance=treino)

        if form.is_valid() and formset.is_valid():
            form.save()
            formset.save()
            messages.success(request, "Treino atualizado com sucesso.")
            return redirect("treino_detail", pk=treino.pk)
    else:
        form = TreinoForm(instance=treino, request_user=request.user)
        formset = ItemTreinoFormSet(instance=treino)

    return render(
        request,
        "core/treinos/treino_form.html",
        {"form": form, "formset": formset, "treino": treino},
    )


@login_required
def aluno_list(request):
    """Listagem de alunos. ADMIN vê todos; PERSONAL vê apenas os seus."""
    user = request.user
    if user.user_type in ["ADMIN", "ADMIN_SISTEMA"]:
        alunos = Aluno.objects.all()
    elif user.user_type == "PERSONAL":
        try:
            personal = user.personaltrainer
            alunos = personal.alunos.all()
        except PersonalTrainer.DoesNotExist:
            alunos = Aluno.objects.none()
    else:
        messages.error(request, "Acesso negado.")
        return redirect("dashboard")

    return render(request, "core/alunos/aluno_list.html", {"alunos": alunos})


@login_required
def aluno_detail(request, pk):
    aluno = get_object_or_404(Aluno, pk=pk)

    # Access control: admin or personal responsavel
    user = request.user
    allowed = False
    if user.user_type in ["ADMIN", "ADMIN_SISTEMA"]:
        allowed = True
    elif user.user_type == "PERSONAL" and hasattr(user, "personaltrainer"):
        if aluno.personal_responsavel == user.personaltrainer:
            allowed = True

    if not allowed:
        messages.error(request, "Acesso negado.")
        return redirect("dashboard")

    treinos = Treino.objects.filter(aluno=aluno)
    return render(
        request, "core/alunos/aluno_detail.html", {"aluno": aluno, "treinos": treinos}
    )


@login_required
def aluno_create(request):
    if request.user.user_type not in ["ADMIN", "ADMIN_SISTEMA", "PERSONAL"]:
        messages.error(request, "Acesso negado.")
        return redirect("dashboard")

    if request.method == "POST":
        form = AlunoForm(request.POST, request_user=request.user)
        if form.is_valid():
            aluno = form.save()
            messages.success(request, "Aluno criado com sucesso.")
            return redirect("aluno_detail", pk=aluno.pk)
    else:
        form = AlunoForm(request_user=request.user)

    return render(request, "core/alunos/aluno_form.html", {"form": form})


@login_required
def aluno_edit(request, pk):
    aluno = get_object_or_404(Aluno, pk=pk)

    # Access control
    user = request.user
    allowed = False
    if user.user_type in ["ADMIN", "ADMIN_SISTEMA"]:
        allowed = True
    elif user.user_type == "PERSONAL" and hasattr(user, "personaltrainer"):
        if aluno.personal_responsavel == user.personaltrainer:
            allowed = True

    if not allowed:
        messages.error(request, "Acesso negado.")
        return redirect("dashboard")

    if request.method == "POST":
        form = AlunoForm(request.POST, instance=aluno, request_user=request.user)
        if form.is_valid():
            form.save()
            messages.success(request, "Aluno atualizado com sucesso.")
            return redirect("aluno_detail", pk=aluno.pk)
    else:
        form = AlunoForm(instance=aluno, request_user=request.user)

    return render(
        request, "core/alunos/aluno_form.html", {"form": form, "aluno": aluno}
    )


@login_required
def aluno_delete(request, pk):
    aluno = get_object_or_404(Aluno, pk=pk)

    # Access control
    user = request.user
    allowed = False
    if user.user_type in ["ADMIN", "ADMIN_SISTEMA"]:
        allowed = True
    elif user.user_type == "PERSONAL" and hasattr(user, "personaltrainer"):
        if aluno.personal_responsavel == user.personaltrainer:
            allowed = True

    if not allowed:
        messages.error(request, "Acesso negado.")
        return redirect("dashboard")

    if request.method == "POST":
        aluno_nome = aluno.user.get_full_name() or aluno.user.email
        # Deletar o usuário também (cascade vai deletar o aluno e treinos)
        aluno.user.delete()
        messages.success(request, f"Aluno {aluno_nome} excluído com sucesso.")
        return redirect("aluno_list")

    return redirect("aluno_list")
