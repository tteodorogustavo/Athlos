'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Building2,
    Users,
    ClipboardList,
    TrendingUp,
    Plus,
    ArrowRight,
    Dumbbell,
    Loader2
} from 'lucide-react';
import Link from 'next/link';
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { dashboardAPI } from '@/lib/api';

interface DashboardStats {
    total_alunos: number;
    total_academias: number;
    total_treinos: number;
    taxa_atividade: number;
    treinos_por_mes: Array<{ mes: string; treinos: number }>;
    top_exercicios: Array<{ exercicio__nome: string; total: number }>;
    alunos_recentes: Array<{
        user_id: number;
        nome: string;
        objetivo: string;
        email: string;
    }>;
}

const chartConfig = {
    treinos: {
        label: "Treinos",
        color: "hsl(var(--chart-1))",
    },
    total: {
        label: "Total",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig;

const CHART_COLORS = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))',
];

export default function PersonalDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadStats() {
            try {
                setLoading(true);
                const data = await dashboardAPI.getPersonalStats();
                setStats(data);
            } catch (err: any) {
                console.error('Erro ao carregar estatísticas:', err);
                setError(err.response?.data?.error || 'Erro ao carregar dados');
                // Fallback para dados mock em caso de erro
                setStats({
                    total_alunos: 0,
                    total_academias: 0,
                    total_treinos: 0,
                    taxa_atividade: 0,
                    treinos_por_mes: [],
                    top_exercicios: [],
                    alunos_recentes: [],
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

    // Prepara dados para o gráfico de pizza
    const exerciciosComCores = stats.top_exercicios.map((ex, index) => ({
        nome: ex.exercicio__nome,
        total: ex.total,
        fill: CHART_COLORS[index % CHART_COLORS.length],
    }));

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground">
                        Bem-vindo ao seu painel de controle, Personal Trainer!
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button asChild>
                        <Link href="/dashboard/personal/alunos/novo">
                            <Plus className="mr-2 h-4 w-4" />
                            Novo Aluno
                        </Link>
                    </Button>
                    <Button variant="outline" asChild>
                        <Link href="/dashboard/personal/treinos/novo">
                            <ClipboardList className="mr-2 h-4 w-4" />
                            Novo Treino
                        </Link>
                    </Button>
                </div>
            </div>

            {error && (
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg">
                    <p className="text-sm">{error}. Mostrando dados de demonstração.</p>
                </div>
            )}

            {/* Cards de Estatísticas */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Academias</CardTitle>
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total_academias}</div>
                        <p className="text-xs text-muted-foreground">
                            academias cadastradas
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Alunos</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total_alunos}</div>
                        <p className="text-xs text-muted-foreground">
                            alunos ativos
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Treinos</CardTitle>
                        <ClipboardList className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total_treinos}</div>
                        <p className="text-xs text-muted-foreground">
                            treinos criados
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Taxa de Atividade</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats.taxa_atividade.toFixed(1)}%
                        </div>
                        <p className="text-xs text-muted-foreground">
                            treinos ativos
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Gráficos */}
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Treinos por Mês</CardTitle>
                        <CardDescription>
                            Evolução dos treinos criados nos últimos meses
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig} className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={stats.treinos_por_mes}>
                                    <XAxis dataKey="mes" />
                                    <YAxis />
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                    <Bar dataKey="treinos" fill="var(--color-treinos)" radius={4} />
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Exercícios Mais Usados</CardTitle>
                        <CardDescription>
                            Top 5 exercícios nos treinos
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {exerciciosComCores.length > 0 ? (
                            <ChartContainer config={chartConfig} className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <ChartTooltip content={<ChartTooltipContent />} />
                                        <Pie
                                            data={exerciciosComCores}
                                            dataKey="total"
                                            nameKey="nome"
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={100}
                                            label={({ nome }) => nome}
                                        >
                                            {exerciciosComCores.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.fill} />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                            </ChartContainer>
                        ) : (
                            <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                                Nenhum exercício cadastrado ainda
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Alunos Recentes */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Alunos Recentes</CardTitle>
                        <CardDescription>
                            Últimos alunos cadastrados
                        </CardDescription>
                    </div>
                    <Button variant="ghost" asChild>
                        <Link href="/dashboard/personal/alunos">
                            Ver todos
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </CardHeader>
                <CardContent>
                    {stats.alunos_recentes.length > 0 ? (
                        <div className="space-y-4">
                            {stats.alunos_recentes.map((aluno) => (
                                <div
                                    key={aluno.user_id}
                                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 bg-primary/10 rounded-full">
                                            <Users className="h-4 w-4 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-medium">{aluno.nome}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {aluno.email}
                                            </p>
                                        </div>
                                    </div>
                                    <Badge variant="secondary">{aluno.objetivo || 'Sem objetivo definido'}</Badge>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-muted-foreground">
                            Nenhum aluno cadastrado ainda
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
