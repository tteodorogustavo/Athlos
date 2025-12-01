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
} from 'recharts';
import {
    TrendingUp,
    Dumbbell,
    Calendar,
    Target,
    Flame,
    Clock,
    Zap,
    ChevronRight,
    Play,
    Loader2
} from 'lucide-react';
import Link from 'next/link';
import { dashboardAPI } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

interface DashboardAlunoStats {
    total_treinos: number;
    treinos_ativos: number;
    sequencia_dias: number;
    tempo_total_minutos: number;
    meta_semanal_atual: number;
    meta_semanal_total: number;
    treinos: Array<{
        id: number;
        nome_treino: string;
        ativo: boolean;
        total_exercicios: number;
    }>;
}

// Dados mockados de backup
const mockProgressoSemanal = [
    { dia: 'Seg', minutos: 65 },
    { dia: 'Ter', minutos: 0 },
    { dia: 'Qua', minutos: 70 },
    { dia: 'Qui', minutos: 55 },
    { dia: 'Sex', minutos: 0 },
    { dia: 'Sáb', minutos: 75 },
    { dia: 'Dom', minutos: 0 },
];

const mockEvolucaoCarga = [
    { semana: 'Sem 1', carga: 2500 },
    { semana: 'Sem 2', carga: 2700 },
    { semana: 'Sem 3', carga: 2850 },
    { semana: 'Sem 4', carga: 3100 },
];

export default function AlunoDashboardPage() {
    const { user } = useAuth();
    const [stats, setStats] = useState<DashboardAlunoStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadStats() {
            try {
                setLoading(true);
                const data = await dashboardAPI.getAlunoStats();
                setStats(data);
            } catch (err: any) {
                console.error('Erro ao carregar estatísticas:', err);
                setError(err.response?.data?.error || 'Erro ao carregar dados');
                // Fallback
                setStats({
                    total_treinos: 0,
                    treinos_ativos: 0,
                    sequencia_dias: 0,
                    tempo_total_minutos: 0,
                    meta_semanal_atual: 0,
                    meta_semanal_total: 5,
                    treinos: [],
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

    const formatTempo = (minutos: number) => {
        const horas = Math.floor(minutos / 60);
        const mins = minutos % 60;
        return horas > 0 ? `${horas}h ${mins}m` : `${mins}m`;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">
                    Olá, {user?.first_name || 'Aluno'}! 👋
                </h1>
                <p className="text-muted-foreground">
                    Continue assim! Você está no caminho certo.
                </p>
            </div>

            {error && (
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg">
                    <p className="text-sm">{error}. Mostrando dados de demonstração.</p>
                </div>
            )}

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="border-l-4 border-l-orange-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Sequência</CardTitle>
                        <Flame className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.sequencia_dias} dias</div>
                        <p className="text-xs text-muted-foreground">
                            Continue firme!
                        </p>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-blue-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total de Treinos</CardTitle>
                        <Calendar className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total_treinos}</div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <span>{stats.treinos_ativos} ativos</span>
                        </p>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-green-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tempo Total</CardTitle>
                        <Clock className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatTempo(stats.tempo_total_minutos)}</div>
                        <p className="text-xs text-muted-foreground">
                            Este mês
                        </p>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-purple-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Meta Semanal</CardTitle>
                        <Target className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.meta_semanal_atual}/{stats.meta_semanal_total}</div>
                        <p className="text-xs text-muted-foreground">
                            {stats.meta_semanal_atual >= stats.meta_semanal_total
                                ? 'Meta atingida! 🎉'
                                : `Falta${stats.meta_semanal_total - stats.meta_semanal_atual > 1 ? 'm' : ''} ${stats.meta_semanal_total - stats.meta_semanal_atual} treino${stats.meta_semanal_total - stats.meta_semanal_atual > 1 ? 's' : ''}!`}
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                {/* Próximos Treinos */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <Dumbbell className="h-5 w-5" />
                                    Meus Treinos
                                </CardTitle>
                                <CardDescription>
                                    Treinos programados pelo seu personal
                                </CardDescription>
                            </div>
                            <Button variant="outline" size="sm" asChild>
                                <Link href="/dashboard/aluno/treinos">
                                    Ver todos
                                    <ChevronRight className="ml-1 h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {stats.treinos.length > 0 ? (
                            <div className="space-y-4">
                                {stats.treinos.map(treino => (
                                    <div
                                        key={treino.id}
                                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`p-2 rounded-full ${treino.ativo ? 'bg-green-100' : 'bg-gray-100'
                                                }`}>
                                                <Dumbbell className={`h-4 w-4 ${treino.ativo ? 'text-green-600' : 'text-gray-600'
                                                    }`} />
                                            </div>
                                            <div>
                                                <p className="font-medium">{treino.nome_treino}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {treino.total_exercicios} exercícios
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {treino.ativo ? (
                                                <Badge variant="secondary" className="bg-green-100 text-green-700">
                                                    Ativo
                                                </Badge>
                                            ) : (
                                                <Badge variant="secondary">
                                                    Inativo
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">
                                Nenhum treino cadastrado ainda
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Progresso Semanal */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Zap className="h-5 w-5" />
                            Progresso Semanal
                        </CardTitle>
                        <CardDescription>
                            Minutos treinados esta semana
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={mockProgressoSemanal}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="dia" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="minutos" fill="#3b82f6" name="Minutos" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Evolução de Carga */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5" />
                                Evolução de Carga
                            </CardTitle>
                            <CardDescription>
                                Volume total de carga nas últimas 4 semanas
                            </CardDescription>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/dashboard/aluno/relatorios">
                                Ver relatórios completos
                                <ChevronRight className="ml-1 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={mockEvolucaoCarga}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="semana" />
                            <YAxis />
                            <Tooltip formatter={(value) => [`${value} kg`, 'Volume Total']} />
                            <Line
                                type="monotone"
                                dataKey="carga"
                                stroke="#22c55e"
                                strokeWidth={3}
                                dot={{ r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
}
