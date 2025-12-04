from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings
from .models import Aluno, PersonalTrainer


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def criar_perfil_usuario(sender, instance, created, **kwargs):
    """
    Signal que cria automaticamente o perfil de Aluno ou PersonalTrainer
    quando um usuário é criado com o tipo correspondente.
    """
    if created:
        if instance.user_type == "ALUNO":
            Aluno.objects.get_or_create(user=instance)

        elif instance.user_type == "PERSONAL":
            PersonalTrainer.objects.get_or_create(
                user=instance,
                defaults={
                    "cref": f"CREF-{instance.id:06d}",
                    "especialidade": "A definir",
                },
            )


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def atualizar_perfil_usuario(sender, instance, created, **kwargs):
    """
    Signal que gerencia a mudança de tipo de usuário.
    Remove ou cria perfis conforme necessário.
    """
    if not created:
        if instance.user_type == "ALUNO":
            Aluno.objects.get_or_create(user=instance)
            try:
                instance.personaltrainer.delete()
            except PersonalTrainer.DoesNotExist:
                pass

        elif instance.user_type == "PERSONAL":
            PersonalTrainer.objects.get_or_create(
                user=instance,
                defaults={
                    "cref": f"CREF-{instance.id:06d}",
                    "especialidade": "A definir",
                },
            )
            # Remove perfil de Aluno se existir
            try:
                instance.aluno.delete()
            except Aluno.DoesNotExist:
                pass

        elif instance.user_type in ["ADMIN", "ADMIN_SISTEMA"]:
            try:
                instance.aluno.delete()
            except Aluno.DoesNotExist:
                pass
            try:
                instance.personaltrainer.delete()
            except PersonalTrainer.DoesNotExist:
                pass
