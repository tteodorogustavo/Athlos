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
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
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
    TrendingDown,
    Dumbbell,
    Calendar,
    Target,
    Activity,
    Award,
    Flame,
    Clock,
    Loader2
} from 'lucide-react';
import { relatorioAPI } from '@/lib/api';

interface EvolucaoCarga {
    exercicio: string;
    dados: { data: string; carga: number }[];
}

interface ProgressoCategoria {
    categoria: string;
    exercicios: number;
    mediaCarga: number;
    totalSeries: number;
    totalReps: number;
}

interface HistoricoTreino {
    id: number;
    nome: string;
    data: string;
    categoria: string;
    exercicios: number;
    ativo: boolean;
    detalhes: { exercicio: string; series: number; reps: number; carga: number }[];
}

interface RelatorioAlunoData {
    total_treinos: number;
    treinos_ativos: number;
    treinos_periodo: number;
    sequencia_dias: number;
    tempo_total_minutos: number;
    evolucao_carga: EvolucaoCarga[];
    progresso_categoria: ProgressoCategoria[];
    historico: HistoricoTreino[];
}

const categoriasCores: { [key: string]: string } = {
    'Peito': '#ef4444',
    'Costas': '#3b82f6',
    'Pernas': '#22c55e',
    'Ombros': '#f59e0b',
    'Bíceps': '#8b5cf6',
    'Tríceps': '#ec4899',
    'Core': '#14b8a6',
    'Cardio': '#f97316',
    'Outros': '#6b7280',
};

