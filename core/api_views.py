from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model
from django.db.models import Count, Avg, Sum, F
from django.db.models.functions import TruncMonth, TruncWeek
from datetime import datetime, timedelta
from collections import defaultdict

from academias.models import Academia, PersonalTrainer, Aluno
from treinos.models import Exercicio, Treino, ItemTreino
from .serializers import (
    UserSerializer,
    UserDetailSerializer,
    AcademiaSerializer,
    PersonalTrainerSerializer,
    PersonalTrainerCreateUpdateSerializer,
    AlunoListSerializer,
    AlunoDetailSerializer,
    AlunoCreateUpdateSerializer,
    ExercicioSerializer,
    ExercicioListSerializer,
    TreinoListSerializer,
    TreinoDetailSerializer,
    TreinoCreateSerializer,
    ItemTreinoSerializer,
)

User = get_user_model()


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Serializer customizado para incluir dados do usuário no token"""

    def validate(self, attrs):
        data = super().validate(attrs)

        # Adiciona dados do usuário na resposta
        data["user"] = {
            "id": self.user.id,
            "email": self.user.email,
            "first_name": self.user.first_name,
            "last_name": self.user.last_name,
            "user_type": self.user.user_type,
        }

        return data


class CustomTokenObtainPairView(TokenObtainPairView):
    """View customizada para login com JWT"""

    serializer_class = CustomTokenObtainPairSerializer


class MeView(APIView):
    """View para retornar dados do usuário logado"""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserDetailSerializer(request.user)
        return Response(serializer.data)


class AcademiaViewSet(viewsets.ModelViewSet):
    """ViewSet para gerenciamento de Academias"""

    queryset = Academia.objects.all()
    serializer_class = AcademiaSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if user.user_type == "ADMIN_SISTEMA":
            return Academia.objects.all()
        elif user.user_type == "PERSONAL":
            # Personal vê as academias onde ele atua
            return Academia.objects.filter(
                alunos__personal_responsavel__user=user
            ).distinct()
        elif user.user_type == "ADMIN":
            # Admin da academia vê apenas sua academia
            if user.academia:
                return Academia.objects.filter(id=user.academia.id)

        return Academia.objects.none()


class PersonalTrainerViewSet(viewsets.ModelViewSet):
    """ViewSet para gerenciamento de Personal Trainers"""

    queryset = PersonalTrainer.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.action in ["create", "update", "partial_update"]:
            return PersonalTrainerCreateUpdateSerializer
        return PersonalTrainerSerializer

    def get_queryset(self):
        user = self.request.user

        if user.user_type == "ADMIN_SISTEMA":
            return PersonalTrainer.objects.all()
        elif user.user_type == "ADMIN":
            # Admin da academia vê personais da sua academia
            if user.academia:
                return PersonalTrainer.objects.filter(user__academia=user.academia)

        return PersonalTrainer.objects.none()


class AlunoViewSet(viewsets.ModelViewSet):
    """ViewSet para gerenciamento de Alunos"""

    queryset = Aluno.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.action == "list":
            return AlunoListSerializer
        elif self.action in ["create", "update", "partial_update"]:
            return AlunoCreateUpdateSerializer
        return AlunoDetailSerializer

    def get_queryset(self):
        user = self.request.user

        if user.user_type == "ADMIN_SISTEMA":
            return Aluno.objects.all()
        elif user.user_type == "PERSONAL":
            # Personal vê apenas seus alunos
            try:
                personal = PersonalTrainer.objects.get(user=user)
                return Aluno.objects.filter(personal_responsavel=personal)
            except PersonalTrainer.DoesNotExist:
                return Aluno.objects.none()
        elif user.user_type == "ADMIN":
            # Admin da academia vê alunos da sua academia
            if user.academia:
                return Aluno.objects.filter(academia=user.academia)
        elif user.user_type == "ALUNO":
            # Aluno vê apenas seu próprio perfil
            return Aluno.objects.filter(user=user)

        return Aluno.objects.none()


class ExercicioViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet para consulta de Exercícios (somente leitura)"""

    queryset = Exercicio.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.action == "list":
            return ExercicioListSerializer
        return ExercicioSerializer

    @action(detail=False, methods=["get"])
    def categorias(self, request):
        """Retorna lista de categorias únicas"""
        categorias = Exercicio.objects.values_list("category", flat=True).distinct()
        return Response(list(filter(None, categorias)))

    @action(detail=False, methods=["get"])
    def por_categoria(self, request):
        """Retorna exercícios agrupados por categoria"""
        categoria = request.query_params.get("categoria")
        if categoria:
            exercicios = Exercicio.objects.filter(category__iexact=categoria)
        else:
            exercicios = Exercicio.objects.all()

        serializer = ExercicioListSerializer(exercicios, many=True)
        return Response(serializer.data)


