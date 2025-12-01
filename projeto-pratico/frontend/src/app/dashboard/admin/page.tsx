'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    Legend,
} from 'recharts';
import {
    TrendingUp,
    Users,
    Building2,
    Dumbbell,
    Shield,
    Server,
    ChevronRight,
    CheckCircle2,
    Activity,
    UserCheck,
    AlertCircle,
    Loader2
} from 'lucide-react';
import Link from 'next/link';
import { dashboardAPI } from '@/lib/api';

interface DashboardAdminStats {
    total_usuarios: number;
    total_academias: number;
    total_personais: number;
    total_alunos: number;
    total_treinos: number;
    crescimento_usuarios: Array<{ mes: string; alunos: number; personais: number }>;
    volume_treinos: Array<{ mes: string; treinos: number }>;
    top_academias: Array<{ id: number; nome_fantasia: string; total_alunos: number }>;
}

// Atividade mockada
const atividadeRecente = [
    { tipo: 'Novo Usuário', descricao: 'Novo aluno cadastrado', tempo: '2 min atrás', icone: 'user' },
    { tipo: 'Nova Academia', descricao: 'Academia registrada', tempo: '15 min atrás', icone: 'building' },
    { tipo: 'Treino Criado', descricao: 'Novos treinos criados', tempo: '1 hora atrás', icone: 'dumbbell' },
];

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<DashboardAdminStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadStats() {
            try {
                setLoading(true);
                const data = await dashboardAPI.getAdminStats();
                setStats(data);
            } catch (err: any) {
                console.error('Erro ao carregar estatísticas:', err);
                setError(err.response?.data?.error || 'Erro ao carregar dados');
                // Fallback
                setStats({
                    total_usuarios: 0,
                    total_academias: 0,
                    total_personais: 0,
                    total_alunos: 0,
                    total_treinos: 0,
                    crescimento_usuarios: [],
                    volume_treinos: [],
                    top_academias: [],
                });
            } finally {
                setLoading(false);
            }
        }
        loadStats();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="text-center py-8">
                <p className="text-muted-foreground">Erro ao carregar dados</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                    <Shield className="h-8 w-8" />
                    Painel Administrativo
                </h1>
                <p className="text-muted-foreground">
                    Visão geral do sistema Athlos
                </p>
            </div>

            {error && (
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg">
                    <p className="text-sm">{error}. Mostrando dados de demonstração.</p>
                </div>
            )}

            {/* Status do Sistema */}
            <Card className="border-l-4 border-l-green-500">
                <CardContent className="flex items-center justify-between py-4">
                    <div className="flex items-center gap-3">
                        <CheckCircle2 className="h-6 w-6 text-green-500" />
                        <div>
                            <p className="font-medium">Sistema Operacional</p>
                            <p className="text-sm text-muted-foreground">Todos os serviços funcionando normalmente</p>
                        </div>
                    </div>
                    <Badge variant="outline" className="text-green-600 border-green-600">
                        99.9% Uptime
                    </Badge>
                </CardContent>
            </Card>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total_usuarios}</div>
                        <p className="text-xs text-muted-foreground">
                            usuários cadastrados
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Academias</CardTitle>
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total_academias}</div>
                        <p className="text-xs text-muted-foreground">
                            academias ativas
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Personal Trainers</CardTitle>
                        <UserCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total_personais}</div>
                        <p className="text-xs text-muted-foreground">
                            profissionais ativos
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Treinos Cadastrados</CardTitle>
                        <Dumbbell className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total_treinos}</div>
                        <p className="text-xs text-muted-foreground">
                            treinos no sistema
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                {/* Crescimento de Usuários */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Crescimento de Usuários</CardTitle>
                                <CardDescription>
                                    Evolução nos últimos 6 meses
                                </CardDescription>
                            </div>
                            <Button variant="outline" size="sm" asChild>
                                <Link href="/dashboard/admin/relatorios">
                                    Ver relatórios
                                    <ChevronRight className="ml-1 h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {stats.crescimento_usuarios.length > 0 ? (
                            <ResponsiveContainer width="100%" height={250}>
                                <LineChart data={stats.crescimento_usuarios}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="mes" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="alunos" stroke="#3b82f6" strokeWidth={2} name="Alunos" />
                                    <Line type="monotone" dataKey="personais" stroke="#22c55e" strokeWidth={2} name="Personais" />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-[250px] text-muted-foreground">
                                Sem dados suficientes
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Volume de Treinos */}
                <Card>
                    <CardHeader>
                        <CardTitle>Volume de Treinos</CardTitle>
                        <CardDescription>
                            Treinos criados por mês
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {stats.volume_treinos.length > 0 ? (
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={stats.volume_treinos}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="mes" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="treinos" fill="#8b5cf6" name="Treinos" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-[250px] text-muted-foreground">
                                Sem dados suficientes
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Top Academias */}
            {stats.top_academias.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Building2 className="h-5 w-5" />
                            Top Academias
                        </CardTitle>
                        <CardDescription>
                            Academias com mais alunos
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {stats.top_academias.map((academia, index) => (
                                <div key={academia.id} className="flex items-center gap-4">
                                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-sm">
                                        {index + 1}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">{academia.nome_fantasia}</p>
                                        <p className="text-xs text-muted-foreground">{academia.total_alunos} alunos</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Atividade Recente */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5" />
                        Atividade Recente
                    </CardTitle>
                    <CardDescription>
                        Últimas ações no sistema
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {atividadeRecente.map((atividade, index) => (
                            <div key={index} className="flex items-center gap-4">
                                <div className={`p-2 rounded-full ${atividade.icone === 'alert' ? 'bg-yellow-100' : 'bg-blue-100'
                                    }`}>
                                    {atividade.icone === 'user' && <Users className="h-4 w-4 text-blue-600" />}
                                    {atividade.icone === 'building' && <Building2 className="h-4 w-4 text-blue-600" />}
                                    {atividade.icone === 'dumbbell' && <Dumbbell className="h-4 w-4 text-blue-600" />}
                                    {atividade.icone === 'alert' && <AlertCircle className="h-4 w-4 text-yellow-600" />}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium">{atividade.tipo}</p>
                                    <p className="text-xs text-muted-foreground">{atividade.descricao}</p>
                                </div>
                                <span className="text-xs text-muted-foreground">{atividade.tempo}</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
