// Tipos base
export interface User {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    user_type: 'ADMIN_SISTEMA' | 'ADMIN' | 'PERSONAL' | 'ALUNO';
    academia?: Academia;
}

export interface Academia {
    id: number;
    nome_fantasia: string;
    cnpj: string;
    endereco: string;
    telefone: string;
    data_criacao: string;
}

export interface PersonalTrainer {
    user: User;
    cref: string;
    especialidade?: string;
    data_criacao: string;
}

export interface Aluno {
    user: User;
    personal_responsavel?: PersonalTrainer;
    academia?: Academia;
    data_nascimento?: string;
    objetivo?: string;
}

export interface Exercicio {
    id: number;
    nome: string;
    descricao?: string;
    grupo_muscular: string;
    categoria: string;
    equipamento?: string;
}

export interface ItemTreino {
    id: number;
    exercicio: Exercicio;
    series: number;
    repeticoes: string;
    carga_kg?: number;
    observacoes?: string;
}

export interface Treino {
    id: number;
    nome_treino: string;
    descricao?: string;
    aluno: Aluno;
    personal_criador?: PersonalTrainer;
    data_criacao: string;
    ativo: boolean;
    itens: ItemTreino[];
}

// Tipos para formulários
export interface LoginForm {
    email: string;
    password: string;
}

export interface AcademiaForm {
    nome_fantasia: string;
    cnpj: string;
    endereco: string;
    telefone: string;
}

export interface AlunoForm {
    email: string;
    first_name: string;
    last_name: string;
    password?: string;
    data_nascimento?: string;
    objetivo?: string;
    academia_id?: number;
}

export interface TreinoForm {
    nome_treino: string;
    descricao?: string;
    aluno_id: number;
    ativo: boolean;
    itens: ItemTreinoForm[];
}

export interface ItemTreinoForm {
    exercicio_id: number;
    series: number;
    repeticoes: string;
    carga_kg?: number;
    observacoes?: string;
}

// Tipos para dashboard
export interface DashboardStats {
    total_academias: number;
    total_alunos: number;
    total_personais: number;
    total_treinos: number;
    treinos_por_mes: { mes: string; total: number }[];
    exercicios_mais_usados: { nome: string; total: number }[];
}

// Auth context
export interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}