class TreinoViewSet(viewsets.ModelViewSet):
    """ViewSet para gerenciamento de Treinos"""

    queryset = Treino.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.action == "list":
            return TreinoListSerializer
        elif self.action in ["create", "update", "partial_update"]:
            return TreinoCreateSerializer
        return TreinoDetailSerializer

    def get_queryset(self):
        user = self.request.user

        if user.user_type == "ADMIN_SISTEMA":
            return Treino.objects.all()
        elif user.user_type == "PERSONAL":
            # Personal vê treinos que criou
            try:
                personal = PersonalTrainer.objects.get(user=user)
                return Treino.objects.filter(personal_criador=personal)
            except PersonalTrainer.DoesNotExist:
                return Treino.objects.none()
        elif user.user_type == "ADMIN":
            # Admin da academia vê treinos de alunos da academia
            if user.academia:
                return Treino.objects.filter(aluno__academia=user.academia)
        elif user.user_type == "ALUNO":
            # Aluno vê apenas seus treinos
            try:
                aluno = Aluno.objects.get(user=user)
                return Treino.objects.filter(aluno=aluno)
            except Aluno.DoesNotExist:
                return Treino.objects.none()

        return Treino.objects.none()


class DashboardPersonalView(APIView):
    """View para dados do dashboard do Personal Trainer"""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user

        if user.user_type != "PERSONAL":
            return Response(
                {"error": "Acesso negado"}, status=status.HTTP_403_FORBIDDEN
            )

        try:
            personal = PersonalTrainer.objects.get(user=user)
        except PersonalTrainer.DoesNotExist:
            return Response(
                {"error": "Perfil de personal não encontrado"},
                status=status.HTTP_404_NOT_FOUND,
            )

        alunos = Aluno.objects.filter(personal_responsavel=personal)
        treinos = Treino.objects.filter(personal_criador=personal)
        academias = Academia.objects.filter(
            alunos__personal_responsavel=personal
        ).distinct()

        # Treinos por mês (últimos 6 meses)
        hoje = datetime.now()
        treinos_por_mes = []
        for i in range(5, -1, -1):
            data_inicio = (hoje - timedelta(days=30 * i)).replace(day=1)
            data_fim = (
                (hoje - timedelta(days=30 * (i - 1))).replace(day=1) if i > 0 else hoje
            )
            count = treinos.filter(
                data_criacao__gte=data_inicio, data_criacao__lt=data_fim
            ).count()
            treinos_por_mes.append(
                {"mes": data_inicio.strftime("%b"), "treinos": count}
            )

        # Top exercícios
        top_exercicios = (
            ItemTreino.objects.filter(treino__in=treinos)
            .values("exercicio__nome")
            .annotate(total=Count("id"))
            .order_by("-total")[:5]
        )

        # Alunos recentes
        alunos_recentes = alunos.order_by("-user__date_joined")[:5]

        data = {
            "total_alunos": alunos.count(),
            "total_academias": academias.count(),
            "total_treinos": treinos.count(),
            "taxa_atividade": round(
                (treinos.filter(ativo=True).count() / max(treinos.count(), 1)) * 100, 1
            ),
            "treinos_por_mes": treinos_por_mes,
            "top_exercicios": list(top_exercicios),
            "alunos_recentes": AlunoListSerializer(alunos_recentes, many=True).data,
        }

        return Response(data)


class DashboardAlunoView(APIView):
    """View para dados do dashboard do Aluno"""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user

        if user.user_type != "ALUNO":
            return Response(
                {"error": "Acesso negado"}, status=status.HTTP_403_FORBIDDEN
            )

        try:
            aluno = Aluno.objects.get(user=user)
        except Aluno.DoesNotExist:
            return Response(
                {"error": "Perfil de aluno não encontrado"},
                status=status.HTTP_404_NOT_FOUND,
            )

        treinos = Treino.objects.filter(aluno=aluno)

        data = {
            "total_treinos": treinos.count(),
            "treinos_ativos": treinos.filter(ativo=True).count(),
            "sequencia_dias": 0,  # Implementar lógica de sequência
            "tempo_total_minutos": 0,  # Implementar cálculo
            "meta_semanal_atual": 0,
            "meta_semanal_total": 5,
            "treinos": TreinoListSerializer(
                treinos.order_by("-data_criacao")[:5], many=True
            ).data,
        }

        return Response(data)


