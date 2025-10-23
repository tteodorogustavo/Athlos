# 📚 Funcionalidades Desenvolvidas - Código Detalhado

Este documento apresenta os principais trechos de código implementados no sistema Athlos, organizados por funcionalidade.

---

## 🔐 1. Sistema de Usuários Multi-perfil

### Modelo CustomUser (`usuarios/models.py`)

```python
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
```

**Destaques:**
- ✅ Herda de `AbstractUser` para estender o modelo de usuário padrão do Django
- ✅ Define 4 tipos de usuários usando `TextChoices`
- ✅ Email como campo único para login (`USERNAME_FIELD`)
- ✅ Geração automática de username a partir do email
- ✅ Relacionamento com Academia

---

## 🏢 2. Gestão de Academias

### Modelo Academia (`academias/models.py`)

```python
class Academia(models.Model):
    nome_fantasia = models.CharField(max_length=100, verbose_name="Nome Fantasia")
    cnpj = models.CharField(max_length=18, unique=True, verbose_name="CNPJ")
    endereco = models.CharField(max_length=255, verbose_name="Endereço")
    telefone = models.CharField(max_length=15, verbose_name="Telefone")
    data_criacao = models.DateTimeField(
        auto_now_add=True, verbose_name="Data de Criação"
    )

    class Meta:
        verbose_name = "Academia"
        verbose_name_plural = "Academias"

    def __str__(self):
        return self.nome_fantasia
```

**Destaques:**
- ✅ CNPJ único para cada academia
- ✅ Registro automático da data de criação
- ✅ Metadados configurados para o admin do Django

---

## 👨‍🏫 3. Perfil de Personal Trainer

### Modelo PersonalTrainer (`academias/models.py`)

```python
class PersonalTrainer(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        primary_key=True,
        verbose_name="Usuário",
        limit_choices_to={"user_type": "PERSONAL"},
    )

    cref = models.CharField(max_length=20, unique=True, verbose_name="CREF")
    especialidade = models.CharField(
        max_length=100, blank=True, null=True, verbose_name="Especialidade"
    )

    def __str__(self):
        return self.user.get_full_name()
```

**Destaques:**
- ✅ Relacionamento OneToOne com CustomUser
- ✅ `limit_choices_to` garante que apenas usuários do tipo PERSONAL podem ter este perfil
- ✅ CREF único (registro profissional obrigatório)
- ✅ Campo de especialidade opcional

---

## 🏃 4. Perfil de Aluno

### Modelo Aluno (`academias/models.py`)

```python
class Aluno(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        primary_key=True,
        verbose_name="Usuário",
        limit_choices_to={"user_type": "ALUNO"},
    )

    personal_responsavel = models.ForeignKey(
        PersonalTrainer,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="alunos",
        verbose_name="Personal Trainer Responsável",
    )

    data_nascimento = models.DateField(
        null=True, blank=True, verbose_name="Data de Nascimento"
    )

    objetivo = models.CharField(
        max_length=255, blank=True, null=True, verbose_name="Objetivo de Treino"
    )

    def __str__(self):
        return self.user.get_full_name()
```

**Destaques:**
- ✅ Relacionamento OneToOne com CustomUser
- ✅ Relacionamento ForeignKey com PersonalTrainer (um aluno tem um personal responsável)
- ✅ `on_delete=models.SET_NULL` preserva o aluno caso o personal seja deletado
- ✅ Campos opcionais para data de nascimento e objetivo

---

## 💪 5. Catálogo de Exercícios

### Modelo Exercicio (`treinos/models.py`)

```python
class Exercicio(models.Model):
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
```

**Destaques:**
- ✅ Uso de `JSONField` para armazenar listas (músculos, instruções, imagens)
- ✅ Slug único para URLs amigáveis
- ✅ Campos descritivos completos para cada exercício
- ✅ Metadados de força, nível, mecânica e equipamento

---

## 📋 6. Sistema de Treinos

### Modelo Treino (`treinos/models.py`)

```python
class Treino(models.Model):
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

    # Relacionamento Many-to-Many com Exercicio através do modelo intermediário
    exercicios = models.ManyToManyField(
        Exercicio,
        through='ItemTreino',
        verbose_name="Exercícios"
    )
    
    def __str__(self):
        return f"{self.nome_treino} - {self.aluno.user.get_full_name()}"
```

**Destaques:**
- ✅ Relacionamento com Aluno (CASCADE - se aluno for deletado, treinos também são)
- ✅ Relacionamento com PersonalTrainer (SET_NULL - preserva treino se personal for deletado)
- ✅ Campo `ativo` para controlar qual é o treino atual do aluno
- ✅ `related_name` permite acessar treinos do aluno ou personal facilmente

---

## 📝 7. Itens de Treino (Modelo Intermediário)

### Modelo ItemTreino (`treinos/models.py`)