export default function RelatoriosAlunoPage() {
    const [periodoSelecionado, setPeriodoSelecionado] = useState('mes');
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<RelatorioAlunoData | null>(null);

    useEffect(() => {
        const fetchRelatorio = async () => {
            setLoading(true);
            try {
                const response = await relatorioAPI.getAlunoReport(periodoSelecionado);
                setData(response);
            } catch (error) {
                console.error('Erro ao carregar relatório:', error);
                setData({
                    total_treinos: 0,
                    treinos_ativos: 0,
                    treinos_periodo: 0,
                    sequencia_dias: 0,
                    tempo_total_minutos: 0,
                    evolucao_carga: [],
                    progresso_categoria: [],
                    historico: [],
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

    // Preparar dados para o gráfico de evolução
    const evolucaoChartData = data.evolucao_carga.length > 0
        ? data.evolucao_carga[0].dados.map((_, index) => {
            const point: any = { data: data.evolucao_carga[0].dados[index]?.data || '' };
            data.evolucao_carga.forEach(ex => {
                if (ex.dados[index]) {
                    point[ex.exercicio] = ex.dados[index].carga;
                }
            });
            return point;
        })
        : [];

    // Preparar dados para o gráfico de pizza das categorias
    const categoriasPieData = data.progresso_categoria.map(cat => ({
        nome: cat.categoria,
        valor: cat.exercicios,
        cor: categoriasCores[cat.categoria] || '#6b7280'
    }));

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                        <BarChart3 className="h-8 w-8" />
                        Meus Relatórios
                    </h1>
                    <p className="text-muted-foreground">
                        Acompanhe sua evolução e progresso nos treinos
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
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total de Treinos</CardTitle>
                        <Dumbbell className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.total_treinos}</div>
                        <p className="text-xs text-muted-foreground">
                            {data.treinos_periodo} no período selecionado
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Treinos Ativos</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.treinos_ativos}</div>
                        <p className="text-xs text-muted-foreground">
                            Treinos disponíveis
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Sequência</CardTitle>
                        <Flame className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.sequencia_dias} dias</div>
                        <p className="text-xs text-muted-foreground">
                            Continue assim! 🔥
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tempo Total</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {Math.floor(data.tempo_total_minutos / 60)}h {data.tempo_total_minutos % 60}m
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Tempo estimado de treino
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs de Relatórios */}
            <Tabs defaultValue="evolucao" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="evolucao">Evolução de Carga</TabsTrigger>
                    <TabsTrigger value="categorias">Por Categoria</TabsTrigger>
                    <TabsTrigger value="historico">Histórico</TabsTrigger>
                </TabsList>

                {/* Evolução de Carga */}
                <TabsContent value="evolucao" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5" />
                                Evolução de Carga por Exercício
                            </CardTitle>
                            <CardDescription>
                                Acompanhe o progresso de carga nos seus principais exercícios
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {evolucaoChartData.length > 0 ? (
                                <ResponsiveContainer width="100%" height={400}>
                                    <LineChart data={evolucaoChartData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="data" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        {data.evolucao_carga.slice(0, 5).map((ex, index) => {
                                            const colors = ['#ef4444', '#3b82f6', '#22c55e', '#f59e0b', '#8b5cf6'];
                                            return (
                                                <Line
                                                    key={ex.exercicio}
                                                    type="monotone"
                                                    dataKey={ex.exercicio}
                                                    stroke={colors[index % colors.length]}
                                                    strokeWidth={2}
                                                    dot={{ r: 4 }}
                                                    name={`${ex.exercicio} (kg)`}
                                                />
                                            );
                                        })}
                                    </LineChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                                    <div className="text-center">
                                        <Dumbbell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                        <p>Nenhum dado de evolução disponível</p>
                                        <p className="text-sm">Continue treinando para ver seu progresso!</p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Cards de resumo por exercício */}
                    {data.evolucao_carga.length > 0 && (
                        <div className="grid gap-4 md:grid-cols-3">
                            {data.evolucao_carga.slice(0, 3).map((ex, index) => {
                                const primeiro = ex.dados[0]?.carga || 0;
                                const ultimo = ex.dados[ex.dados.length - 1]?.carga || 0;
                                const progresso = primeiro > 0 ? ((ultimo - primeiro) / primeiro * 100).toFixed(1) : 0;
                                const colors = ['text-red-500', 'text-blue-500', 'text-green-500'];

                                return (
                                    <Card key={ex.exercicio}>
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-lg">{ex.exercicio}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className={`text-3xl font-bold ${colors[index % colors.length]}`}>
                                                {Number(progresso) >= 0 ? '+' : ''}{progresso}%
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                {primeiro}kg → {ultimo}kg
                                            </p>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    )}
                </TabsContent>

                {/* Por Categoria */}
                <TabsContent value="categorias" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        {/* Gráfico de Pizza */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Target className="h-5 w-5" />
                                    Distribuição por Categoria
                                </CardTitle>
                                <CardDescription>
                                    Grupos musculares mais trabalhados
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {categoriasPieData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie
                                                data={categoriasPieData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={100}
                                                dataKey="valor"
                                                label={({ nome, valor }) => `${nome}: ${valor}`}
                                            >
                                                {categoriasPieData.map((entry, index) => (
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

                        {/* Gráfico de Barras */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Activity className="h-5 w-5" />
                                    Exercícios por Categoria
                                </CardTitle>
                                <CardDescription>
                                    Quantidade de exercícios realizados
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {data.progresso_categoria.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={data.progresso_categoria} layout="vertical">
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis type="number" />
                                            <YAxis dataKey="categoria" type="category" width={80} />
                                            <Tooltip />
                                            <Bar dataKey="exercicios" fill="#3b82f6" name="Exercícios" radius={[0, 4, 4, 0]} />
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

                    {/* Tabela detalhada por categoria */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Detalhes por Categoria</CardTitle>
                            <CardDescription>
                                Estatísticas detalhadas de cada grupo muscular
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {data.progresso_categoria.length > 0 ? (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Categoria</TableHead>
                                            <TableHead className="text-center">Exercícios</TableHead>
                                            <TableHead className="text-center">Média de Carga</TableHead>
                                            <TableHead className="text-center">Total de Séries</TableHead>
                                            <TableHead className="text-center">Total de Reps</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {data.progresso_categoria.map(cat => (
                                            <TableRow key={cat.categoria}>
                                                <TableCell className="font-medium">
                                                    <div className="flex items-center gap-2">
                                                        <div
                                                            className="w-3 h-3 rounded-full"
                                                            style={{ backgroundColor: categoriasCores[cat.categoria] || '#6b7280' }}
                                                        />
                                                        {cat.categoria}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-center">{cat.exercicios}</TableCell>
                                                <TableCell className="text-center">{cat.mediaCarga} kg</TableCell>
                                                <TableCell className="text-center">{cat.totalSeries}</TableCell>
                                                <TableCell className="text-center">{cat.totalReps}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <div className="py-10 text-center text-muted-foreground">
                                    Nenhuma categoria registrada
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Histórico */}
                <TabsContent value="historico" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                Histórico de Treinos
                            </CardTitle>
                            <CardDescription>
                                Seus treinos realizados no período selecionado
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {data.historico.length > 0 ? (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Treino</TableHead>
                                            <TableHead>Data</TableHead>
                                            <TableHead>Categoria</TableHead>
                                            <TableHead className="text-center">Exercícios</TableHead>
                                            <TableHead className="text-center">Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {data.historico.map(treino => (
                                            <TableRow key={treino.id}>
                                                <TableCell className="font-medium">{treino.nome}</TableCell>
                                                <TableCell>
                                                    {new Date(treino.data).toLocaleDateString('pt-BR')}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">{treino.categoria}</Badge>
                                                </TableCell>
                                                <TableCell className="text-center">{treino.exercicios}</TableCell>
                                                <TableCell className="text-center">
                                                    <Badge variant={treino.ativo ? 'default' : 'secondary'}>
                                                        {treino.ativo ? 'Ativo' : 'Inativo'}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <div className="py-10 text-center text-muted-foreground">
                                    <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                    <p>Nenhum treino registrado no período</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Resumo do Histórico */}
                    <div className="grid gap-4 md:grid-cols-3">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg">Treinos no Período</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-blue-500">
                                    {data.historico.length}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Treinos registrados
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg">Exercícios Totais</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-green-500">
                                    {data.historico.reduce((acc, t) => acc + t.exercicios, 0)}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Exercícios realizados
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg">Média por Treino</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-purple-500">
                                    {data.historico.length > 0
                                        ? Math.round(data.historico.reduce((acc, t) => acc + t.exercicios, 0) / data.historico.length)
                                        : 0
                                    }
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Exercícios por sessão
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
