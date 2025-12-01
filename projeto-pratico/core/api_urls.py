from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

from .api_views import (
    CustomTokenObtainPairView,
    MeView,
    AcademiaViewSet,
    PersonalTrainerViewSet,
    AlunoViewSet,
    ExercicioViewSet,
    TreinoViewSet,
    DashboardPersonalView,
    DashboardAlunoView,
    DashboardAcademiaView,
    DashboardAdminView,
    RelatorioPersonalView,
    RelatorioAlunoView,
    RelatorioAcademiaView,
    RelatorioAdminView,
)

router = DefaultRouter()
router.register(r"academias", AcademiaViewSet)
router.register(r"personais", PersonalTrainerViewSet)
router.register(r"alunos", AlunoViewSet)
router.register(r"exercicios", ExercicioViewSet)
router.register(r"treinos", TreinoViewSet)

urlpatterns = [
    # Autenticação JWT
    path("auth/login/", CustomTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("auth/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("auth/me/", MeView.as_view(), name="user_me"),
    # Dashboard endpoints
    path(
        "dashboard/personal/",
        DashboardPersonalView.as_view(),
        name="dashboard_personal",
    ),
    path("dashboard/aluno/", DashboardAlunoView.as_view(), name="dashboard_aluno"),
    path(
        "dashboard/academia/",
        DashboardAcademiaView.as_view(),
        name="dashboard_academia",
    ),
    path("dashboard/admin/", DashboardAdminView.as_view(), name="dashboard_admin"),
    # Relatórios endpoints
    path(
        "relatorios/personal/",
        RelatorioPersonalView.as_view(),
        name="relatorio_personal",
    ),
    path("relatorios/aluno/", RelatorioAlunoView.as_view(), name="relatorio_aluno"),
    path(
        "relatorios/academia/",
        RelatorioAcademiaView.as_view(),
        name="relatorio_academia",
    ),
    path("relatorios/admin/", RelatorioAdminView.as_view(), name="relatorio_admin"),
    # Rotas do router
    path("", include(router.urls)),
]