class DashboardAcademiaView(APIView):
    """View para dados do dashboard da Academia"""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user

        if user.user_type not in ["ADMIN", "ADMIN_SISTEMA"]:
            return Response(
                {"error": "Acesso negado"}, status=status.HTTP_403_FORBIDDEN
            )

        if user.user_type == "ADMIN" and user.academia:
            academia = user.academia
            alunos = Aluno.objects.filter(academia=academia)
            personais = PersonalTrainer.objects.filter(user__academia=academia)
            treinos = Treino.objects.filter(aluno__academia=academia)
        else:
            alunos = Aluno.objects.all()
            personais = PersonalTrainer.objects.all()
            treinos = Treino.objects.all()

        data = {
            "total_alunos": alunos.count(),
            "total_personais": personais.count(),
            "total_treinos": treinos.count(),
            "taxa_retencao": 95.0,  # Implementar cálculo real
            "personais": PersonalTrainerSerializer(personais[:5], many=True).data,
        }

        return Response(data)


class DashboardAdminView(APIView):
    """View para dados do dashboard do Admin do Sistema"""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user

        if user.user_type != "ADMIN_SISTEMA":
            return Response(
                {"error": "Acesso negado"}, status=status.HTTP_403_FORBIDDEN
            )

        # Dados gerais
        total_usuarios = User.objects.count()
        total_academias = Academia.objects.count()
        total_personais = PersonalTrainer.objects.count()
        total_alunos = Aluno.objects.count()
        total_treinos = Treino.objects.count()

        # Crescimento de usuários (últimos 6 meses)
        hoje = datetime.now()
        crescimento = []
        for i in range(5, -1, -1):
            data_inicio = (hoje - timedelta(days=30 * i)).replace(day=1)
            data_fim = (
                (hoje - timedelta(days=30 * (i - 1))).replace(day=1) if i > 0 else hoje
            )
            alunos_mes = Aluno.objects.filter(
                user__date_joined__gte=data_inicio, user__date_joined__lt=data_fim
            ).count()
            personais_mes = PersonalTrainer.objects.filter(
                user__date_joined__gte=data_inicio, user__date_joined__lt=data_fim
            ).count()
            crescimento.append(
                {
                    "mes": data_inicio.strftime("%b"),
                    "alunos": alunos_mes,
                    "personais": personais_mes,
                }
            )

        # Volume de treinos
        volume_treinos = []
        for i in range(5, -1, -1):
            data_inicio = (hoje - timedelta(days=30 * i)).replace(day=1)
            data_fim = (
                (hoje - timedelta(days=30 * (i - 1))).replace(day=1) if i > 0 else hoje
            )
            count = Treino.objects.filter(
                data_criacao__gte=data_inicio, data_criacao__lt=data_fim
            ).count()
            volume_treinos.append({"mes": data_inicio.strftime("%b"), "treinos": count})

        # Top academias
        top_academias = Academia.objects.annotate(num_alunos=Count("alunos")).order_by(
            "-num_alunos"
        )[:5]

        data = {
            "total_usuarios": total_usuarios,
            "total_academias": total_academias,
            "total_personais": total_personais,
            "total_alunos": total_alunos,
            "total_treinos": total_treinos,
            "crescimento_usuarios": crescimento,
            "volume_treinos": volume_treinos,
            "top_academias": AcademiaSerializer(top_academias, many=True).data,
        }

        return Response(data)


# ==========================================
# RELATÓRIOS DETALHADOS
# ==========================================


