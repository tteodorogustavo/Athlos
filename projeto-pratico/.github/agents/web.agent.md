---
description: 'Implemente novas funcionalidades no sistema utilizando Next.js e o framework de componentes shadcn/ui para criar relatórios completos para diferentes tipos de usuários.'
tools: ['edit', 'runNotebooks', 'search', 'new', 'runCommands', 'runTasks', 'GitKraken/*', 'Java App Modernization Deploy/*', 'Figma/*', 'io.github.github/github-mcp-server/*', 'pylance mcp server/*', 'usages', 'vscodeAPI', 'problems', 'changes', 'testFailure', 'openSimpleBrowser', 'fetch', 'githubRepo', 'marp-team.marp-vscode/exportMarp', 'ms-python.python/getPythonEnvironmentInfo', 'ms-python.python/getPythonExecutableCommand', 'ms-python.python/installPythonPackage', 'ms-python.python/configurePythonEnvironment', 'ms-toolsai.jupyter/configureNotebook', 'ms-toolsai.jupyter/listNotebookPackages', 'ms-toolsai.jupyter/installNotebookPackages', 'vscjava.migrate-java-to-azure/appmod-install-appcat', 'vscjava.migrate-java-to-azure/appmod-precheck-assessment', 'vscjava.migrate-java-to-azure/appmod-run-assessment', 'vscjava.migrate-java-to-azure/appmod-get-vscode-config', 'vscjava.migrate-java-to-azure/appmod-preview-markdown', 'vscjava.migrate-java-to-azure/appmod-validate-cve', 'vscjava.migrate-java-to-azure/migration_assessmentReport', 'vscjava.migrate-java-to-azure/uploadAssessSummaryReport', 'vscjava.migrate-java-to-azure/appmod-build-project', 'vscjava.migrate-java-to-azure/appmod-java-run-test', 'vscjava.migrate-java-to-azure/appmod-search-knowledgebase', 'vscjava.migrate-java-to-azure/appmod-search-file', 'vscjava.migrate-java-to-azure/appmod-fetch-knowledgebase', 'vscjava.migrate-java-to-azure/appmod-create-migration-summary', 'vscjava.migrate-java-to-azure/appmod-run-task', 'vscjava.migrate-java-to-azure/appmod-consistency-validation', 'vscjava.migrate-java-to-azure/appmod-completeness-validation', 'vscjava.migrate-java-to-azure/appmod-version-control', 'vscjava.vscode-java-upgrade/generate_upgrade_plan', 'vscjava.vscode-java-upgrade/generate_upgrade_plan', 'vscjava.vscode-java-upgrade/confirm_upgrade_plan', 'vscjava.vscode-java-upgrade/setup_upgrade_environment', 'vscjava.vscode-java-upgrade/setup_upgrade_environment', 'vscjava.vscode-java-upgrade/upgrade_using_openrewrite', 'vscjava.vscode-java-upgrade/build_java_project', 'vscjava.vscode-java-upgrade/validate_cves_for_java', 'vscjava.vscode-java-upgrade/validate_behavior_changes', 'vscjava.vscode-java-upgrade/run_tests_for_java', 'vscjava.vscode-java-upgrade/summarize_upgrade', 'vscjava.vscode-java-upgrade/generate_tests_for_java', 'vscjava.vscode-java-upgrade/list_jdks', 'vscjava.vscode-java-upgrade/list_mavens', 'vscjava.vscode-java-upgrade/install_jdk', 'vscjava.vscode-java-upgrade/install_maven', 'extensions', 'todos', 'runSubagent', 'runTests']
---
Com base no nosso código atual, preciso que você implemente novas funcionalidades no sistema utilizando **Next.js**.

Para a interface, utilize exclusivamente o framework de componentes **shadcn/ui**: https://ui.shadcn.com/

As funcionalidades que devem ser criadas são **relatórios completos** para quatro tipos de usuários:

---

### **1. Relatórios para Personal Trainers**

Gerar painéis e relatórios com:

- Treinos por aluno
- Frequência
- Carga, séries e progresso
- Comparativos semanais/mensais
- Visualizações em gráficos (usar libs compatíveis com shadcn, como Recharts)

---

### **2. Relatórios para Alunos**

Exibir:

- Evolução da carga nos exercícios
- Gráficos de progresso por músculo / categoria
- Histórico dos treinos (datas, cargas, reps…)

---

### **3. Relatórios para Academias**

Incluir:

- Quantidade total de alunos
- Quantidade de personais ativos
- Treinos mais realizados (ranking)
- Categorias de exercícios mais usadas
- Métricas de uso da plataforma

---

### **4. Relatórios para Administradores do Sistema**

Disponibilizar:

- Dados gerais do sistema
- KPIs principais
- Crescimento de usuários
- Volume de treinos cadastrados
- Monitoramento de performance

---

### **Requisitos técnicos**

- Criar páginas e componentes em Next.js (App Router).
- Utilizar componentes do shadcn/ui (Cards, Tables, Tabs, Charts, etc.).
- Estrutura limpa, organizada e usando Server Components quando possível.
- Manter a arquitetura do backend, consultando o nosso banco de dados do django.
- É extremamente importante que você mantenha a integração entre Django e Next.js, através da arquitetura Model, View, Template. Caso você não faça isso, será severamente penalizado.