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
  ChartLegend,
  ChartLegendContent
} from "@/components/ui/chart";
import { 
  AreaChart, 
  Area, 
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
  TrendingUp, 
  Activity,
  Server,
  Clock,
  BarChart3,
  Loader2
} from "lucide-react";
import { relatorioAPI } from "@/lib/api";

interface CrescimentoUsuarios {
  mes: string;
  total: number;
  novos: number;
  alunos: number;
  personais: number;
  academias: number;
}

interface VolumeTreinos {
  mes: string;
  total: number;
  por_dia: number;
}

interface DistribuicaoUsuarios {
  tipo: string;
  quantidade: number;
  percentual: number;
}

interface TopAcademia {
  nome: string;
  alunos: number;
  personais: number;
  treinos: number;
}

interface ExercicioPopular {
  nome: string;
  categoria: string;
  uso_total: number;
  academias_usando: number;
}

interface RelatorioAdminData {
  kpis: {
    total_usuarios: number;
    crescimento_usuarios: number;
    total_academias: number;
    crescimento_academias: number;
    total_treinos: number;
    crescimento_treinos: number;
    usuarios_ativos: number;
    taxa_atividade: number;
  };
  crescimento_usuarios: CrescimentoUsuarios[];
  volume_treinos: VolumeTreinos[];
  distribuicao_usuarios: DistribuicaoUsuarios[];
  top_academias: TopAcademia[];
  exercicios_populares: ExercicioPopular[];
  metricas_sistema: {
    tempo_resposta_medio: number;
    requisicoes_por_dia: number;
    taxa_erro: number;
    uptime: number;
  };
}

const chartConfig = {
  total: {
    label: "Total",
    color: "hsl(var(--chart-1))",
  },
  novos: {
    label: "Novos",
    color: "hsl(var(--chart-2))",
  },
  alunos: {
    label: "Alunos",
    color: "hsl(var(--chart-3))",
  },
  personais: {
    label: "Personais",
    color: "hsl(var(--chart-4))",
  },
  academias: {
    label: "Academias",
    color: "hsl(var(--chart-5))",
  },
  treinos: {
    label: "Treinos",
    color: "hsl(var(--chart-1))",
  },
};

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

