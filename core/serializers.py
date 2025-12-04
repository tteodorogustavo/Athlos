from rest_framework import serializers
from django.contrib.auth import get_user_model
from academias.models import Academia, PersonalTrainer, Aluno
from treinos.models import Exercicio, Treino, ItemTreino

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """Serializer para o modelo de usuário"""

    class Meta:
        model = User
        fields = ["id", "email", "first_name", "last_name", "user_type", "is_active"]
        read_only_fields = ["id", "is_active"]


class UserDetailSerializer(serializers.ModelSerializer):
    """Serializer detalhado para o modelo de usuário"""

    full_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "first_name",
            "last_name",
            "user_type",
            "full_name",
            "date_joined",
        ]
        read_only_fields = ["id", "date_joined"]

    def get_full_name(self, obj):
        return obj.get_full_name()


class AcademiaSerializer(serializers.ModelSerializer):
    """Serializer para o modelo Academia"""

    total_alunos = serializers.SerializerMethodField()
    total_personais = serializers.SerializerMethodField()

    class Meta:
        model = Academia
        fields = [
            "id",
            "nome_fantasia",
            "cnpj",
            "endereco",
            "telefone",
            "data_criacao",
            "total_alunos",
            "total_personais",
        ]
        read_only_fields = ["id", "data_criacao"]

    def get_total_alunos(self, obj):
        return obj.alunos.count()

    def get_total_personais(self, obj):
        return User.objects.filter(academia=obj, user_type="PERSONAL").count()


class PersonalTrainerSerializer(serializers.ModelSerializer):
    """Serializer para o modelo PersonalTrainer"""

    id = serializers.IntegerField(source="user.id", read_only=True)
    user = UserSerializer(read_only=True)
    nome = serializers.SerializerMethodField()
    email = serializers.SerializerMethodField()
    total_alunos = serializers.SerializerMethodField()
    total_treinos = serializers.SerializerMethodField()

    class Meta:
        model = PersonalTrainer
        fields = [
            "id",
            "user",
            "cref",
            "especialidade",
            "nome",
            "email",
            "total_alunos",
            "total_treinos",
        ]

    def get_nome(self, obj):
        return obj.user.get_full_name()

    def get_email(self, obj):
        return obj.user.email

    def get_total_alunos(self, obj):
        return obj.alunos.count()

    def get_total_treinos(self, obj):
        return obj.treinos_criados.count()


class PersonalTrainerCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer para criação e atualização de personal trainers"""

    # Campos do usuário para criação
    email = serializers.EmailField(write_only=True, required=False)
    password = serializers.CharField(write_only=True, required=False)
    first_name = serializers.CharField(write_only=True, required=False)
    last_name = serializers.CharField(write_only=True, required=False)

    # Campos aninhados para leitura
    user = UserSerializer(read_only=True)

    class Meta:
        model = PersonalTrainer
        fields = [
            "user",
            "email",
            "password",
            "first_name",
            "last_name",
            "cref",
            "especialidade",
        ]

    def create(self, validated_data):
        # Extrair dados do usuário
        email = validated_data.pop("email")
        password = validated_data.pop("password")
        first_name = validated_data.pop("first_name", "")
        last_name = validated_data.pop("last_name", "")

        # Criar usuário
        user = User.objects.create_user(
            username=email,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name,
            user_type="PERSONAL",
        )

        # Criar personal trainer
        personal = PersonalTrainer.objects.create(user=user, **validated_data)
        return personal

    def update(self, instance, validated_data):
        # Atualizar dados do usuário se fornecidos
        user_data = {}
        if "first_name" in validated_data:
            user_data["first_name"] = validated_data.pop("first_name")
        if "last_name" in validated_data:
            user_data["last_name"] = validated_data.pop("last_name")

        # Remover campos que não devem ser atualizados
        validated_data.pop("email", None)
        validated_data.pop("password", None)

        if user_data:
            for attr, value in user_data.items():
                setattr(instance.user, attr, value)
            instance.user.save()

        # Atualizar dados do personal
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        return instance


class AlunoListSerializer(serializers.ModelSerializer):
    """Serializer para listagem de alunos"""

    id = serializers.IntegerField(source="user.id", read_only=True)
    user = UserSerializer(read_only=True)
    nome = serializers.SerializerMethodField()
    email = serializers.SerializerMethodField()
    academia_nome = serializers.SerializerMethodField()
    total_treinos = serializers.SerializerMethodField()
    idade = serializers.SerializerMethodField()

    class Meta:
        model = Aluno
        fields = [
            "id",
            "user",
            "user_id",
            "nome",
            "email",
            "data_nascimento",
            "objetivo",
            "academia",
            "academia_nome",
            "total_treinos",
            "idade",
        ]

    def get_nome(self, obj):
        return obj.user.get_full_name()

    def get_email(self, obj):
        return obj.user.email

    def get_academia_nome(self, obj):
        return obj.academia.nome_fantasia if obj.academia else None

    def get_total_treinos(self, obj):
        return obj.treinos.count()

    def get_idade(self, obj):
        if obj.data_nascimento:
            from datetime import date

            today = date.today()
            return (
                today.year
                - obj.data_nascimento.year
                - (
                    (today.month, today.day)
                    < (obj.data_nascimento.month, obj.data_nascimento.day)
                )
            )
        return None


class AlunoDetailSerializer(serializers.ModelSerializer):
    """Serializer detalhado para alunos"""

    user = UserDetailSerializer(read_only=True)
    personal_responsavel = PersonalTrainerSerializer(read_only=True)
    academia = AcademiaSerializer(read_only=True)
    total_treinos = serializers.SerializerMethodField()

    class Meta:
        model = Aluno
        fields = [
            "user",
            "personal_responsavel",
            "academia",
            "data_nascimento",
            "objetivo",
            "total_treinos",
        ]

    def get_total_treinos(self, obj):
        return obj.treinos.count()


class AlunoCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer para criação e atualização de alunos"""

    # Campos do usuário para criação
    email = serializers.EmailField(write_only=True, required=False)
    password = serializers.CharField(write_only=True, required=False)
    first_name = serializers.CharField(write_only=True, required=False)
    last_name = serializers.CharField(write_only=True, required=False)

    # Campos aninhados para atualização
    user = UserSerializer(read_only=True)

    class Meta:
        model = Aluno
        fields = [
            "user",
            "email",
            "password",
            "first_name",
            "last_name",
            "personal_responsavel",
            "academia",
            "data_nascimento",
            "objetivo",
        ]

    def create(self, validated_data):
        # Extrair dados do usuário
        email = validated_data.pop("email")
        password = validated_data.pop("password")
        first_name = validated_data.pop("first_name", "")
        last_name = validated_data.pop("last_name", "")

        # Criar usuário
        user = User.objects.create_user(
            username=email,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name,
            user_type="ALUNO",
        )

        # Criar aluno
        aluno = Aluno.objects.create(user=user, **validated_data)
        return aluno

    def update(self, instance, validated_data):
        # Atualizar dados do usuário se fornecidos
        user_data = {}
        if "first_name" in validated_data:
            user_data["first_name"] = validated_data.pop("first_name")
        if "last_name" in validated_data:
            user_data["last_name"] = validated_data.pop("last_name")

        # Remover campos que não devem ser atualizados
        validated_data.pop("email", None)
        validated_data.pop("password", None)

        if user_data:
            for attr, value in user_data.items():
                setattr(instance.user, attr, value)
            instance.user.save()

        # Atualizar dados do aluno
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        return instance


class ExercicioSerializer(serializers.ModelSerializer):
    """Serializer para o modelo Exercicio"""

    class Meta:
        model = Exercicio
        fields = [
            "id",
            "nome",
            "slug",
            "force",
            "level",
            "mechanic",
            "equipment",
            "category",
            "primary_muscles",
            "secondary_muscles",
            "instructions",
            "images",
        ]


class ExercicioListSerializer(serializers.ModelSerializer):
    """Serializer simplificado para listagem de exercícios"""

    class Meta:
        model = Exercicio
        fields = ["id", "nome", "category", "equipment", "level", "primary_muscles"]


class ItemTreinoSerializer(serializers.ModelSerializer):
    """Serializer para o modelo ItemTreino"""

    exercicio = ExercicioListSerializer(read_only=True)
    exercicio_id = serializers.PrimaryKeyRelatedField(
        queryset=Exercicio.objects.all(), source="exercicio", write_only=True
    )

    class Meta:
        model = ItemTreino
        fields = ["id", "exercicio", "exercicio_id", "series", "repeticoes", "carga_kg"]