class RelatorioPersonalView(APIView):
    """View para relatórios detalhados do Personal Trainer"""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user

        if user.user_type != "PERSONAL":
            return Response(
                {"error": "Acesso negado"}, status=status.HTTP_403_FORBIDDEN
            )

        try:
            personal = PersonalTrainer.objects.get(user=user)
        except PersonalTrainer.DoesNotExist:
            return Response(
                {"error": "Perfil de personal não encontrado"},
                status=status.HTTP_404_NOT_FOUND,
            )

        # Parâmetros
        periodo = request.query_params.get("periodo", "mes")
        aluno_id = request.query_params.get("aluno_id")

        # Definir intervalo de datas
        hoje = datetime.now()
        if periodo == "semana":
            data_inicio = hoje - timedelta(days=7)
        elif periodo == "trimestre":
            data_inicio = hoje - timedelta(days=90)
        elif periodo == "ano":
            data_inicio = hoje - timedelta(days=365)
        else:  # mes
            data_inicio = hoje - timedelta(days=30)

        # Filtrar dados
        alunos = Aluno.objects.filter(personal_responsavel=personal)
        treinos = Treino.objects.filter(
            personal_criador=personal, data_criacao__gte=data_inicio
        )

        if aluno_id and aluno_id != "todos":
            treinos = treinos.filter(aluno_id=aluno_id)

        # === ESTATÍSTICAS GERAIS ===
        total_treinos = treinos.count()
        treinos_mes_anterior = Treino.objects.filter(
            personal_criador=personal,
            data_criacao__gte=data_inicio - timedelta(days=30),
            data_criacao__lt=data_inicio,
        ).count()
        variacao_treinos = (
            (total_treinos - treinos_mes_anterior) / max(treinos_mes_anterior, 1)
        ) * 100

        # === TREINOS POR MÊS (últimos 6 meses) ===
        treinos_por_mes = []
        for i in range(5, -1, -1):
            mes_inicio = (hoje - timedelta(days=30 * i)).replace(day=1)
            if i > 0:
                mes_fim = (hoje - timedelta(days=30 * (i - 1))).replace(day=1)
            else:
                mes_fim = hoje + timedelta(days=1)

            count_treinos = Treino.objects.filter(
                personal_criador=personal,
                data_criacao__gte=mes_inicio,
                data_criacao__lt=mes_fim,
            ).count()

            count_alunos = Aluno.objects.filter(
                personal_responsavel=personal, user__date_joined__lt=mes_fim
            ).count()

            treinos_por_mes.append(
                {
                    "mes": mes_inicio.strftime("%b"),
                    "treinos": count_treinos,
                    "alunos": count_alunos,
                }
            )

        # === PROGRESSO DE CARGA ===
        progresso_carga = []
        semanas = 4
        for i in range(semanas - 1, -1, -1):
            semana_inicio = hoje - timedelta(days=7 * (i + 1))
            semana_fim = hoje - timedelta(days=7 * i)

            # Média de carga por exercício principal
            itens = (
                ItemTreino.objects.filter(
                    treino__personal_criador=personal,
                    treino__data_criacao__gte=semana_inicio,
                    treino__data_criacao__lt=semana_fim,
                )
                .values("exercicio__nome")
                .annotate(media_carga=Avg("carga"))
            )

            progresso_semana = {"semana": f"Sem {semanas - i}"}
            for item in itens[:3]:  # Top 3 exercícios
                nome = (
                    item["exercicio__nome"][:10] if item["exercicio__nome"] else "N/A"
                )
                progresso_semana[nome] = round(item["media_carga"] or 0, 1)

            progresso_carga.append(progresso_semana)

        # === DISTRIBUIÇÃO POR GRUPO MUSCULAR ===
        cores = ["#ef4444", "#3b82f6", "#22c55e", "#f59e0b", "#8b5cf6", "#ec4899"]
        distribuicao = (
            ItemTreino.objects.filter(
                treino__personal_criador=personal, treino__data_criacao__gte=data_inicio
            )
            .values("exercicio__category")
            .annotate(total=Count("id"))
            .order_by("-total")
        )

        distribuicao_exercicios = []
        for i, item in enumerate(distribuicao[:6]):
            distribuicao_exercicios.append(
                {
                    "nome": item["exercicio__category"] or "Outros",
                    "valor": item["total"],
                    "cor": cores[i % len(cores)],
                }
            )

        # === FREQUÊNCIA SEMANAL ===
        dias_semana = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"]
        frequencia_semanal = []
        for i, dia in enumerate(dias_semana):
            # Calcular treinos criados em cada dia da semana
            count = treinos.filter(data_criacao__week_day=i + 2 if i < 6 else 1).count()
            frequencia_semanal.append({"dia": dia, "alunos": count})

        # === TOP EXERCÍCIOS ===
        top_exercicios = (
            ItemTreino.objects.filter(
                treino__personal_criador=personal, treino__data_criacao__gte=data_inicio
            )
            .values("exercicio__nome", "exercicio__category")
            .annotate(vezes=Count("id"))
            .order_by("-vezes")[:10]
        )

        top_exercicios_data = [
            {
                "exercicio": item["exercicio__nome"],
                "vezes": item["vezes"],
                "categoria": item["exercicio__category"] or "Outros",
            }
            for item in top_exercicios
        ]

        # === ALUNOS COM ESTATÍSTICAS ===
        alunos_stats = []
        for aluno in alunos:
            treinos_aluno = Treino.objects.filter(
                aluno=aluno, data_criacao__gte=data_inicio
            )
            total = treinos_aluno.count()
            ativos = treinos_aluno.filter(ativo=True).count()
            ultimo = treinos_aluno.order_by("-data_criacao").first()

            # Calcular frequência (treinos por semana esperados vs realizados)
            dias_periodo = (hoje - data_inicio.replace(tzinfo=None)).days
            semanas = max(dias_periodo / 7, 1)
            frequencia = min(
                round((total / semanas / 5) * 100, 1), 100
            )  # Assumindo meta de 5 treinos/semana

            alunos_stats.append(
                {
                    "id": aluno.id,
                    "nome": f"{aluno.user.first_name} {aluno.user.last_name}".strip()
                    or aluno.user.email,
                    "treinos": total,
                    "frequencia": frequencia,
                    "ultimoTreino": (
                        ultimo.data_criacao.strftime("%Y-%m-%d") if ultimo else None
                    ),
                }
            )

        # Ordenar por treinos
        alunos_stats.sort(key=lambda x: x["treinos"], reverse=True)

        # === TAXA DE FREQUÊNCIA MÉDIA ===
        taxa_frequencia = round(
            sum(a["frequencia"] for a in alunos_stats) / max(len(alunos_stats), 1), 1
        )
        taxa_frequencia_anterior = max(taxa_frequencia - 5, 0)  # Simulado
        variacao_frequencia = taxa_frequencia - taxa_frequencia_anterior

        # === MÉDIA DE PROGRESSO ===
        # Calcular aumento médio de carga
        media_progresso = 12  # Valor simulado - implementar lógica real

        data = {
            # KPIs
            "treinos_criados": total_treinos,
            "variacao_treinos": round(variacao_treinos, 1),
            "taxa_frequencia": taxa_frequencia,
            "variacao_frequencia": round(variacao_frequencia, 1),
            "alunos_ativos": alunos.count(),
            "alunos_total": alunos.count(),
            "media_progresso": media_progresso,
            # Gráficos
            "treinos_por_mes": treinos_por_mes,
            "progresso_carga": progresso_carga,
            "distribuicao_exercicios": distribuicao_exercicios,
            "frequencia_semanal": frequencia_semanal,
            "top_exercicios": top_exercicios_data,
            # Tabela de alunos
            "alunos": alunos_stats,
        }

        return Response(data)


