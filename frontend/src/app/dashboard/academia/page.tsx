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
    PieChart,
    Pie,
    Cell,
} from 'recharts';
import {
    TrendingUp,
    Users,
    UserCheck,
    Dumbbell,
    Building2,
    ChevronRight,
    Calendar,
    Loader2
} from 'lucide-react';
import Link from 'next/link';
import { dashboardAPI } from '@/lib/api';

interface DashboardAcademiaStats {
    total_alunos: number;
    total_personais: number;
    total_treinos: number;
    taxa_retencao: number;
    personais: Array<{
        user: { first_name: string; last_name: string };
        cref: string;
        especialidade: string;
        total_alunos: number;
    }>;
}

// Dados mockados de backup
const mockAlunosPorMes = [
    { mes: 'Out', novos: 15, total: 169 },
    { mes: 'Nov', novos: 22, total: 185 },
    { mes: 'Dez', novos: 28, total: 205 },
    { mes: 'Jan', novos: 35, total: 233 },
];

const mockDistribuicaoHorario = [
    { horario: 'Manhã (6h-12h)', valor: 35, cor: '#f59e0b' },
    { horario: 'Tarde (12h-18h)', valor: 25, cor: '#3b82f6' },
    { horario: 'Noite (18h-22h)', valor: 40, cor: '#8b5cf6' },
];

export default function AcademiaDashboardPage() {
    const [stats, setStats] = useState<DashboardAcademiaStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadStats() {
            try {
                setLoading(true);
                const data = await dashboardAPI.getAcademiaStats();
                setStats(data);
            } catch (err: any) {
                console.error('Erro ao carregar estatísticas:', err);
                setError(err.response?.data?.error || 'Erro ao carregar dados');
                // Fallback
                setStats({
                    total_alunos: 0,
                    total_personais: 0,
                    total_treinos: 0,
                    taxa_retencao: 0,
                    personais: [],
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
                    <Building2 className="h-8 w-8" />
                    Dashboard da Academia
                </h1>
                <p className="text-muted-foreground">
                    Painel de controle da sua academia
                </p>
            </div>

            {error && (
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg">
                    <p className="text-sm">{error}. Mostrando dados de demonstração.</p>
                </div>
            )}

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="border-l-4 border-l-blue-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total de Alunos</CardTitle>
                        <Users className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total_alunos}</div>
                        <p className="text-xs text-muted-foreground">
                            alunos cadastrados
                        </p>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-green-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Personal Trainers</CardTitle>
                        <UserCheck className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total_personais}</div>
                        <p className="text-xs text-muted-foreground">
                            Ativos na plataforma
                        </p>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-purple-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Treinos</CardTitle>
                        <Dumbbell className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total_treinos}</div>
                        <p className="text-xs text-muted-foreground">
                            treinos cadastrados
                        </p>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-orange-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Taxa de Retenção</CardTitle>
                        <Calendar className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.taxa_retencao.toFixed(1)}%</div>
                        <p className="text-xs text-muted-foreground">
                            de alunos mantidos
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                {/* Crescimento de Alunos */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Crescimento de Alunos</CardTitle>
                                <CardDescription>
                                    Novos cadastros por mês
                                </CardDescription>
                            </div>
                            <Button variant="outline" size="sm" asChild>
                                <Link href="/dashboard/academia/relatorios">
                                    Ver relatórios
                                    <ChevronRight className="ml-1 h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={mockAlunosPorMes}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="mes" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="novos" fill="#22c55e" name="Novos Alunos" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Distribuição por Horário */}
                <Card>
                    <CardHeader>
                        <CardTitle>Distribuição por Horário</CardTitle>
                        <CardDescription>
                            Quando os alunos mais treinam
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie
                                    data={mockDistribuicaoHorario}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={90}
                                    dataKey="valor"
                                    label={({ horario, valor }) => `${valor}%`}
                                >
                                    {mockDistribuicaoHorario.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.cor} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="flex justify-center gap-4 mt-4">
                            {mockDistribuicaoHorario.map((item) => (
                                <div key={item.horario} className="flex items-center gap-2">
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: item.cor }}
                                    />
                                    <span className="text-xs">{item.horario}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Personal Trainers */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <UserCheck className="h-5 w-5" />
                                Personal Trainers
                            </CardTitle>
                            <CardDescription>
                                Profissionais atuando na sua academia
                            </CardDescription>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/dashboard/academia/personais">
                                Gerenciar
                                <ChevronRight className="ml-1 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {stats.personais.length > 0 ? (
                        <div className="space-y-4">
                            {stats.personais.map((personal, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-4 border rounded-lg"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                            {personal.user.first_name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-medium">{personal.user.first_name} {personal.user.last_name}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {personal.total_alunos} alunos • CREF: {personal.cref}
                                            </p>
                                        </div>
                                    </div>
                                    <Badge variant="outline" className="text-green-600 border-green-600">
                                        ativo
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-muted-foreground">
                            Nenhum personal trainer cadastrado ainda
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
