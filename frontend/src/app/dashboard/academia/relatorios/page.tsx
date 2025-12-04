'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
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
    PieChart,
    Pie,
    Cell,
    AreaChart,
    Area,
    Legend,
} from 'recharts';
import {
    BarChart3,
    TrendingUp,
    Users,
    Dumbbell,
    Calendar,
    Building2,
    Activity,
    Award,
    UserCheck,
    Loader2
} from 'lucide-react';
import { relatorioAPI } from '@/lib/api';

interface TreinoRanking {
    nome: string;
    total: number;
}

interface CategoriaRanking {
    categoria: string;
    total: number;
    cor: string;
}

interface Crescimento {
    mes: string;
    alunos: number;
    treinos: number;
}

interface PersonalAtivo {
    id: number;
    nome: string;
    treinos: number;
    alunos: number;
}

interface RelatorioAcademiaData {
    total_alunos: number;
    total_personais: number;
    total_treinos: number;
    treinos_periodo: number;
    media_treinos_dia: number;
    taxa_retencao: number;
    treinos_ranking: TreinoRanking[];
    categorias_ranking: CategoriaRanking[];
    crescimento: Crescimento[];
    personais_ativos: PersonalAtivo[];
}

export default function RelatoriosAcademiaPage() {
    const [periodoSelecionado, setPeriodoSelecionado] = useState('mes');
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<RelatorioAcademiaData | null>(null);

    useEffect(() => {
        const fetchRelatorio = async () => {
            setLoading(true);
            try {
                const response = await relatorioAPI.getAcademiaReport(periodoSelecionado);
                setData(response);
            } catch (error) {
                console.error('Erro ao carregar relatório:', error);
                setData({
                    total_alunos: 0,
                    total_personais: 0,
                    total_treinos: 0,
                    treinos_periodo: 0,
                    media_treinos_dia: 0,
                    taxa_retencao: 0,
                    treinos_ranking: [],
                    categorias_ranking: [],
                    crescimento: [],
                    personais_ativos: [],
                });
            } finally {
                setLoading(false);
            }
        };

        fetchRelatorio();
    }, [periodoSelecionado]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!data) {
        return (
            <div className="flex items-center justify-center h-96">
                <p className="text-muted-foreground">Erro ao carregar relatórios</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                        <BarChart3 className="h-8 w-8" />
                        Relatórios da Academia
                    </h1>
                    <p className="text-muted-foreground">
                        Métricas e estatísticas gerais da sua academia
                    </p>
                </div>
                <Select value={periodoSelecionado} onValueChange={setPeriodoSelecionado}>
                    <SelectTrigger className="w-[160px]">
                        <SelectValue placeholder="Período" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="semana">Última Semana</SelectItem>
                        <SelectItem value="mes">Último Mês</SelectItem>
                        <SelectItem value="trimestre">Trimestre</SelectItem>
                        <SelectItem value="ano">Último Ano</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* KPIs */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total de Alunos</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.total_alunos}</div>
                        <p className="text-xs text-muted-foreground">
                            Alunos matriculados
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Personal Trainers</CardTitle>
                        <UserCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.total_personais}</div>
                        <p className="text-xs text-muted-foreground">
                            Profissionais ativos
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total de Treinos</CardTitle>
                        <Dumbbell className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.total_treinos}</div>
                        <p className="text-xs text-muted-foreground">
                            {data.treinos_periodo} no período
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Taxa de Retenção</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.taxa_retencao}%</div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <TrendingUp className="h-3 w-3 text-green-500" />
                            <span className="text-green-500">Excelente</span>
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs de Relatórios */}
            <Tabs defaultValue="visao-geral" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="visao-geral">Visão Geral</TabsTrigger>
                    <TabsTrigger value="treinos">Treinos</TabsTrigger>
                    <TabsTrigger value="personais">Personal Trainers</TabsTrigger>
                    <TabsTrigger value="crescimento">Crescimento</TabsTrigger>
                </TabsList>

                {/* Visão Geral */}
                <TabsContent value="visao-geral" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        {/* Crescimento */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5" />
                                    Crescimento Mensal
                                </CardTitle>
                                <CardDescription>
                                    Novos alunos e treinos por mês
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {data.crescimento.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <AreaChart data={data.crescimento}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="mes" />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Area
                                                type="monotone"
                                                dataKey="alunos"
                                                stackId="1"
                                                stroke="#3b82f6"
                                                fill="#3b82f6"
                                                fillOpacity={0.6}
                                                name="Alunos"
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="treinos"
                                                stackId="2"
                                                stroke="#22c55e"
                                                fill="#22c55e"
                                                fillOpacity={0.6}
                                                name="Treinos"
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                                        Nenhum dado disponível
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Categorias mais usadas */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Dumbbell className="h-5 w-5" />
                                    Categorias de Exercícios
                                </CardTitle>
                                <CardDescription>
                                    Grupos musculares mais trabalhados
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {data.categorias_ranking.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie
                                                data={data.categorias_ranking}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={100}
                                                dataKey="total"
                                                label={({ categoria, total }) => `${categoria}: ${total}`}
                                            >
                                                {data.categorias_ranking.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.cor} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                                        Nenhum dado disponível
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Cards de métricas */}
                    <div className="grid gap-4 md:grid-cols-3">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg">Média de Treinos/Dia</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-blue-500">
                                    {data.media_treinos_dia}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Treinos realizados por dia
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg">Alunos por Personal</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-green-500">
                                    {data.total_personais > 0
                                        ? Math.round(data.total_alunos / data.total_personais)
                                        : 0
                                    }
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Média de alunos
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg">Treinos por Aluno</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-purple-500">
                                    {data.total_alunos > 0
                                        ? (data.total_treinos / data.total_alunos).toFixed(1)
                                        : 0
                                    }
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Média de treinos
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Treinos */}
                <TabsContent value="treinos" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        {/* Ranking de treinos */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Award className="h-5 w-5" />
                                    Treinos Mais Realizados
                                </CardTitle>
                                <CardDescription>
                                    Ranking dos treinos mais populares
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {data.treinos_ranking.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={data.treinos_ranking} layout="vertical">
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis type="number" />
                                            <YAxis dataKey="nome" type="category" width={120} />
                                            <Tooltip />
                                            <Bar dataKey="total" fill="#3b82f6" name="Vezes" radius={[0, 4, 4, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                                        Nenhum treino registrado
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Categorias mais usadas */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Dumbbell className="h-5 w-5" />
                                    Categorias Mais Usadas
                                </CardTitle>
                                <CardDescription>
                                    Distribuição por grupo muscular
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {data.categorias_ranking.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={data.categorias_ranking}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="categoria" />
                                            <YAxis />
                                            <Tooltip />
                                            <Bar dataKey="total" name="Exercícios" radius={[4, 4, 0, 0]}>
                                                {data.categorias_ranking.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.cor} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                                        Nenhum dado disponível
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Tabela de treinos */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Ranking de Treinos</CardTitle>
                            <CardDescription>
                                Lista completa dos treinos mais realizados
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {data.treinos_ranking.length > 0 ? (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-12">#</TableHead>
                                            <TableHead>Nome do Treino</TableHead>
                                            <TableHead className="text-right">Vezes Realizado</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {data.treinos_ranking.map((treino, index) => (
                                            <TableRow key={treino.nome}>
                                                <TableCell>
                                                    <Badge variant={index < 3 ? 'default' : 'secondary'}>
                                                        {index + 1}º
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="font-medium">{treino.nome}</TableCell>
                                                <TableCell className="text-right">{treino.total}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <div className="py-10 text-center text-muted-foreground">
                                    Nenhum treino registrado
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Personal Trainers */}
                <TabsContent value="personais" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <UserCheck className="h-5 w-5" />
                                Personal Trainers Mais Ativos
                            </CardTitle>
                            <CardDescription>
                                Ranking de profissionais por atividade
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {data.personais_ativos.length > 0 ? (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-12">#</TableHead>
                                            <TableHead>Personal Trainer</TableHead>
                                            <TableHead className="text-center">Treinos Criados</TableHead>
                                            <TableHead className="text-center">Alunos</TableHead>
                                            <TableHead className="text-center">Performance</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {data.personais_ativos.map((personal, index) => (
                                            <TableRow key={personal.id}>
                                                <TableCell>
                                                    <Badge variant={index < 3 ? 'default' : 'secondary'}>
                                                        {index + 1}º
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="font-medium">{personal.nome}</TableCell>
                                                <TableCell className="text-center">{personal.treinos}</TableCell>
                                                <TableCell className="text-center">{personal.alunos}</TableCell>
                                                <TableCell className="text-center">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <div className="w-20 bg-gray-200 rounded-full h-2">
                                                            <div
                                                                className="h-2 rounded-full bg-green-500"
                                                                style={{
                                                                    width: `${Math.min(
                                                                        (personal.treinos / Math.max(...data.personais_ativos.map(p => p.treinos))) * 100,
                                                                        100
                                                                    )}%`
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <div className="py-10 text-center text-muted-foreground">
                                    Nenhum personal trainer cadastrado
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Gráfico de barras dos personais */}
                    {data.personais_ativos.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Comparativo de Atividade</CardTitle>
                                <CardDescription>
                                    Treinos e alunos por personal trainer
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={data.personais_ativos}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="nome" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="treinos" fill="#3b82f6" name="Treinos" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="alunos" fill="#22c55e" name="Alunos" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                {/* Crescimento */}
                <TabsContent value="crescimento" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                Evolução ao Longo do Tempo
                            </CardTitle>
                            <CardDescription>
                                Crescimento de alunos e treinos nos últimos meses
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {data.crescimento.length > 0 ? (
                                <ResponsiveContainer width="100%" height={400}>
                                    <LineChart data={data.crescimento}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="mes" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Line
                                            type="monotone"
                                            dataKey="alunos"
                                            stroke="#3b82f6"
                                            strokeWidth={2}
                                            dot={{ r: 4 }}
                                            name="Novos Alunos"
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="treinos"
                                            stroke="#22c55e"
                                            strokeWidth={2}
                                            dot={{ r: 4 }}
                                            name="Novos Treinos"
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                                    Nenhum dado de crescimento disponível
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Cards de resumo */}
                    <div className="grid gap-4 md:grid-cols-4">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg">Total de Alunos</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-blue-500">
                                    {data.total_alunos}
                                </div>
                                <p className="text-sm text-muted-foreground">Atualmente matriculados</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg">Total de Personais</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-green-500">
                                    {data.total_personais}
                                </div>
                                <p className="text-sm text-muted-foreground">Profissionais ativos</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg">Total de Treinos</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-purple-500">
                                    {data.total_treinos}
                                </div>
                                <p className="text-sm text-muted-foreground">Treinos cadastrados</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg">Taxa de Retenção</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-orange-500">
                                    {data.taxa_retencao}%
                                </div>
                                <p className="text-sm text-muted-foreground">Alunos retidos</p>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