class RelatorioAlunoView(APIView):
    """View para relatórios detalhados do Aluno"""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user

        if user.user_type != "ALUNO":
            return Response(
                {"error": "Acesso negado"}, status=status.HTTP_403_FORBIDDEN
            )

        try:
            aluno = Aluno.objects.get(user=user)
        except Aluno.DoesNotExist:
            return Response(
                {"error": "Perfil de aluno não encontrado"},
                status=status.HTTP_404_NOT_FOUND,
            )

        # Parâmetros
        periodo = request.query_params.get("periodo", "mes")

        hoje = datetime.now()
        if periodo == "semana":
            data_inicio = hoje - timedelta(days=7)
        elif periodo == "trimestre":
            data_inicio = hoje - timedelta(days=90)
        elif periodo == "ano":
            data_inicio = hoje - timedelta(days=365)
        else:
            data_inicio = hoje - timedelta(days=30)

        treinos = Treino.objects.filter(aluno=aluno)
        treinos_periodo = treinos.filter(data_criacao__gte=data_inicio)

        # === EVOLUÇÃO DE CARGA POR EXERCÍCIO ===
        evolucao_carga = []
        exercicios_aluno = (
            ItemTreino.objects.filter(treino__aluno=aluno)
            .values("exercicio_id", "exercicio__nome")
            .distinct()[:5]
        )

        for ex in exercicios_aluno:
            itens = (
                ItemTreino.objects.filter(
                    treino__aluno=aluno,
                    exercicio_id=ex["exercicio_id"],
                    treino__data_criacao__gte=data_inicio,
                )
                .order_by("treino__data_criacao")
                .values("carga", "treino__data_criacao")
            )

            evolucao_carga.append(
                {
                    "exercicio": ex["exercicio__nome"],
                    "dados": [
                        {
                            "data": item["treino__data_criacao"].strftime("%d/%m"),
                            "carga": item["carga"] or 0,
                        }
                        for item in itens
                    ],
                }
            )

        # === PROGRESSO POR CATEGORIA ===
        categorias = (
            ItemTreino.objects.filter(
                treino__aluno=aluno, treino__data_criacao__gte=data_inicio
            )
            .values("exercicio__category")
            .annotate(
                total_exercicios=Count("id"),
                media_carga=Avg("carga"),
                total_series=Sum("series"),
                total_reps=Sum("repeticoes"),
            )
            .order_by("-total_exercicios")
        )

        progresso_categoria = [
            {
                "categoria": item["exercicio__category"] or "Outros",
                "exercicios": item["total_exercicios"],
                "mediaCarga": round(item["media_carga"] or 0, 1),
                "totalSeries": item["total_series"] or 0,
                "totalReps": item["total_reps"] or 0,
            }
            for item in categorias
        ]

        # === HISTÓRICO DE TREINOS ===
        historico = []
        for treino in treinos_periodo.order_by("-data_criacao")[:20]:
            itens = ItemTreino.objects.filter(treino=treino)
            historico.append(
                {
                    "id": treino.id,
                    "nome": treino.nome,
                    "data": treino.data_criacao.strftime("%Y-%m-%d"),
                    "categoria": treino.tipo or "Geral",
                    "exercicios": itens.count(),
                    "ativo": treino.ativo,
                    "detalhes": [
                        {
                            "exercicio": item.exercicio.nome,
                            "series": item.series,
                            "reps": item.repeticoes,
                            "carga": item.carga or 0,
                        }
                        for item in itens[:5]
                    ],
                }
            )

        # === ESTATÍSTICAS GERAIS ===
        total_treinos = treinos.count()
        treinos_ativos = treinos.filter(ativo=True).count()

        # Cálculo de sequência de dias (streak)
        sequencia = 0
        # Implementar lógica real de sequência

        # Tempo total estimado
        total_exercicios = ItemTreino.objects.filter(treino__aluno=aluno).count()
        tempo_estimado = total_exercicios * 3  # 3 minutos por exercício em média

        data = {
            "total_treinos": total_treinos,
            "treinos_ativos": treinos_ativos,
            "treinos_periodo": treinos_periodo.count(),
            "sequencia_dias": sequencia,
            "tempo_total_minutos": tempo_estimado,
            "evolucao_carga": evolucao_carga,
            "progresso_categoria": progresso_categoria,
            "historico": historico,
        }

        return Response(data)