class TreinoListSerializer(serializers.ModelSerializer):
    """Serializer para listagem de treinos"""

    aluno_nome = serializers.SerializerMethodField()
    personal_nome = serializers.SerializerMethodField()
    total_exercicios = serializers.SerializerMethodField()

    class Meta:
        model = Treino
        fields = [
            "id",
            "nome_treino",
            "aluno",
            "aluno_nome",
            "personal_criador",
            "personal_nome",
            "data_criacao",
            "ativo",
            "total_exercicios",
        ]

    def get_aluno_nome(self, obj):
        return obj.aluno.user.get_full_name()

    def get_personal_nome(self, obj):
        return (
            obj.personal_criador.user.get_full_name() if obj.personal_criador else None
        )

    def get_total_exercicios(self, obj):
        return obj.itens.count()


class TreinoDetailSerializer(serializers.ModelSerializer):
    """Serializer detalhado para treinos"""

    aluno = AlunoListSerializer(read_only=True)
    personal_criador = PersonalTrainerSerializer(read_only=True)
    itens = ItemTreinoSerializer(many=True, read_only=True)

    class Meta:
        model = Treino
        fields = [
            "id",
            "nome_treino",
            "aluno",
            "personal_criador",
            "data_criacao",
            "ativo",
            "itens",
        ]


class TreinoCreateSerializer(serializers.ModelSerializer):
    """Serializer para criação de treinos"""

    itens = ItemTreinoSerializer(many=True)

    class Meta:
        model = Treino
        fields = ["nome_treino", "aluno", "ativo", "itens"]

    def create(self, validated_data):
        itens_data = validated_data.pop("itens")
        request = self.context.get("request")

        # Define o personal_criador como o usuário logado
        if request and request.user.user_type == "PERSONAL":
            try:
                personal = PersonalTrainer.objects.get(user=request.user)
                validated_data["personal_criador"] = personal
            except PersonalTrainer.DoesNotExist:
                pass

        treino = Treino.objects.create(**validated_data)

        for item_data in itens_data:
            ItemTreino.objects.create(treino=treino, **item_data)

        return treino

    def update(self, instance, validated_data):
        itens_data = validated_data.pop("itens", None)

        instance.nome_treino = validated_data.get("nome_treino", instance.nome_treino)
        instance.aluno = validated_data.get("aluno", instance.aluno)
        instance.ativo = validated_data.get("ativo", instance.ativo)
        instance.save()

        if itens_data is not None:
            # Remove os itens antigos e cria os novos
            instance.itens.all().delete()
            for item_data in itens_data:
                ItemTreino.objects.create(treino=instance, **item_data)

        return instance


# Serializers para Dashboard e Relatórios
class DashboardPersonalSerializer(serializers.Serializer):
    """Serializer para dados do dashboard do Personal"""

    total_alunos = serializers.IntegerField()
    total_academias = serializers.IntegerField()
    total_treinos = serializers.IntegerField()
    taxa_atividade = serializers.FloatField()
    treinos_por_mes = serializers.ListField()
    top_exercicios = serializers.ListField()
    alunos_recentes = AlunoListSerializer(many=True)


class DashboardAlunoSerializer(serializers.Serializer):
    """Serializer para dados do dashboard do Aluno"""

    total_treinos = serializers.IntegerField()
    sequencia_dias = serializers.IntegerField()
    tempo_total_minutos = serializers.IntegerField()
    meta_semanal_atual = serializers.IntegerField()
    meta_semanal_total = serializers.IntegerField()
    treinos = TreinoListSerializer(many=True)
    progresso_carga = serializers.ListField()


class DashboardAcademiaSerializer(serializers.Serializer):
    """Serializer para dados do dashboard da Academia"""

    total_alunos = serializers.IntegerField()
    total_personais = serializers.IntegerField()
    total_treinos = serializers.IntegerField()
    taxa_retencao = serializers.FloatField()
    crescimento_alunos = serializers.ListField()
    personais = PersonalTrainerSerializer(many=True)


class DashboardAdminSerializer(serializers.Serializer):
    """Serializer para dados do dashboard do Admin"""

    total_usuarios = serializers.IntegerField()
    total_academias = serializers.IntegerField()
    total_personais = serializers.IntegerField()
    total_treinos = serializers.IntegerField()
    crescimento_usuarios = serializers.ListField()
    volume_treinos = serializers.ListField()
    top_academias = AcademiaSerializer(many=True)
