# Athlos — Projeto Prático

Resumo
- Aplicação Django para gerenciar exercícios, treinos e usuários.
- Dados de exercícios embalados em JSON em [projeto-pratico/exercicios.json](projeto-pratico/exercicios.json).
- Banco SQLite de desenvolvimento: [projeto-pratico/db.sqlite3](projeto-pratico/db.sqlite3).

Estrutura principal
- [projeto-pratico/manage.py](projeto-pratico/manage.py) — entrypoint Django.
- Configuração do projeto: [`Athlos.settings`](projeto-pratico/Athlos/settings.py) ([projeto-pratico/Athlos/settings.py](projeto-pratico/Athlos/settings.py)).
- Apps:
  - [`academias.models`](projeto-pratico/academias/models.py) ([projeto-pratico/academias/models.py](projeto-pratico/academias/models.py))
  - [`core.models`](projeto-pratico/core/models.py) ([projeto-pratico/core/models.py](projeto-pratico/core/models.py))
  - [`treinos.models`](projeto-pratico/treinos/models.py) ([projeto-pratico/treinos/models.py](projeto-pratico/treinos/models.py))
  - pasta de usuários: [projeto-pratico/usuarios](projeto-pratico/usuarios)  
  - outras pastas relevantes: [projeto-pratico/academias](projeto-pratico/academias), [projeto-pratico/treinos](projeto-pratico/treinos), [projeto-pratico/core](projeto-pratico/core)

Requisitos
- Python 3.8+ recomendado (ver `Pipfile`).
- Pipenv ou virtualenv + pip.
- Dependências listadas em `Pipfile` (arquivo: [projeto-pratico/Pipfile](projeto-pratico/Pipfile)).

Instalação (ambiente de desenvolvimento)
```bash
# abrir terminal na raiz do repo
cd projeto-pratico

# com pipenv
pipenv install --dev
pipenv shell

# ou com venv + pip
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt   # se existir
```

Migrações e banco
```bash
# criar/atualizar o banco local (usa [projeto-pratico/manage.py](projeto-pratico/manage.py))
python manage.py makemigrations
python manage.py migrate
```
- O banco de desenvolvimento pré-existente está em [projeto-pratico/db.sqlite3](projeto-pratico/db.sqlite3). Use com cuidado (não versionar dados sensíveis).

Carregar/usar dados de exercícios
- O arquivo [projeto-pratico/exercicios.json](projeto-pratico/exercicios.json) contém o catálogo de exercícios (cada objeto tem campos como `name`, `id`, `instructions`, `primaryMuscles`).
- Para importar, verifique se existe um comando de management em [`treinos`](projeto-pratico/treinos) (ex.: [projeto-pratico/treinos/management](projeto-pratico/treinos/management)). Caso não exista, criar um comando customizado que leia o JSON e popule os modelos do app [`treinos.models`](projeto-pratico/treinos/models.py).

Execução
```bash
# servidor de desenvolvimento
python manage.py runserver
```

Testes
```bash
# executar testes dos apps (ex.: academias, core, treinos)
python manage.py test
```
- Testes por app estão em arquivos [projeto-pratico/academias/tests.py](projeto-pratico/academias/tests.py), [projeto-pratico/core/tests.py](projeto-pratico/core/tests.py), [projeto-pratico/treinos/tests.py](projeto-pratico/treinos/tests.py).

Boas práticas
- Não commitar `db.sqlite3` quando conter dados sensíveis.
- Manter `exercicios.json` como fonte canônica dos exercícios; se editar, versionar cuidadosamente.
- Atualizar [`Athlos.settings`](projeto-pratico/Athlos/settings.py) para credenciais e variáveis de ambiente no deploy.

Contribuição
- Fork -> branch feature -> PR.
- Escrever/atualizar testes para funcionalidades novas.
- Documentar comandos de management e migrations.

Recursos úteis no repositório
- [projeto-pratico/manage.py](projeto-pratico/manage.py)
- [projeto-pratico/exercicios.json](projeto-pratico/exercicios.json)
- [projeto-pratico/db.sqlite3](projeto-pratico/db.sqlite3)
- [`Athlos.settings`](projeto-pratico/Athlos/settings.py) ([projeto-pratico/Athlos/settings.py](projeto-pratico/Athlos/settings.py))
- [`academias.models`](projeto-pratico/academias/models.py) ([projeto-pratico/academias/models.py](projeto-pratico/academias/models.py))
- [`core.models`](projeto-pratico/core/models.py) ([projeto-pratico/core/models.py](projeto-pratico/core/models.py))
- [`treinos.models`](projeto-pratico/treinos/models.py) ([projeto-pratico/treinos/models.py](projeto-pratico/treinos/models.py))

Contato
- Autor do repositório (informações no Git / commits).

Licença
- Adicionar arquivo LICENSE na raiz com a licença desejada.