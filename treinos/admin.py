from django.contrib import admin
from .models import Exercicio, Treino, ItemTreino


class ItemTreinoInline(admin.TabularInline):
    model = ItemTreino
    extra = 1


@admin.register(Exercicio)
class ExercicioAdmin(admin.ModelAdmin):
    list_display = ("nome", "level", "equipment", "category")
    search_fields = ("nome", "category", "equipment")
    list_filter = ("level", "equipment", "category")


@admin.register(Treino)
class TreinoAdmin(admin.ModelAdmin):
    """
    Customiza a tela de admin para a Ficha de Treino.
    """

    list_display = ("nome_treino", "aluno", "personal_criador", "data_criacao", "ativo")
    list_filter = (
        "ativo",
        "personal_criador",
        "data_criacao",
        "aluno__user__academia",
    )
    search_fields = (
        "nome_treino",
        "aluno__user__first_name",
        "aluno__user__last_name",
        "personal_criador__user__first_name",
        "personal_criador__user__last_name",
    )
    ordering = ("-data_criacao",)

    # possibilita editar os Itens de Treino diretamente na página do Treino
    inlines = [ItemTreinoInline]
