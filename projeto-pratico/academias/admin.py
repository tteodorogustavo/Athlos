from django.contrib import admin
from .models import Academia, PersonalTrainer, Aluno

@admin.register(Academia)
class AcademiaAdmin(admin.ModelAdmin):
    list_display = ('nome_fantasia', 'cnpj', 'endereco', 'telefone')
    search_fields = ('nome_fantasia', 'cnpj')

admin.site.register(PersonalTrainer)
admin.site.register(Aluno)