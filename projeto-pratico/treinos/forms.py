from django import forms
from django.forms import inlineformset_factory
from .models import Treino, ItemTreino, Exercicio
from academias.models import Aluno, PersonalTrainer


class TreinoForm(forms.ModelForm):
    class Meta:
        model = Treino
        fields = ["aluno", "nome_treino", "ativo"]
        widgets = {
            "aluno": forms.Select(attrs={"class": "form-select"}),
            "nome_treino": forms.TextInput(
                attrs={
                    "class": "form-control",
                    "placeholder": "Ex: Treino A - Peito e Tríceps",
                }
            ),
            "ativo": forms.CheckboxInput(attrs={"class": "form-check-input"}),
        }
        labels = {
            "aluno": "Aluno",
            "nome_treino": "Nome do Treino",
            "ativo": "Ativo",
        }

    def __init__(self, *args, **kwargs):
        self.request_user = kwargs.pop("request_user", None)
        super().__init__(*args, **kwargs)

        # Se o usuário logado é PERSONAL, filtrar apenas seus alunos
        if self.request_user and self.request_user.user_type == "PERSONAL":
            try:
                personal = self.request_user.personaltrainer
                # Filtrar apenas alunos deste personal
                self.fields["aluno"].queryset = personal.alunos.all()
            except PersonalTrainer.DoesNotExist:
                self.fields["aluno"].queryset = Aluno.objects.none()

    def save(self, commit=True):
        treino = super().save(commit=False)
        # Automaticamente definir o personal_criador como o usuário logado
        if self.request_user and self.request_user.user_type == "PERSONAL":
            try:
                treino.personal_criador = self.request_user.personaltrainer
            except PersonalTrainer.DoesNotExist:
                pass
        if commit:
            treino.save()
        return treino


class ItemTreinoForm(forms.ModelForm):
    class Meta:
        model = ItemTreino
        fields = ["exercicio", "series", "repeticoes", "carga_kg"]
        widgets = {
            "exercicio": forms.Select(attrs={"class": "form-select exercicio-select"}),
            "series": forms.NumberInput(
                attrs={"class": "form-control", "placeholder": "2"}
            ),
            "repeticoes": forms.TextInput(
                attrs={"class": "form-control", "placeholder": "10-12"}
            ),
            "carga_kg": forms.NumberInput(
                attrs={"class": "form-control", "placeholder": "20"}
            ),
        }
        labels = {
            "exercicio": "Exercício",
            "series": "Séries",
            "repeticoes": "Repetições",
            "carga_kg": "Carga (kg)",
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Ordenar exercícios alfabeticamente
        self.fields["exercicio"].queryset = Exercicio.objects.all().order_by("nome")


# Criar o formset inline para ItemTreino
ItemTreinoFormSet = inlineformset_factory(
    Treino,
    ItemTreino,
    form=ItemTreinoForm,
    extra=1,  # Número de formulários vazios extras
    can_delete=True,  # Permite deletar itens
    min_num=0,  # Mínimo de formulários obrigatórios
    validate_min=False,
)