class RelatorioAcademiaView(APIView):
    """View para relatórios detalhados da Academia"""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user

        if user.user_type not in ["ADMIN", "ADMIN_SISTEMA"]:
            return Response(
                {"error": "Acesso negado"}, status=status.HTTP_403_FORBIDDEN
            )

        # Filtrar por academia se for admin
        if user.user_type == "ADMIN" and user.academia:
            academia = user.academia
            alunos = Aluno.objects.filter(academia=academia)
            personais = PersonalTrainer.objects.filter(user__academia=academia)
            treinos = Treino.objects.filter(aluno__academia=academia)
        else:
            alunos = Aluno.objects.all()
            personais = PersonalTrainer.objects.all()
            treinos = Treino.objects.all()

        hoje = datetime.now()
        periodo = request.query_params.get("periodo", "mes")

        if periodo == "semana":
            data_inicio = hoje - timedelta(days=7)
        elif periodo == "trimestre":
            data_inicio = hoje - timedelta(days=90)
        elif periodo == "ano":
            data_inicio = hoje - timedelta(days=365)
        else:
            data_inicio = hoje - timedelta(days=30)

        # === MÉTRICAS PRINCIPAIS ===
        total_alunos = alunos.count()
        total_personais = personais.count()
        total_treinos = treinos.count()
        treinos_periodo = treinos.filter(data_criacao__gte=data_inicio).count()

        # === TREINOS MAIS REALIZADOS (RANKING) ===
        treinos_ranking = (
            treinos.values("nome").annotate(total=Count("id")).order_by("-total")[:10]
        )

        treinos_top = [
            {"nome": item["nome"], "total": item["total"]} for item in treinos_ranking
        ]

        # === CATEGORIAS MAIS USADAS ===
        categorias = (
            ItemTreino.objects.filter(treino__in=treinos)
            .values("exercicio__category")
            .annotate(total=Count("id"))
            .order_by("-total")
        )

        cores = ["#ef4444", "#3b82f6", "#22c55e", "#f59e0b", "#8b5cf6", "#ec4899"]
        categorias_ranking = [
            {
                "categoria": item["exercicio__category"] or "Outros",
                "total": item["total"],
                "cor": cores[i % len(cores)],
            }
            for i, item in enumerate(categorias[:6])
        ]

        # === CRESCIMENTO MENSAL ===
        crescimento = []
        for i in range(5, -1, -1):
            mes_inicio = (hoje - timedelta(days=30 * i)).replace(day=1)
            if i > 0:
                mes_fim = (hoje - timedelta(days=30 * (i - 1))).replace(day=1)
            else:
                mes_fim = hoje + timedelta(days=1)

            novos_alunos = alunos.filter(
                user__date_joined__gte=mes_inicio, user__date_joined__lt=mes_fim
            ).count()

            novos_treinos = treinos.filter(
                data_criacao__gte=mes_inicio, data_criacao__lt=mes_fim
            ).count()

            crescimento.append(
                {
                    "mes": mes_inicio.strftime("%b"),
                    "alunos": novos_alunos,
                    "treinos": novos_treinos,
                }
            )

        # === PERSONAIS MAIS ATIVOS ===
        personais_ativos = []
        for p in personais:
            treinos_p = Treino.objects.filter(personal_criador=p).count()
            alunos_p = Aluno.objects.filter(personal_responsavel=p).count()
            personais_ativos.append(
                {
                    "id": p.id,
                    "nome": f"{p.user.first_name} {p.user.last_name}".strip()
                    or p.user.email,
                    "treinos": treinos_p,
                    "alunos": alunos_p,
                }
            )

        personais_ativos.sort(key=lambda x: x["treinos"], reverse=True)

        # === MÉTRICAS DE USO ===
        dias_periodo = (hoje - data_inicio.replace(tzinfo=None)).days
        media_treinos_dia = round(treinos_periodo / max(dias_periodo, 1), 1)

        # Taxa de retenção (simulada)
        taxa_retencao = 95.0

        data = {
            "total_alunos": total_alunos,
            "total_personais": total_personais,
            "total_treinos": total_treinos,
            "treinos_periodo": treinos_periodo,
            "media_treinos_dia": media_treinos_dia,
            "taxa_retencao": taxa_retencao,
            "treinos_ranking": treinos_top,
            "categorias_ranking": categorias_ranking,
            "crescimento": crescimento,
            "personais_ativos": personais_ativos[:10],
        }

        return Response(data)


