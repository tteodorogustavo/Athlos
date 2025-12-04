# Athlos - Sistema de Gerenciamento de Academias e Treinos

## Sobre o Projeto

**Athlos** é um sistema completo de gerenciamento de academias desenvolvido com **Django** (backend) e **Next.js** (frontend), projetado para facilitar o relacionamento entre academias, personal trainers e alunos. O sistema permite o cadastro de academias, gerenciamento de usuários com diferentes perfis, criação de fichas de treino personalizadas e um catálogo extenso de exercícios.

O nome "Athlos" vem do grego antigo (ἆθλος), que significa "competição" ou "prova atlética", representando perfeitamente a essência de uma aplicação voltada para fitness e superação pessoal.

---

## Como Rodar o Projeto

### Pré-requisitos

- **Python 3.13+**
- **Node.js 18+**
- **npm** ou **pnpm**
- **Pipenv** (recomendado) ou **pip**

---

### 1. Backend (Django)

```bash
# Clone o repositório
git clone https://github.com/tteodorogustavo/Athlos.git
cd Athlos/projeto-pratico

# Instale as dependências do Python
pip install -r requirements.txt
# ou com Pipenv
pipenv install && pipenv shell

# Execute as migrações do banco de dados
python manage.py migrate

# Importe o catálogo de exercícios (opcional)
python manage.py import_exercicios

# Crie os usuários de teste (recomendado)
python manage.py shell < criar_usuarios_teste.py

# Inicie o servidor Django
python manage.py runserver
```

O backend estará disponível em: **<http://localhost:8000>**

---

### 2. Frontend (Next.js)

```bash
# Navegue até a pasta do frontend
cd frontend

# Instale as dependências
npm install
# ou
pnpm install

# Inicie o servidor de desenvolvimento
npm run dev
# ou
pnpm dev
```

O frontend estará disponível em: **<http://localhost:3000>**

---

## Usuários de Teste

O script `criar_usuarios_teste.py` cria automaticamente os seguintes usuários para testar o sistema:

| Tipo de Usuário | Email | Senha |
|-----------------|-------|-------|
| **Admin Sistema** | `admin@athlos.com` | `admin123` |
| **Admin Academia** | `admin@forcatotal.com` | `academia123` |
| **Personal Trainer** | `personal@athlos.com` | `personal123` |
| **Aluno** | `aluno@athlos.com` | `aluno123` |

> **Dica**: Use o Admin Sistema para acessar todas as funcionalidades administrativas.

---

## Rotas do Sistema

### Frontend (Next.js)

#### Páginas Públicas

- `/` - Página inicial (Login)
- `/register` - Cadastro de novos usuários

#### Dashboard Admin Sistema

- `/dashboard/admin` - Dashboard principal
- `/dashboard/admin/usuarios` - Gerenciamento de usuários
- `/dashboard/admin/academias` - Gerenciamento de academias
- `/dashboard/admin/exercicios` - Catálogo de exercícios
- `/dashboard/admin/relatorios` - Relatórios e estatísticas

#### Dashboard Admin Academia

- `/dashboard/academia` - Dashboard da academia
- `/dashboard/academia/personais` - Gerenciamento de personal trainers
- `/dashboard/academia/alunos` - Gerenciamento de alunos
- `/dashboard/academia/relatorios` - Relatórios da academia

#### Dashboard Personal Trainer

- `/dashboard/personal` - Dashboard do personal
- `/dashboard/personal/alunos` - Lista de alunos
- `/dashboard/personal/treinos` - Gerenciamento de treinos
- `/dashboard/personal/exercicios` - Catálogo de exercícios

#### Dashboard Aluno

- `/dashboard/aluno` - Dashboard do aluno
- `/dashboard/aluno/treinos` - Visualização de treinos
- `/dashboard/aluno/perfil` - Perfil do aluno

### Backend (Django REST API)

#### Autenticação

