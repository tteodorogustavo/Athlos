# Athlos - Sistema de Gerenciamento de Academias e Treinos

## Sobre o Projeto

**Athlos** é um sistema completo de gerenciamento de academias desenvolvido em Django, projetado para facilitar o relacionamento entre academias, personal trainers e alunos. O sistema permite o cadastro de academias, gerenciamento de usuários com diferentes perfis, criação de fichas de treino personalizadas e um catálogo extenso de exercícios.

O nome "Athlos" vem do grego antigo (ἆθλος), que significa "competição" ou "prova atlética", representando perfeitamente a essência de uma aplicação voltada para fitness e superação pessoal.

## Objetivos do Sistema

- **Gestão Centralizada**: Permitir que academias gerenciem seus personal trainers e alunos em um único lugar
- **Personalização de Treinos**: Facilitar a criação de fichas de treino customizadas por personal trainers
- **Catálogo de Exercícios**: Disponibilizar uma base de dados completa com exercícios, instruções e imagens
- **Controle de Acesso**: Sistema de permissões baseado em tipos de usuários (Admin Sistema, Admin Academia, Personal, Aluno)

## Funcionalidades Desenvolvidas

### 1. Sistema de Usuários Multi-perfil

- **Admin do Sistema**: Acesso total ao sistema
- **Admin da Academia**: Gerencia sua academia específica
- **Personal Trainer**: Cria e gerencia treinos para seus alunos
- **Aluno**: Visualiza seus treinos e acompanha seu progresso

![Diagrama do Banco de Dados](/images/code1.png)

### 2. Gestão de Academias

- Cadastro completo de academias (Nome, CNPJ, Endereço, Telefone)
- Vinculação de usuários a academias específicas
- Controle de data de criação e histórico

![Diagrama do Banco de Dados](/images/code2.png)

### 3. Perfis Especializados

#### Personal Trainer

- CREF (Registro profissional)
- Especialidade
- Vinculação à academia
- Relacionamento com alunos atribuídos

![Diagrama do Banco de Dados](/images/code3.png)

#### Aluno

- Informações pessoais (data de nascimento)
- Objetivo de treino
- Personal trainer responsável
- Vinculação à academia

![Diagrama do Banco de Dados](/images/code4.png)

### 4. Sistema de Treinos

#### Catálogo de Exercícios
O sistema conta com um catálogo extenso de exercícios importados de um arquivo JSON contendo:

- Nome e slug único
- Nível de dificuldade (iniciante, intermediário, avançado)
- Tipo de força (empurrar/puxar)
- Mecânica (composto/isolado)
- Equipamento necessário
- Categoria
- Músculos primários e secundários trabalhados
- Instruções passo a passo
- Imagens demonstrativas

![Diagrama do Banco de Dados](/images/code5.png)

#### Fichas de Treino

- Criação de treinos personalizados por personal trainers
- Nome do treino (Ex: Treino A, Treino B)
- Controle de treino ativo/inativo
- Data de criação e histórico

![Diagrama do Banco de Dados](/images/code6.png)

#### Itens de Treino
Cada exercício na ficha contém:

- Número de séries
- Repetições (aceita formatos flexíveis como "10-12" ou "até a falha")
- Carga em kg
- Observações específicas

![Diagrama do Banco de Dados](/images/code7.png)

### 5. Importação de Dados

- Sistema de comando customizado para importar exercícios do arquivo JSON
- Comando: `python manage.py import_exercicios`

## Modelagem de Banco de Dados


![Diagrama do Banco de Dados](/images/Diagrama.png)

### Principais Relacionamentos

1. **CustomUser ↔ Academia**: Um usuário pertence a uma academia (N:1)
2. **CustomUser → PersonalTrainer/Aluno**: Extensão de perfil via OneToOne
3. **Aluno ↔ PersonalTrainer**: Um aluno pode ter um personal responsável (N:1)
4. **Treino**: Conecta Aluno e PersonalTrainer, representa a ficha de treino
5. **Exercicio ↔ Treino**: Relacionamento N:N através da tabela intermediária ItemTreino
6. **ItemTreino**: Armazena os detalhes específicos de cada exercício no treino (séries, repetições, carga)

### Tabelas Principais

- **usuarios_customuser**: Usuários do sistema com autenticação
- **academias_academia**: Dados das academias
- **academias_personaltrainer**: Perfil específico de personal trainers
- **academias_aluno**: Perfil específico de alunos
- **treinos_exercicio**: Catálogo de exercícios
- **treinos_treino**: Fichas de treino
- **treinos_itemtreino**: Detalhes dos exercícios em cada treino

## Tecnologias Utilizadas

- **Python 3.13**: Linguagem de programação
- **Django 5.2.7**: Framework web
- **SQLite**: Banco de dados (desenvolvimento)
- **Pipenv**: Gerenciamento de dependências

## Estrutura do Projeto

```
projeto-pratico/
├── Athlos/              # Configurações principais do Django
├── academias/           # App de gestão de academias e perfis
├── usuarios/            # App de autenticação e usuários
├── treinos/             # App de exercícios e fichas de treino
├── core/                # App central (utilitários)
├── db.sqlite3           # Banco de dados
├── exercicios.json      # Catálogo de exercícios
└── manage.py            # Script de gerenciamento Django
```

## Como Executar o Projeto

### Pré-requisitos

- Python 3.13 ou superior
- Pipenv (ou pip)

### Instalação

1. Clone o repositório:

```bash
git clone https://github.com/tteodorogustavo/Athlos.git
cd Athlos/projeto-pratico
```

2. Instale as dependências:

```bash
pipenv install
# ou
pip install -r requirements.txt
```

3. Ative o ambiente virtual (se usar Pipenv):

```bash
pipenv shell
```

4. Execute as migrações:

```bash
python manage.py migrate
```

5. Importe os exercícios:

```bash
python manage.py import_exercicios
```

6. Crie um superusuário:

```bash
python manage.py createsuperuser
```

7. Inicie o servidor:

```bash
python manage.py runserver
```

8. Acesse o sistema:

```
http://localhost:8000/admin
```

## Funcionalidades Futuras

- [ ] Interface frontend para usuários finais
- [ ] Acompanhamento de evolução (gráficos de progresso)
- [ ] Relatórios e dashboards analíticos

## Licença

Este projeto está sob a licença MIT.

## Desenvolvedor

Desenvolvido por:

[Gustavo Teodoro](https://github.com/tteodorogustavo) | [Lucas Henrique](https://github.com/Lucas-Henrique-Lopes-Costa)

