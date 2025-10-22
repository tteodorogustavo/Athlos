from django.db import models
from django.conf import settings

class Academia(models.Model):
    """
    Representa uma Academia e contém as suas informações básicas.
    """
    #corrigir lógica atual para referenciar o usuário correto
    aluno = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE,
        related_name='academias_como_aluno',
        verbose_name='Responsável',
        blank=True,
        null=True,
        limit_choices_to={'user_type': 'ADMIN'}
    )
    nome_fantasia = models.CharField(max_length=100, verbose_name='Nome Fantasia')
    cnpj = models.CharField(max_length=18, unique=True, verbose_name='CNPJ')
    endereco = models.CharField(max_length=255, verbose_name='Endereço')
    telefone = models.CharField(max_length=15, verbose_name='Telefone')
    data_criacao = models.DateTimeField(auto_now_add=True, verbose_name='Data de Criação')


    class Meta:
        verbose_name = 'Academia'
        verbose_name_plural = 'Academias'

    
    def __str__(self):
        return self.nome_fantasia
    

class PersonalTrainer(models.Model):
    """
    O Perfil do Personal. Contém dados *específicos* do Personal.
    Isto NÃO é um modelo de login, é um modelo de DADOS.
    """
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        primary_key=True,
        verbose_name="Usuário",
        limit_choices_to={'user_type': 'PERSONAL_TRAINER'}
    )
    
    cref = models.CharField(max_length=20, unique=True, verbose_name="CREF")
    especialidade = models.CharField(
        max_length=100, blank=True, null=True, verbose_name="Especialidade"
    )

    def __str__(self):
        return self.user.get_full_name()
    
class Aluno(models.Model):
    """
    O Perfil do Aluno
    """
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        primary_key=True,
        verbose_name="Usuário",
        limit_choices_to={'user_type': 'ALUNO'}
    )


    personal_responsavel = models.ForeignKey(
        PersonalTrainer,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='alunos',
        verbose_name="Personal Trainer Responsável",
        limit_choices_to={'user_type': 'PERSONAL_TRAINER'}
    )

    data_nascimento = models.DateField(
        null=True, blank=True, verbose_name="Data de Nascimento"
    )


    objetivo = models.CharField(
        max_length=255, blank=True, null=True, verbose_name="Objetivo de Treino"
    )


    def __str__(self):
        return self.user.get_full_name()