```python
class ItemTreino(models.Model):
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
    observacoes = models.TextField(
        blank=True, null=True, verbose_name="Observações"
    )

    def __str__(self):
        return f"{self.exercicio.nome} - {self.series}x{self.repeticoes}"
```

**Destaques:**
- ✅ Modelo intermediário para relacionamento Many-to-Many customizado
- ✅ Permite adicionar informações extras (séries, repetições, carga)
- ✅ `repeticoes` como CharField para aceitar formatos flexíveis ("10-12", "até a falha")
- ✅ Campo de observações para anotações do personal

---

## 🎯 8. Padrão Observer com Signals

### ⭐ DESTAQUE ESPECIAL: Django Signals (`academias/signals.py`)

O sistema implementa o **padrão de projeto Observer** usando o sistema de signals do Django para criar automaticamente perfis de usuário quando um novo usuário é cadastrado.

```python
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings
from .models import Aluno, PersonalTrainer


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def criar_perfil_usuario(sender, instance, created, **kwargs):
    """
    Signal que cria automaticamente o perfil de Aluno ou PersonalTrainer
    quando um usuário é criado com o tipo correspondente.
    
    Padrão Observer: O signal "observa" a criação de usuários e reage
    automaticamente criando o perfil apropriado.
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
    
    Padrão Observer: Observa atualizações nos usuários e mantém
    a consistência dos perfis automaticamente.
    """
    if not created:
        if instance.user_type == "ALUNO":
            Aluno.objects.get_or_create(user=instance)
            # Remove perfil de Personal se existir
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
            # Remove ambos os perfis para admins
            try:
                instance.aluno.delete()
            except Aluno.DoesNotExist:
                pass
            try:
                instance.personaltrainer.delete()
            except PersonalTrainer.DoesNotExist:
                pass
```

### Ativação dos Signals (`academias/apps.py`)

```python
from django.apps import AppConfig


class AcademiasConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "academias"

    def ready(self):
        import academias.signals  # noqa
```

**Destaques do Padrão Observer:**
- ✅ **Desacoplamento**: Signals permitem que diferentes partes do código reajam a eventos sem dependências diretas
- ✅ **Automação**: Perfis são criados/atualizados automaticamente sem código adicional nas views
- ✅ **Consistência**: Garante que sempre haverá um perfil correspondente ao tipo de usuário
- ✅ **Manutenibilidade**: Lógica de criação de perfil centralizada em um único lugar
- ✅ **CREF Automático**: Gera automaticamente um CREF temporário para personal trainers
- ✅ **Gestão de Mudanças**: Quando um usuário muda de tipo, os perfis são ajustados automaticamente

**Como funciona:**
1. **Subject (Observado)**: Modelo `CustomUser`
2. **Observer (Observador)**: Funções decoradas com `@receiver`
3. **Event (Evento)**: `post_save` - disparado após salvar um usuário
4. **Reaction (Reação)**: Criação/atualização/remoção automática de perfis

---

## 📥 9. Comando de Importação de Exercícios

### Command Customizado (`treinos/management/commands/import_exercicios.py`)

```python
import json
from django.core.management.base import BaseCommand
from treinos.models import Exercicio

class Command(BaseCommand):

    def add_arguments(self, parser):
        parser.add_argument(
            'caminho_json', 
            type=str, 
            help='O caminho completo para o arquivo JSON de exercícios'
        )

    def handle(self, *args, **options):
        caminho_arquivo = options['caminho_json']

        self.stdout.write(self.style.SUCCESS(f'Iniciando importação de {caminho_arquivo}'))

        try:
            with open(caminho_arquivo, 'r', encoding='utf-8') as f:
                dados = json.load(f)
        except FileNotFoundError:
            self.stderr.write(self.style.ERROR('Arquivo não encontrado!'))
            return
        except json.JSONDecodeError:
            self.stderr.write(self.style.ERROR('Erro ao decodificar o JSON.'))
            return

        total_criados = 0
        total_atualizados = 0
        
        if not isinstance(dados, list):
            self.stderr.write(self.style.ERROR('O JSON não é uma lista de exercícios.'))
            return
            
        for item in dados:
            try:
                exercicio, criado = Exercicio.objects.update_or_create(
                    nome = item.get('name'), 
                    defaults={
                        'slug': item.get('id'),
                        'force': item.get('force'),
                        'level': item.get('level'),
                        'mechanic': item.get('mechanic'),
                        'equipment': item.get('equipment'),
                        'category': item.get('category'),
                        'primary_muscles': item.get('primaryMuscles', []),
                        'secondary_muscles': item.get('secondaryMuscles', []),
                        'instructions': item.get('instructions', []),
                        'images': item.get('images', []),
                    }
                )
                
                if criado:
                    total_criados += 1
                else:
                    total_atualizados += 1

            except Exception as e:
                self.stderr.write(self.style.ERROR(f"Erro ao importar '{item.get('name')}': {e}"))

        self.stdout.write(self.style.SUCCESS(
            f'Importação concluída! {total_criados} criados, {total_atualizados} atualizados.'
        ))
```

