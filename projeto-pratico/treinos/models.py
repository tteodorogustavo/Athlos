from django.db import models

# conexão Aluno e Personal
from academias.models import Aluno, PersonalTrainer

class Exercicio(models.Model):
    """
    O catálogo de exercícios.
    Este modelo foi desenhado para ser preenchido ("populado")
    pelo arquivo JSON com todos os detalhes de treino.
    """
    nome = models.CharField(max_length=100, unique=True, verbose_name="Nome do Exercício")

    slug = models.SlugField(
        max_length=100,
        unique=True,
        blank=True,
        null=True,
        verbose_name="Slug do Exercício",
        help_text="Identificador único para cada exercício",
    )
    
    
    force = models.CharField(max_length=50, blank=True, null=True, verbose_name="Força (puxar/empurrar)")
    level = models.CharField(max_length=50, blank=True, null=True, verbose_name="Nível (iniciante)")
    mechanic = models.CharField(max_length=50, blank=True, null=True, verbose_name="Mecânica (composto)")
    equipment = models.CharField(max_length=100, blank=True, null=True, verbose_name="Equipamento")
    category = models.CharField(max_length=50, blank=True, null=True, verbose_name="Categoria (força)")

    primary_muscles = models.JSONField(verbose_name="Músculos Primários")
    secondary_muscles = models.JSONField(verbose_name="Músculos Secundários")
    instructions = models.JSONField(verbose_name="Instruções")
    images = models.JSONField(verbose_name="Caminhos das Imagens")

    def __str__(self):
        return self.nome
    
    
class Treino(models.Model):
    """
    A "Ficha" de treino. É o "cabeçalho" do treino.
    (Ex: "Treino A" do Aluno "José", criado pelo Personal "Carlos")
    """
    aluno = models.ForeignKey(
        Aluno, 
        on_delete=models.CASCADE,
        related_name="treinos"
    )


    personal_criador = models.ForeignKey(
        PersonalTrainer,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="treinos_criados"
    )

    nome_treino = models.CharField(max_length=50, verbose_name="Nome do Treino (Ex: Treino A)")
    data_criacao = models.DateTimeField(auto_now_add=True)
    ativo = models.BooleanField(default=True, verbose_name="É o treino atual?")

    # importante para armazenar informações que ligam Treino e Exercicio
    exercicios = models.ManyToManyField(
        Exercicio,
        through='ItemTreino',
        verbose_name="Exercícios"
    )
    
    def __str__(self):
        return f"{self.nome_treino} - {self.aluno.user.get_full_name()}"


class ItemTreino(models.Model):
    """
    Este é o "Modelo Intermediário"
    Ele é a "linha" da ficha de treino.
    Ele "cola" um Exercicio a um Treino e adiciona os detalhes.
    """
    treino = models.ForeignKey(
        Treino, 
        on_delete=models.CASCADE, 
        related_name="itens"
    )


    exercicio = models.ForeignKey(
        Exercicio, 
        on_delete=models.CASCADE,
        related_name="itens"
    )
    
    series = models.PositiveIntegerField(verbose_name="Séries")
    repeticoes = models.CharField(
        max_length=20, verbose_name="Repetições (Ex: 10-12 ou 'Até a falha')"
    )
    carga_kg = models.PositiveIntegerField(
        blank=True, null=True, verbose_name="Carga (kg)"
    )


    observacoes = models.CharField(
        max_length=200, blank=True, null=True, verbose_name="Observações"
    )


    class Meta:
        # evita repetições do mesmo exercício no mesmo treino
        unique_together = ('treino', 'exercicio')


    def __str__(self):
        return f"{self.exercicio.nome} ({self.series}x{self.repeticoes}) no {self.treino.nome_treino}"