- `POST /api/token/` - Obter token JWT
- `POST /api/token/refresh/` - Renovar token JWT
- `POST /api/usuarios/register/` - Cadastro de usuário

#### Usuários

- `GET /api/usuarios/me/` - Dados do usuário logado
- `GET /api/usuarios/` - Listar usuários
- `GET/PUT/DELETE /api/usuarios/{id}/` - CRUD de usuário

#### Academias

- `GET/POST /api/academias/` - Listar/Criar academias
- `GET/PUT/DELETE /api/academias/{id}/` - CRUD de academia

#### Personal Trainers

- `GET/POST /api/personal-trainers/` - Listar/Criar personais
- `GET/PUT/DELETE /api/personal-trainers/{id}/` - CRUD de personal

#### Alunos

- `GET/POST /api/alunos/` - Listar/Criar alunos
- `GET/PUT/DELETE /api/alunos/{id}/` - CRUD de aluno

#### Treinos

- `GET/POST /api/treinos/` - Listar/Criar treinos
- `GET/PUT/DELETE /api/treinos/{id}/` - CRUD de treino

#### Exercícios

- `GET /api/exercicios/` - Listar exercícios
- `GET /api/exercicios/{id}/` - Detalhes do exercício

#### Relatórios

- `GET /api/relatorios/admin/` - Relatório do sistema (Admin)
- `GET /api/relatorios/academia/` - Relatório da academia

---

## Tecnologias Utilizadas

### Backend

- **Python 3.13**
- **Django 5.2.7**
- **Django REST Framework 3.16.1**
- **Simple JWT** (autenticação)
- **SQLite** (banco de dados)

### Frontend

- **Next.js 16.0.5** (App Router)
- **React 19.2.0**
- **TypeScript 5**
- **Tailwind CSS 4**
- **shadcn/ui** (componentes)
- **Axios** (requisições HTTP)
- **Recharts** (gráficos)

---

## Estrutura do Projeto

```
projeto-pratico/
├── Athlos/                 # Configurações Django
│   ├── settings.py
│   ├── urls.py
│   └── ...
├── usuarios/               # App de autenticação
├── academias/              # App de academias e perfis
├── treinos/                # App de treinos e exercícios
├── core/                   # App utilitários
├── frontend/               # Aplicação Next.js
│   ├── src/
│   │   ├── app/            # Rotas (App Router)
│   │   ├── components/     # Componentes React
│   │   ├── lib/            # Utilitários e API
│   │   └── ...
│   └── package.json
├── criar_usuarios_teste.py # Script para criar usuários de teste
├── exercicios.json         # Catálogo de exercícios
├── requirements.txt        # Dependências Python
└── README.md
```

---

## Sistema de Permissões

| Perfil | Acessos |
|--------|---------|
| **Admin Sistema** | Acesso total ao sistema, gerencia academias, usuários e relatórios globais |
| **Admin Academia** | Gerencia sua academia, personal trainers e alunos vinculados |
| **Personal Trainer** | Cria e gerencia treinos para seus alunos |
| **Aluno** | Visualiza seus treinos e acompanha seu progresso |

---

## Comandos Úteis

```bash
# Backend
python manage.py runserver          # Iniciar servidor
python manage.py migrate            # Executar migrações
python manage.py createsuperuser    # Criar superusuário
python manage.py import_exercicios  # Importar exercícios
python manage.py shell < criar_usuarios_teste.py  # Criar usuários de teste

# Frontend
npm run dev     # Desenvolvimento
npm run build   # Build de produção
npm run start   # Iniciar produção
npm run lint    # Verificar código
```

---

## Licença

Este projeto está sob a licença MIT.

---

## Desenvolvedores

Desenvolvido por:

- [Gustavo Teodoro](https://github.com/tteodorogustavo)
- [Lucas Henrique](https://github.com/Lucas-Henrique-Lopes-Costa)

