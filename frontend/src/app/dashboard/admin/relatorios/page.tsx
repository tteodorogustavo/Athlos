"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";
import {
  Users,
  Building2,
  Dumbbell,
  Activity,
  UserCheck,
  Loader2
} from "lucide-react";
import { relatorioAPI } from "@/lib/api";

interface CrescimentoItem {
  mes: string;
  alunos: number;
  personais: number;
  academias: number;
}

interface VolumeTreino {
  mes: string;
  treinos: number;
}

interface DistribuicaoUsuario {
  tipo: string;
  total: number;
  cor: string;
}

interface TopAcademia {
  id: number;
  nome: string;
  alunos: number;
  personais: number;
  treinos: number;
}

interface ExercicioPopular {
  exercicio: string;
  categoria: string;
  usos: number;
}

interface RelatorioAdminData {
  total_usuarios: number;
  total_academias: number;
  total_personais: number;
  total_alunos: number;
  total_treinos: number;
  total_exercicios: number;
  usuarios_ativos: number;
  taxa_usuarios_ativos: number;
  treinos_periodo: number;
  treinos_por_dia: number;
  crescimento_usuarios: CrescimentoItem[];
  volume_treinos: VolumeTreino[];
  distribuicao_usuarios: DistribuicaoUsuario[];
  top_academias: TopAcademia[];
  exercicios_populares: ExercicioPopular[];
  performance: {
    total_requisicoes: number;
    tempo_medio_resposta: number;
    uptime: number;
    erros_24h: number;
  };
}

const chartConfig = {
  alunos: {
    label: "Alunos",
    color: "hsl(var(--chart-1))",
  },
  personais: {
    label: "Personais",
    color: "hsl(var(--chart-2))",
  },
  academias: {
    label: "Academias",
    color: "hsl(var(--chart-3))",
  },
  treinos: {
    label: "Treinos",
    color: "hsl(var(--chart-4))",
  },
};

const COLORS = [
  "#3b82f6",
  "#22c55e",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
];

