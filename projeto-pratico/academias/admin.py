from django.contrib import admin
from .models import Academia, PersonalTrainer, Aluno


@admin.register(Academia)
class AcademiaAdmin(admin.ModelAdmin):
    list_display = ("nome_fantasia", "cnpj", "endereco", "telefone", "data_criacao")
    search_fields = ("nome_fantasia", "cnpj", "endereco")
    list_filter = ("data_criacao",)
    ordering = ("-data_criacao",)


@admin.register(PersonalTrainer)
class PersonalTrainerAdmin(admin.ModelAdmin):
    list_display = ("user", "cref", "especialidade", "get_academia")
    search_fields = ("user__first_name", "user__last_name", "cref", "user__email")
    list_filter = ("especialidade", "user__academia", "user__date_joined")
    ordering = ("user__first_name",)

    def get_academia(self, obj):
        return obj.user.academia

    get_academia.short_description = "Academia"


@admin.register(Aluno)
class AlunoAdmin(admin.ModelAdmin):
    list_display = ("user", "personal_responsavel", "data_nascimento", "get_academia")
    search_fields = ("user__first_name", "user__last_name", "user__email", "objetivo")
    list_filter = (
        "personal_responsavel",
        "user__academia",
        "data_nascimento",
        "user__date_joined",
    )
    ordering = ("-user__date_joined",)

    def get_academia(self, obj):
        return obj.user.academia

    get_academia.short_description = "Academia"
