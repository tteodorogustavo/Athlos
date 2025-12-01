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
    TrendingDown,
    Users,
    Dumbbell,
    Calendar,
    Target,
    Activity,
    Award,
    Loader2
} from 'lucide-react';
import { relatorioAPI, alunoAPI } from '@/lib/api';

interface AlunoOption {
    id: number;
    nome: string;
}

interface RelatorioData {
    treinos_criados: number;
    variacao_treinos: number;
    taxa_frequencia: number;
    variacao_frequencia: number;
    alunos_ativos: number;
    alunos_total: number;
    media_progresso: number;
    treinos_por_mes: { mes: string; treinos: number; alunos: number }[];
    progresso_carga: { semana: string;[key: string]: any }[];
    distribuicao_exercicios: { nome: string; valor: number; cor: string }[];
    frequencia_semanal: { dia: string; alunos: number }[];
    top_exercicios: { exercicio: string; vezes: number; categoria: string }[];
    alunos: { id: number; nome: string; treinos: number; frequencia: number; ultimoTreino: string | null }[];
}

export default function RelatoriosPersonalPage() {
    const [periodoSelecionado, setPeriodoSelecionado] = useState('mes');
    const [alunoSelecionado, setAlunoSelecionado] = useState('todos');
    const [loading, setLoading] = useState(true);
    const [alunos, setAlunos] = useState<AlunoOption[]>([]);
    const [data, setData] = useState<RelatorioData | null>(null);

    useEffect(() => {
        const fetchAlunos = async () => {
            try {
                const response = await alunoAPI.list();
                const alunosList = (response.results || response).map((a: any) => ({
                    id: a.id,
                    nome: a.nome || `${a.user?.first_name || ''} ${a.user?.last_name || ''}`.trim() || a.user?.email || 'Aluno'
                }));
                setAlunos(alunosList);
            } catch (error) {
                console.error('Erro ao carregar alunos:', error);
            }
        };
        fetchAlunos();
    }, []);

    useEffect(() => {
        const fetchRelatorio = async () => {
            setLoading(true);
            try {
                const response = await relatorioAPI.getPersonalReport(periodoSelecionado, alunoSelecionado);
                setData(response);
            } catch (error) {
                console.error('Erro ao carregar relatório:', error);
                // Fallback com dados vazios
                setData({
                    treinos_criados: 0,
                    variacao_treinos: 0,
                    taxa_frequencia: 0,
                    variacao_frequencia: 0,
                    alunos_ativos: 0,
                    alunos_total: 0,
                    media_progresso: 0,
                    treinos_por_mes: [],
                    progresso_carga: [],
                    distribuicao_exercicios: [],
                    frequencia_semanal: [],
                    top_exercicios: [],
                    alunos: [],
                });
            } finally {
                setLoading(false);
            }
        };

        fetchRelatorio();
    }, [periodoSelecionado, alunoSelecionado]);

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
                        Relatórios
                    </h1>
                    <p className="text-muted-foreground">
                        Acompanhe o desempenho dos seus alunos e métricas de treino
                    </p>
                </div>
                <div className="flex gap-2">
                    <Select value={periodoSelecionado} onValueChange={setPeriodoSelecionado}>
                        <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Período" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="semana">Última Semana</SelectItem>
                            <SelectItem value="mes">Último Mês</SelectItem>
                            <SelectItem value="trimestre">Trimestre</SelectItem>
                            <SelectItem value="ano">Último Ano</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={alunoSelecionado} onValueChange={setAlunoSelecionado}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Aluno" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="todos">Todos os Alunos</SelectItem>
                            {alunos.map(aluno => (
                                <SelectItem key={aluno.id} value={String(aluno.id)}>
                                    {aluno.nome}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Treinos Criados</CardTitle>
                        <Dumbbell className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.treinos_criados}</div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                            {data.variacao_treinos >= 0 ? (
                                <>
                                    <TrendingUp className="h-3 w-3 text-green-500" />
                                    <span className="text-green-500">+{data.variacao_treinos}%</span>
                                </>
                            ) : (
                                <>
                                    <TrendingDown className="h-3 w-3 text-red-500" />
                                    <span className="text-red-500">{data.variacao_treinos}%</span>
                                </>
                            )} vs período anterior
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Taxa de Frequência</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.taxa_frequencia}%</div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                            {data.variacao_frequencia >= 0 ? (
                                <>
                                    <TrendingUp className="h-3 w-3 text-green-500" />
                                    <span className="text-green-500">+{data.variacao_frequencia}%</span>
                                </>
                            ) : (
                                <>
                                    <TrendingDown className="h-3 w-3 text-red-500" />
                                    <span className="text-red-500">{data.variacao_frequencia}%</span>
                                </>
                            )} vs período anterior
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Alunos Ativos</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.alunos_ativos}</div>
                        <p className="text-xs text-muted-foreground">
                            De {data.alunos_total} alunos cadastrados
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Média de Progresso</CardTitle>
                        <Target className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+{data.media_progresso}%</div>
                        <p className="text-xs text-muted-foreground">
                            Aumento médio de carga
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs de Relatórios */}
            <Tabs defaultValue="visao-geral" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="visao-geral">Visão Geral</TabsTrigger>
                    <TabsTrigger value="treinos">Treinos por Aluno</TabsTrigger>
                    <TabsTrigger value="frequencia">Frequência</TabsTrigger>
                    <TabsTrigger value="progresso">Progresso de Carga</TabsTrigger>
                </TabsList>

                {/* Visão Geral */}
                <TabsContent value="visao-geral" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        {/* Gráfico de Treinos por Mês */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5" />
                                    Treinos por Mês
                                </CardTitle>
                                <CardDescription>
                                    Quantidade de treinos criados nos últimos 6 meses
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {data.treinos_por_mes.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={data.treinos_por_mes}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="mes" />
                                            <YAxis />
                                            <Tooltip />
                                            <Bar dataKey="treinos" fill="#3b82f6" name="Treinos" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                                        Nenhum dado disponível
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Distribuição por Grupo Muscular */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Dumbbell className="h-5 w-5" />
                                    Distribuição por Grupo Muscular
                                </CardTitle>
                                <CardDescription>
                                    Exercícios mais trabalhados nos treinos
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {data.distribuicao_exercicios.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie
                                                data={data.distribuicao_exercicios}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={100}
                                                dataKey="valor"
                                                label={({ nome, valor }) => `${nome}: ${valor}`}
                                            >
                                                {data.distribuicao_exercicios.map((entry, index) => (
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

                    {/* Top Exercícios */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Award className="h-5 w-5" />
                                Top Exercícios Mais Utilizados
                            </CardTitle>
                            <CardDescription>
                                Ranking dos exercícios mais presentes nos treinos
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {data.top_exercicios.length > 0 ? (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-12">#</TableHead>
                                            <TableHead>Exercício</TableHead>
                                            <TableHead>Categoria</TableHead>
                                            <TableHead className="text-right">Vezes Usado</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {data.top_exercicios.map((ex, index) => (
                                            <TableRow key={ex.exercicio}>
                                                <TableCell className="font-medium">
                                                    <Badge variant={index === 0 ? 'default' : 'secondary'}>
                                                        {index + 1}º
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="font-medium">{ex.exercicio}</TableCell>
                                                <TableCell>{ex.categoria}</TableCell>
                                                <TableCell className="text-right">{ex.vezes}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <div className="py-10 text-center text-muted-foreground">
                                    Nenhum exercício registrado no período
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Treinos por Aluno */}
                <TabsContent value="treinos" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Treinos por Aluno</CardTitle>
                            <CardDescription>
                                Quantidade de treinos e status de cada aluno
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {data.alunos.length > 0 ? (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Aluno</TableHead>
                                            <TableHead className="text-center">Total de Treinos</TableHead>
                                            <TableHead className="text-center">Frequência</TableHead>
                                            <TableHead className="text-center">Último Treino</TableHead>
                                            <TableHead className="text-center">Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {data.alunos.map(aluno => (
                                            <TableRow key={aluno.id}>
                                                <TableCell className="font-medium">{aluno.nome}</TableCell>
                                                <TableCell className="text-center">{aluno.treinos}</TableCell>
                                                <TableCell className="text-center">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <div className="w-20 bg-gray-200 rounded-full h-2">
                                                            <div
                                                                className={`h-2 rounded-full ${aluno.frequencia >= 80 ? 'bg-green-500' :
                                                                        aluno.frequencia >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                                                    }`}
                                                                style={{ width: `${Math.min(aluno.frequencia, 100)}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-sm">{aluno.frequencia}%</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    {aluno.ultimoTreino
                                                        ? new Date(aluno.ultimoTreino).toLocaleDateString('pt-BR')
                                                        : '-'
                                                    }
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Badge variant={aluno.frequencia >= 70 ? 'default' : 'secondary'}>
                                                        {aluno.frequencia >= 70 ? 'Ativo' : 'Irregular'}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <div className="py-10 text-center text-muted-foreground">
                                    Nenhum aluno cadastrado
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Frequência */}
                <TabsContent value="frequencia" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Frequência Semanal</CardTitle>
                                <CardDescription>
                                    Distribuição de treinos por dia da semana
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {data.frequencia_semanal.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={data.frequencia_semanal}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="dia" />
                                            <YAxis />
                                            <Tooltip />
                                            <Bar dataKey="alunos" fill="#22c55e" name="Treinos" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                                        Nenhum dado disponível
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Evolução de Alunos Ativos</CardTitle>
                                <CardDescription>
                                    Quantidade de alunos por mês
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {data.treinos_por_mes.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <AreaChart data={data.treinos_por_mes}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="mes" />
                                            <YAxis />
                                            <Tooltip />
                                            <Area
                                                type="monotone"
                                                dataKey="alunos"
                                                stroke="#8b5cf6"
                                                fill="#8b5cf6"
                                                fillOpacity={0.3}
                                                name="Alunos"
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
                    </div>
                </TabsContent>

                {/* Progresso de Carga */}
                <TabsContent value="progresso" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Evolução de Carga por Exercício</CardTitle>
                            <CardDescription>
                                Progresso médio de carga nos exercícios principais (últimas 4 semanas)
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {data.progresso_carga.length > 0 ? (
                                <ResponsiveContainer width="100%" height={400}>
                                    <LineChart data={data.progresso_carga}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="semana" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        {Object.keys(data.progresso_carga[0] || {})
                                            .filter(key => key !== 'semana')
                                            .slice(0, 3)
                                            .map((key, index) => {
                                                const colors = ['#ef4444', '#3b82f6', '#22c55e'];
                                                return (
                                                    <Line
                                                        key={key}
                                                        type="monotone"
                                                        dataKey={key}
                                                        stroke={colors[index % colors.length]}
                                                        strokeWidth={2}
                                                        name={`${key} (kg)`}
                                                    />
                                                );
                                            })
                                        }
                                    </LineChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                                    Nenhum dado de progresso disponível
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Cards de comparativo */}
                    <div className="grid gap-4 md:grid-cols-3">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg">Exercícios Cadastrados</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-blue-500">
                                    {data.top_exercicios.length}
                                </div>
                                <p className="text-sm text-muted-foreground">Diferentes exercícios no período</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg">Total de Treinos</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-green-500">{data.treinos_criados}</div>
                                <p className="text-sm text-muted-foreground">Treinos no período selecionado</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg">Média de Frequência</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-purple-500">{data.taxa_frequencia}%</div>
                                <p className="text-sm text-muted-foreground">Taxa média dos alunos</p>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