**Uso:**
```bash
python manage.py import_exercicios exercicios.json
```

**Destaques:**
- ✅ Comando Django customizado para importação em lote
- ✅ Aceita caminho do arquivo JSON como argumento
- ✅ Usa `update_or_create` para evitar duplicatas
- ✅ Tratamento de erros robusto
- ✅ Feedback visual com contadores de criados/atualizados
- ✅ Mensagens coloridas no terminal usando `self.style`

---

## 🔧 10. Configuração do Projeto

### Settings principais (`Athlos/settings.py`)

```python
INSTALLED_APPS = [
    'core.apps.CoreConfig',
    'usuarios.apps.UsuariosConfig',
    'academias.apps.AcademiasConfig',
    'treinos.apps.TreinosConfig',

    # Apps do Django
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
]

# Configuração do modelo de usuário customizado
AUTH_USER_MODEL = 'usuarios.CustomUser'
```

**Destaques:**
- ✅ Apps customizados organizados por funcionalidade
- ✅ `AUTH_USER_MODEL` aponta para o CustomUser
- ✅ Estrutura modular e escalável

---

## 📊 Padrões de Projeto Implementados

### 1. **Observer Pattern (Signals)**
- Observa eventos de criação/atualização de usuários
- Reage automaticamente criando perfis correspondentes

### 2. **One-to-One Pattern**
- Separação de dados de autenticação (CustomUser) e dados de perfil (Aluno/Personal)
- Permite extensão sem modificar o modelo de usuário base

### 3. **Many-to-Many com Modelo Intermediário**
- Relacionamento flexível entre Treino e Exercicio
- ItemTreino adiciona metadados ao relacionamento

### 4. **Command Pattern**
- Comando customizado para importação de dados
- Encapsula a lógica de importação em uma classe reutilizável

### 5. **Factory Pattern (implícito)**
- `get_or_create` atua como factory para criar perfis apenas quando necessário

---

## 🎓 Conceitos de Engenharia de Software Aplicados

### ✅ DRY (Don't Repeat Yourself)
- Signals evitam código repetido de criação de perfis
- Modelo intermediário reutilizado para diferentes treinos

### ✅ SOLID Principles
- **S** - Single Responsibility: Cada model tem uma responsabilidade única
- **O** - Open/Closed: Fácil adicionar novos tipos de usuário
- **L** - Liskov Substitution: CustomUser substitui AbstractUser
- **I** - Interface Segregation: Perfis específicos (Aluno/Personal) separados
- **D** - Dependency Inversion: Uso de `settings.AUTH_USER_MODEL`

### ✅ Clean Code
- Nomes descritivos e claros
- Docstrings em português explicando cada model
- Comentários onde necessário

### ✅ Database Normalization
- Separação adequada de entidades
- Relacionamentos bem definidos
- Evita redundância de dados

---

## 🚀 Como Testar as Funcionalidades

### 1. Criar um Usuário (testando signals)
```python
from usuarios.models import CustomUser

# Criar aluno - perfil será criado automaticamente
aluno_user = CustomUser.objects.create_user(
    email="joao@email.com",
    password="senha123",
    first_name="João",
    last_name="Silva",
    user_type="ALUNO"
)

# Verificar que o perfil foi criado
print(aluno_user.aluno)  # Deve existir!
```

### 2. Importar Exercícios
```bash
python manage.py import_exercicios exercicios.json
```

### 3. Criar um Treino Programaticamente
```python
from academias.models import Aluno, PersonalTrainer
from treinos.models import Treino, Exercicio, ItemTreino

# Buscar aluno e personal
aluno = Aluno.objects.first()
personal = PersonalTrainer.objects.first()

# Criar treino
treino = Treino.objects.create(
    aluno=aluno,
    personal_criador=personal,
    nome_treino="Treino A",
    ativo=True
)

# Adicionar exercícios ao treino
supino = Exercicio.objects.get(nome__icontains="bench press")
ItemTreino.objects.create(
    treino=treino,
    exercicio=supino,
    series=3,
    repeticoes="8-12",
    carga_kg=60
)
```

---

## 📝 Conclusão

Este documento apresenta a arquitetura e implementação do sistema Athlos, destacando:

- **Código limpo e bem documentado**
- **Uso eficiente do Django ORM**
- **Padrões de projeto aplicados corretamente**
- **Sistema de signals para automação (Observer Pattern)**
- **Estrutura modular e escalável**
- **Comandos customizados para tarefas específicas**

Todos os códigos seguem as melhores práticas do Django e Python, facilitando manutenção e evolução futura do sistema. 🎯