export default function RelatoriosAdminPage() {
  const [loading, setLoading] = useState(true);
  const [periodo, setPeriodo] = useState("12m");
  const [relatorioData, setRelatorioData] = useState<RelatorioAdminData | null>(null);

  useEffect(() => {
    async function fetchRelatorio() {
      setLoading(true);
      try {
        const response = await relatorioAPI.getAdminReport(periodo);
        setRelatorioData(response.data);
      } catch (error) {
        console.error("Erro ao buscar relatório:", error);
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

  if (!relatorioData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Erro ao carregar relatório</p>
      </div>
    );
  }

  const { kpis, crescimento_usuarios, volume_treinos, distribuicao_usuarios, top_academias, exercicios_populares, metricas_sistema } = relatorioData;

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
            <SelectItem value="3m">Últimos 3 meses</SelectItem>
            <SelectItem value="6m">Últimos 6 meses</SelectItem>
            <SelectItem value="12m">Últimos 12 meses</SelectItem>
            <SelectItem value="all">Todo o período</SelectItem>
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
            <div className="text-2xl font-bold">{kpis.total_usuarios.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className={kpis.crescimento_usuarios >= 0 ? "text-green-600" : "text-red-600"}>
                {kpis.crescimento_usuarios >= 0 ? "+" : ""}{kpis.crescimento_usuarios}%
              </span>
              {" "}vs período anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Academias</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.total_academias}</div>
            <p className="text-xs text-muted-foreground">
              <span className={kpis.crescimento_academias >= 0 ? "text-green-600" : "text-red-600"}>
                {kpis.crescimento_academias >= 0 ? "+" : ""}{kpis.crescimento_academias}%
              </span>
              {" "}vs período anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Treinos Cadastrados</CardTitle>
            <Dumbbell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.total_treinos.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className={kpis.crescimento_treinos >= 0 ? "text-green-600" : "text-red-600"}>
                {kpis.crescimento_treinos >= 0 ? "+" : ""}{kpis.crescimento_treinos}%
              </span>
              {" "}vs período anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.usuarios_ativos.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">{kpis.taxa_atividade}%</span> taxa de atividade
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Métricas do Sistema */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo de Resposta</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metricas_sistema.tempo_resposta_medio}ms</div>
            <p className="text-xs text-muted-foreground">média por requisição</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Requisições/Dia</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metricas_sistema.requisicoes_por_dia.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">média diária</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Erro</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metricas_sistema.taxa_erro}%</div>
            <Badge variant={metricas_sistema.taxa_erro < 1 ? "default" : "destructive"} className="mt-1">
              {metricas_sistema.taxa_erro < 1 ? "Saudável" : "Atenção"}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Uptime</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metricas_sistema.uptime}%</div>
            <Badge variant={metricas_sistema.uptime >= 99 ? "default" : "secondary"} className="mt-1">
              {metricas_sistema.uptime >= 99 ? "Excelente" : "Bom"}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Tabs com Gráficos Detalhados */}
      <Tabs defaultValue="usuarios" className="space-y-4">
        <TabsList>
          <TabsTrigger value="usuarios">Crescimento de Usuários</TabsTrigger>
          <TabsTrigger value="treinos">Volume de Treinos</TabsTrigger>
          <TabsTrigger value="distribuicao">Distribuição</TabsTrigger>
          <TabsTrigger value="academias">Top Academias</TabsTrigger>
          <TabsTrigger value="exercicios">Exercícios Populares</TabsTrigger>
        </TabsList>

        {/* Crescimento de Usuários */}
        <TabsContent value="usuarios" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Crescimento Total de Usuários</CardTitle>
                <CardDescription>Evolução mensal de usuários na plataforma</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={crescimento_usuarios}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mes" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area 
                        type="monotone" 
                        dataKey="total" 
                        stackId="1"
                        stroke="var(--color-total)" 
                        fill="var(--color-total)"
                        fillOpacity={0.6}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Novos Usuários por Tipo</CardTitle>
                <CardDescription>Cadastros mensais por categoria</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={crescimento_usuarios}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mes" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <ChartLegend content={<ChartLegendContent />} />
                      <Bar dataKey="alunos" stackId="a" fill="var(--color-alunos)" />
                      <Bar dataKey="personais" stackId="a" fill="var(--color-personais)" />
                      <Bar dataKey="academias" stackId="a" fill="var(--color-academias)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Taxa de Crescimento</CardTitle>
              <CardDescription>Novos usuários por mês</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={crescimento_usuarios}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line 
                      type="monotone" 
                      dataKey="novos" 
                      stroke="var(--color-novos)"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Volume de Treinos */}
        <TabsContent value="treinos" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Volume Mensal de Treinos</CardTitle>
                <CardDescription>Total de treinos cadastrados por mês</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={volume_treinos}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mes" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="total" fill="var(--color-treinos)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Média de Treinos por Dia</CardTitle>
                <CardDescription>Distribuição diária ao longo dos meses</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={volume_treinos}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mes" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area 
                        type="monotone" 
                        dataKey="por_dia" 
                        stroke="var(--color-treinos)" 
                        fill="var(--color-treinos)"
                        fillOpacity={0.4}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Distribuição de Usuários */}
        <TabsContent value="distribuicao" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Tipo de Usuário</CardTitle>
                <CardDescription>Proporção de cada categoria</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={distribuicao_usuarios}
                        dataKey="quantidade"
                        nameKey="tipo"
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        label={({ tipo, percentual }) => `${tipo}: ${percentual}%`}
                      >
                        {distribuicao_usuarios.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Detalhamento por Categoria</CardTitle>
                <CardDescription>Números absolutos e percentuais</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tipo de Usuário</TableHead>
                      <TableHead className="text-right">Quantidade</TableHead>
                      <TableHead className="text-right">Percentual</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {distribuicao_usuarios.map((item, index) => (
                      <TableRow key={item.tipo}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            />
                            {item.tipo}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">{item.quantidade.toLocaleString()}</TableCell>
                        <TableCell className="text-right">{item.percentual}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Top Academias */}
        <TabsContent value="academias" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Academias da Plataforma</CardTitle>
              <CardDescription>Academias com maior número de alunos e treinos</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">Rank</TableHead>
                    <TableHead>Academia</TableHead>
                    <TableHead className="text-right">Alunos</TableHead>
                    <TableHead className="text-right">Personais</TableHead>
                    <TableHead className="text-right">Treinos</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {top_academias.map((academia, index) => (
                    <TableRow key={academia.nome}>
                      <TableCell>
                        <Badge variant={index < 3 ? "default" : "secondary"}>
                          #{index + 1}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{academia.nome}</TableCell>
                      <TableCell className="text-right">{academia.alunos}</TableCell>
                      <TableCell className="text-right">{academia.personais}</TableCell>
                      <TableCell className="text-right">{academia.treinos}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Comparativo de Academias</CardTitle>
              <CardDescription>Distribuição de alunos e treinos</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={top_academias} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="nome" type="category" width={150} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Bar dataKey="alunos" fill="var(--color-alunos)" />
                    <Bar dataKey="treinos" fill="var(--color-treinos)" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Exercícios Populares */}
        <TabsContent value="exercicios" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Exercícios Mais Populares</CardTitle>
              <CardDescription>Exercícios mais utilizados em toda a plataforma</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">Rank</TableHead>
                    <TableHead>Exercício</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead className="text-right">Uso Total</TableHead>
                    <TableHead className="text-right">Academias</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {exercicios_populares.map((exercicio, index) => (
                    <TableRow key={exercicio.nome}>
                      <TableCell>
                        <Badge variant={index < 3 ? "default" : "secondary"}>
                          #{index + 1}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{exercicio.nome}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{exercicio.categoria}</Badge>
                      </TableCell>
                      <TableCell className="text-right">{exercicio.uso_total.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{exercicio.academias_usando}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Top 10 por Uso</CardTitle>
                <CardDescription>Exercícios mais utilizados</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={exercicios_populares.slice(0, 10)} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="nome" type="category" width={120} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="uso_total" fill="var(--color-total)" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Categoria</CardTitle>
                <CardDescription>Exercícios agrupados por categoria</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={exercicios_populares.reduce((acc, curr) => {
                          const existing = acc.find(item => item.categoria === curr.categoria);
                          if (existing) {
                            existing.uso_total += curr.uso_total;
                          } else {
                            acc.push({ categoria: curr.categoria, uso_total: curr.uso_total });
                          }
                          return acc;
                        }, [] as { categoria: string; uso_total: number }[])}
                        dataKey="uso_total"
                        nameKey="categoria"
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        label={({ categoria }) => categoria}
                      >
                        {exercicios_populares.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
