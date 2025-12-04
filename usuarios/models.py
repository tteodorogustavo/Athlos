# usuarios/models.py
from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission


class CustomUser(AbstractUser):

    class TipoUsuario(models.TextChoices):
        ADMIN_SISTEMA = "ADMIN_SISTEMA", "Admin do Sistema"
        ADMIN_ACADEMIA = "ADMIN", "Admin da Academia"
        PERSONAL_TRAINER = "PERSONAL", "Personal Trainer"
        ALUNO = "ALUNO", "Aluno"

    email = models.EmailField(unique=True, verbose_name="Endereço de e-mail")
    user_type = models.CharField(
        max_length=20,
        choices=TipoUsuario.choices,
        default=TipoUsuario.ALUNO,
        verbose_name="Tipo de Usuário",
    )
    academia = models.ForeignKey(
        "academias.Academia",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        verbose_name="Academia",
    )

    # correção do conflito entre CustomUser e Group/Permission
    groups = models.ManyToManyField(
        Group,
        verbose_name="groups",
        blank=True,
        help_text=(
            "The groups this user belongs to. A user will get all permissions "
            "granted to each of their groups."
        ),
        related_name="customuser_groups",
        related_query_name="user",
    )
    user_permissions = models.ManyToManyField(
        Permission,
        verbose_name="user permissions",
        blank=True,
        help_text="Specific permissions for this user.",
        related_name="customuser_permissions",
        related_query_name="user",
    )

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username", "first_name", "last_name"]

    def save(self, *args, **kwargs):
        # Gera username automaticamente a partir do email se estiver vazio
        if not self.username:
            self.username = self.email.split("@")[0]
            # Garante que o username seja único
            base_username = self.username
            counter = 1
            while CustomUser.objects.filter(username=self.username).exists():
                self.username = f"{base_username}{counter}"
                counter += 1
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.get_user_type_display()})"
