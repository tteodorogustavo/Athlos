from django.contrib import admin
from .models import Exercicio, Treino, ItemTreino


class ItemTreinoInline(admin.TabularInline):
    model = ItemTreino
    extra = 1 

@admin.register(Exercicio)
class ExercicioAdmin(admin.ModelAdmin):
    list_display = ('nome', 'level', 'equipment', 'category')
    search_fields = ('nome', 'category', 'equipment') 
    list_filter = ('level', 'equipment', 'category')

@admin.register(Treino)
class TreinoAdmin(admin.ModelAdmin):
    """
    Customiza a tela de admin para a Ficha de Treino.
    """
    list_display = ('nome_treino', 'aluno', 'personal_criador', 'ativo')
    list_filter = ('ativo', 'personal_criador')

    # possibilita editar os Itens de Treino diretamente na página do Treino
    inlines = [ItemTreinoInline]