export default function RelatoriosAdminPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [periodo, setPeriodo] = useState("mes");
  const [relatorioData, setRelatorioData] = useState<RelatorioAdminData | null>(null);

  useEffect(() => {
    async function fetchRelatorio() {
      setLoading(true);
      setError(null);
      try {
        const data = await relatorioAPI.getAdminReport(periodo);
        setRelatorioData(data);
      } catch (err: any) {
        console.error("Erro ao buscar relatório:", err);
        setError(err.response?.data?.error || "Erro ao carregar relatório. Verifique se você tem permissão de administrador.");
      } finally {
        setLoading(false);
      }
    }

    fetchRelatorio();
  }, [periodo]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  if (!relatorioData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Nenhum dado disponível</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Relatórios do Sistema</h1>
          <p className="text-muted-foreground">
            Métricas e KPIs gerais da plataforma Athlos
          </p>
        </div>
        <Select value={periodo} onValueChange={setPeriodo}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Selecione o período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="semana">Última semana</SelectItem>
            <SelectItem value="mes">Último mês</SelectItem>
            <SelectItem value="trimestre">Último trimestre</SelectItem>
            <SelectItem value="ano">Último ano</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* KPIs Principais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{relatorioData.total_usuarios}</div>
            <p className="text-xs text-muted-foreground">
              {relatorioData.usuarios_ativos} ativos ({relatorioData.taxa_usuarios_ativos}%)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Academias</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{relatorioData.total_academias}</div>
            <p className="text-xs text-muted-foreground">
              Cadastradas na plataforma
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Treinos</CardTitle>
            <Dumbbell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{relatorioData.total_treinos}</div>
            <p className="text-xs text-muted-foreground">
              {relatorioData.treinos_por_dia}/dia no período
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Exercícios</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{relatorioData.total_exercicios}</div>
            <p className="text-xs text-muted-foreground">
              No catálogo
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Cards de Detalhamento */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Personal Trainers</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{relatorioData.total_personais}</div>
            <p className="text-xs text-muted-foreground">
              Profissionais cadastrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alunos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{relatorioData.total_alunos}</div>
            <p className="text-xs text-muted-foreground">
              Usuários treinando
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="crescimento" className="space-y-4">
        <TabsList>
          <TabsTrigger value="crescimento">Crescimento</TabsTrigger>
          <TabsTrigger value="treinos">Volume de Treinos</TabsTrigger>
          <TabsTrigger value="distribuicao">Distribuição</TabsTrigger>
          <TabsTrigger value="rankings">Rankings</TabsTrigger>
        </TabsList>

        {/* Crescimento de Usuários */}
        <TabsContent value="crescimento" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Crescimento de Usuários</CardTitle>
              <CardDescription>Novos cadastros por mês</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={relatorioData.crescimento_usuarios}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="alunos" fill="var(--color-alunos)" name="Alunos" />
                    <Bar dataKey="personais" fill="var(--color-personais)" name="Personais" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Volume de Treinos */}
        <TabsContent value="treinos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Volume de Treinos</CardTitle>
              <CardDescription>Treinos criados por mês</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={relatorioData.volume_treinos}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="treinos"
                      stroke="var(--color-treinos)"
                      strokeWidth={2}
                      name="Treinos"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Distribuição de Usuários */}
        <TabsContent value="distribuicao" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Distribuição de Usuários</CardTitle>
              <CardDescription>Por tipo de conta</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={relatorioData.distribuicao_usuarios}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ tipo, total }) => `${tipo}: ${total}`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="total"
                        nameKey="tipo"
                      >
                        {relatorioData.distribuicao_usuarios.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.cor || COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <ChartTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
                <div className="flex flex-col justify-center space-y-4">
                  {relatorioData.distribuicao_usuarios.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: item.cor || COLORS[index % COLORS.length] }}
                        />
                        <span>{item.tipo}</span>
                      </div>
                      <span className="font-bold">{item.total}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Rankings */}
        <TabsContent value="rankings" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Top Academias */}
            <Card>
              <CardHeader>
                <CardTitle>Top Academias</CardTitle>
                <CardDescription>Por número de alunos</CardDescription>
              </CardHeader>
              <CardContent>
                {relatorioData.top_academias.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">
                    Nenhuma academia cadastrada
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Academia</TableHead>
                        <TableHead className="text-center">Alunos</TableHead>
                        <TableHead className="text-center">Personais</TableHead>
                        <TableHead className="text-center">Treinos</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {relatorioData.top_academias.slice(0, 5).map((academia) => (
                        <TableRow key={academia.id}>
                          <TableCell className="font-medium">{academia.nome}</TableCell>
                          <TableCell className="text-center">{academia.alunos}</TableCell>
                          <TableCell className="text-center">{academia.personais}</TableCell>
                          <TableCell className="text-center">{academia.treinos}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            {/* Exercícios Populares */}
            <Card>
              <CardHeader>
                <CardTitle>Exercícios Populares</CardTitle>
                <CardDescription>Mais utilizados nos treinos</CardDescription>
              </CardHeader>
              <CardContent>
                {relatorioData.exercicios_populares.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">
                    Nenhum exercício utilizado ainda
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Exercício</TableHead>
                        <TableHead>Categoria</TableHead>
                        <TableHead className="text-center">Usos</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {relatorioData.exercicios_populares.slice(0, 5).map((exercicio, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{exercicio.exercicio}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{exercicio.categoria}</Badge>
                          </TableCell>
                          <TableCell className="text-center">{exercicio.usos}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Performance do Sistema */}
      <Card>
        <CardHeader>
          <CardTitle>Performance do Sistema</CardTitle>
          <CardDescription>Métricas de disponibilidade</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Uptime</p>
              <p className="text-2xl font-bold text-green-600">{relatorioData.performance?.uptime || 99.9}%</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Tempo Médio Resposta</p>
              <p className="text-2xl font-bold">{relatorioData.performance?.tempo_medio_resposta || 0}ms</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Requisições/Dia</p>
              <p className="text-2xl font-bold">{relatorioData.performance?.total_requisicoes || 0}</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Erros (24h)</p>
              <p className="text-2xl font-bold text-red-600">{relatorioData.performance?.erros_24h || 0}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