class RelatorioAdminView(APIView):
    """View para relatórios detalhados do Admin do Sistema"""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user

        if user.user_type != "ADMIN_SISTEMA":
            return Response(
                {"error": "Acesso negado"}, status=status.HTTP_403_FORBIDDEN
            )

        hoje = datetime.now()
        periodo = request.query_params.get("periodo", "mes")

        if periodo == "semana":
            data_inicio = hoje - timedelta(days=7)
        elif periodo == "trimestre":
            data_inicio = hoje - timedelta(days=90)
        elif periodo == "ano":
            data_inicio = hoje - timedelta(days=365)
        else:
            data_inicio = hoje - timedelta(days=30)

        # === DADOS GERAIS DO SISTEMA ===
        total_usuarios = User.objects.count()
        total_academias = Academia.objects.count()
        total_personais = PersonalTrainer.objects.count()
        total_alunos = Aluno.objects.count()
        total_treinos = Treino.objects.count()
        total_exercicios = Exercicio.objects.count()

        # === KPIs PRINCIPAIS ===
        usuarios_ativos = User.objects.filter(is_active=True).count()
        taxa_usuarios_ativos = round(
            (usuarios_ativos / max(total_usuarios, 1)) * 100, 1
        )

        treinos_periodo = Treino.objects.filter(data_criacao__gte=data_inicio).count()
        treinos_por_dia = round(
            treinos_periodo / max((hoje - data_inicio.replace(tzinfo=None)).days, 1), 1
        )

        # === CRESCIMENTO DE USUÁRIOS ===
        crescimento = []
        for i in range(11, -1, -1):  # 12 meses
            mes_inicio = (hoje - timedelta(days=30 * i)).replace(day=1)
            if i > 0:
                mes_fim = (hoje - timedelta(days=30 * (i - 1))).replace(day=1)
            else:
                mes_fim = hoje + timedelta(days=1)

            alunos_mes = Aluno.objects.filter(
                user__date_joined__gte=mes_inicio, user__date_joined__lt=mes_fim
            ).count()

            personais_mes = PersonalTrainer.objects.filter(
                user__date_joined__gte=mes_inicio, user__date_joined__lt=mes_fim
            ).count()

            academias_mes = (
                Academia.objects.filter(
                    created_at__gte=mes_inicio, created_at__lt=mes_fim
                ).count()
                if hasattr(Academia, "created_at")
                else 0
            )

            crescimento.append(
                {
                    "mes": mes_inicio.strftime("%b/%y"),
                    "alunos": alunos_mes,
                    "personais": personais_mes,
                    "academias": academias_mes,
                }
            )

        # === VOLUME DE TREINOS ===
        volume_treinos = []
        for i in range(11, -1, -1):
            mes_inicio = (hoje - timedelta(days=30 * i)).replace(day=1)
            if i > 0:
                mes_fim = (hoje - timedelta(days=30 * (i - 1))).replace(day=1)
            else:
                mes_fim = hoje + timedelta(days=1)

            count = Treino.objects.filter(
                data_criacao__gte=mes_inicio, data_criacao__lt=mes_fim
            ).count()

            volume_treinos.append(
                {"mes": mes_inicio.strftime("%b/%y"), "treinos": count}
            )

        # === TOP ACADEMIAS ===
        top_academias = []
        for academia in Academia.objects.all():
            alunos_acad = Aluno.objects.filter(academia=academia).count()
            personais_acad = PersonalTrainer.objects.filter(
                user__academia=academia
            ).count()
            treinos_acad = Treino.objects.filter(aluno__academia=academia).count()

            top_academias.append(
                {
                    "id": academia.id,
                    "nome": academia.nome_fantasia,
                    "alunos": alunos_acad,
                    "personais": personais_acad,
                    "treinos": treinos_acad,
                }
            )

        top_academias.sort(key=lambda x: x["alunos"], reverse=True)

        # === EXERCÍCIOS MAIS POPULARES ===
        exercicios_populares = (
            ItemTreino.objects.values("exercicio__nome", "exercicio__category")
            .annotate(total=Count("id"))
            .order_by("-total")[:10]
        )

        exercicios_top = [
            {
                "exercicio": item["exercicio__nome"],
                "categoria": item["exercicio__category"] or "Outros",
                "usos": item["total"],
            }
            for item in exercicios_populares
        ]

        # === DISTRIBUIÇÃO POR TIPO DE USUÁRIO ===
        distribuicao_usuarios = [
            {"tipo": "Alunos", "total": total_alunos, "cor": "#3b82f6"},
            {"tipo": "Personal Trainers", "total": total_personais, "cor": "#22c55e"},
            {
                "tipo": "Admins Academia",
                "total": User.objects.filter(user_type="ADMIN").count(),
                "cor": "#f59e0b",
            },
            {
                "tipo": "Admins Sistema",
                "total": User.objects.filter(user_type="ADMIN_SISTEMA").count(),
                "cor": "#ef4444",
            },
        ]

        # === PERFORMANCE DO SISTEMA ===
        performance = {
            "total_requisicoes": 0,  # Implementar com logging
            "tempo_medio_resposta": 0,
            "uptime": 99.9,
            "erros_24h": 0,
        }

        data = {
            # Totais
            "total_usuarios": total_usuarios,
            "total_academias": total_academias,
            "total_personais": total_personais,
            "total_alunos": total_alunos,
            "total_treinos": total_treinos,
            "total_exercicios": total_exercicios,
            # KPIs
            "usuarios_ativos": usuarios_ativos,
            "taxa_usuarios_ativos": taxa_usuarios_ativos,
            "treinos_periodo": treinos_periodo,
            "treinos_por_dia": treinos_por_dia,
            # Gráficos
            "crescimento_usuarios": crescimento,
            "volume_treinos": volume_treinos,
            "distribuicao_usuarios": distribuicao_usuarios,
            # Rankings
            "top_academias": top_academias[:10],
            "exercicios_populares": exercicios_top,
            # Performance
            "performance": performance,
        }

        return Response(data)
