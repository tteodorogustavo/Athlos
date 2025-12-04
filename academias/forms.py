from django import forms
from .models import Academia, Aluno, PersonalTrainer
from usuarios.models import CustomUser


class AcademiaForm(forms.ModelForm):
    class Meta:
        model = Academia
        fields = ["nome_fantasia", "cnpj", "endereco", "telefone"]
        widgets = {
            "nome_fantasia": forms.TextInput(attrs={"class": "form-control"}),
            "cnpj": forms.TextInput(attrs={"class": "form-control"}),
            "endereco": forms.TextInput(attrs={"class": "form-control"}),
            "telefone": forms.TextInput(attrs={"class": "form-control"}),
        }


class AlunoForm(forms.ModelForm):
    # Campos do usuário
    email = forms.EmailField(
        required=True,
        widget=forms.EmailInput(attrs={"class": "form-control"}),
    )
    first_name = forms.CharField(
        max_length=150,
        required=True,
        label="Nome",
        widget=forms.TextInput(attrs={"class": "form-control"}),
    )
    last_name = forms.CharField(
        max_length=150,
        required=True,
        label="Sobrenome",
        widget=forms.TextInput(attrs={"class": "form-control"}),
    )
    password = forms.CharField(
        required=False,
        label="Senha",
        widget=forms.PasswordInput(attrs={"class": "form-control"}),
        help_text="Deixe em branco para manter a senha atual (apenas edição)",
    )

    class Meta:
        model = Aluno
        fields = ["personal_responsavel", "academia", "data_nascimento", "objetivo"]
        widgets = {
            "personal_responsavel": forms.Select(attrs={"class": "form-select"}),
            "academia": forms.Select(attrs={"class": "form-select"}),
            "data_nascimento": forms.DateInput(
                attrs={"class": "form-control", "type": "date"}
            ),
            "objetivo": forms.TextInput(attrs={"class": "form-control"}),
        }

    def __init__(self, *args, **kwargs):
        self.request_user = kwargs.pop("request_user", None)
        super().__init__(*args, **kwargs)

        # Se está editando, preencher campos do usuário
        if self.instance and self.instance.pk:
            self.fields["email"].initial = self.instance.user.email
            self.fields["first_name"].initial = self.instance.user.first_name
            self.fields["last_name"].initial = self.instance.user.last_name
            self.fields["password"].required = False
            self.fields["password"].help_text = (
                "Deixe em branco para manter a senha atual"
            )
        else:
            self.fields["password"].required = True
            self.fields["password"].help_text = "Senha para o novo aluno"

        # Se o usuário logado é PERSONAL, filtrar apenas ele mesmo
        if self.request_user and self.request_user.user_type == "PERSONAL":
            try:
                personal = self.request_user.personaltrainer
                self.fields["personal_responsavel"].queryset = (
                    PersonalTrainer.objects.filter(pk=personal.pk)
                )
                self.fields["personal_responsavel"].initial = personal
                self.fields["personal_responsavel"].disabled = (
                    True  # Desabilita o campo
                )
                self.fields["personal_responsavel"].widget.attrs["readonly"] = True
            except PersonalTrainer.DoesNotExist:
                self.fields["personal_responsavel"].queryset = (
                    PersonalTrainer.objects.none()
                )

    def save(self, commit=True):
        aluno = super().save(commit=False)

        # Se é novo aluno, criar o usuário
        if not aluno.pk:
            user = CustomUser.objects.create_user(
                username=self.cleaned_data["email"].split("@")[0]
                + str(CustomUser.objects.count()),
                email=self.cleaned_data["email"],
                first_name=self.cleaned_data["first_name"],
                last_name=self.cleaned_data["last_name"],
                password=self.cleaned_data["password"],
                user_type="ALUNO",
            )
            aluno.user = user
        else:
            # Atualizar dados do usuário existente
            user = aluno.user
            user.email = self.cleaned_data["email"]
            user.first_name = self.cleaned_data["first_name"]
            user.last_name = self.cleaned_data["last_name"]
            if self.cleaned_data["password"]:
                user.set_password(self.cleaned_data["password"])
            user.save()

        if commit:
            aluno.save()

        return aluno
