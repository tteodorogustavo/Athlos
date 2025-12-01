"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dumbbell, Calendar, Clock, ChevronRight, Loader2, Play } from "lucide-react";
import { treinoAPI } from "@/lib/api";

interface ItemTreino {
    id: number;
    exercicio: {
        id: number;
        nome: string;
        category: string;
    };
    series: number;
    repeticoes: number;
    carga?: number;
    observacoes?: string;
}

interface Treino {
    id: number;
    nome: string;
    descricao?: string;
    data_criacao: string;
    ativo: boolean;
    itens?: ItemTreino[];
}

export default function AlunoTreinosPage() {
    const [treinos, setTreinos] = useState<Treino[]>([]);
    const [loading, setLoading] = useState(true);
    const [treinoSelecionado, setTreinoSelecionado] = useState<Treino | null>(null);

    useEffect(() => {
        async function fetchTreinos() {
            try {
                const response = await treinoAPI.list();
                setTreinos(response.data || response);
            } catch (error) {
                console.error("Erro ao buscar treinos:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchTreinos();
    }, []);

    const treinosAtivos = treinos.filter(t => t.ativo);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Meus Treinos</h1>
                <p className="text-muted-foreground">
                    Visualize e acompanhe seus treinos personalizados
                </p>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total de Treinos</CardTitle>
                        <Dumbbell className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{treinos.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Treinos Ativos</CardTitle>
                        <Play className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{treinosAtivos.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Exercícios no Total</CardTitle>
                        <Dumbbell className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {treinos.reduce((acc, t) => acc + (t.itens?.length || 0), 0)}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Treino Selecionado */}
            {treinoSelecionado && (
                <Card className="border-primary">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>{treinoSelecionado.nome}</CardTitle>
                                <CardDescription>{treinoSelecionado.descricao}</CardDescription>
                            </div>
                            <Button variant="outline" onClick={() => setTreinoSelecionado(null)}>
                                Fechar
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {treinoSelecionado.itens?.length === 0 ? (
                                <p className="text-muted-foreground text-center py-4">
                                    Nenhum exercício neste treino
                                </p>
                            ) : (
                                treinoSelecionado.itens?.map((item, index) => (
                                    <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                                            {index + 1}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-medium">{item.exercicio?.nome}</h4>
                                            <p className="text-sm text-muted-foreground">
                                                {item.series} séries x {item.repeticoes} repetições
                                                {item.carga && ` • ${item.carga}kg`}
                                            </p>
                                            {item.observacoes && (
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    {item.observacoes}
                                                </p>
                                            )}
                                        </div>
                                        <Badge variant="outline">{item.exercicio?.category}</Badge>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Lista de Treinos */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {treinos.length === 0 ? (
                    <Card className="col-span-full">
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <Dumbbell className="h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-medium mb-2">Nenhum treino encontrado</h3>
                            <p className="text-muted-foreground text-center">
                                Seus treinos aparecerão aqui quando seu personal criar um para você.
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    treinos.map((treino) => (
                        <Card
                            key={treino.id}
                            className={`cursor-pointer transition-all hover:shadow-md ${treinoSelecionado?.id === treino.id ? 'ring-2 ring-primary' : ''
                                }`}
                            onClick={() => setTreinoSelecionado(treino)}
                        >
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg">{treino.nome}</CardTitle>
                                    <Badge variant={treino.ativo ? "default" : "secondary"}>
                                        {treino.ativo ? "Ativo" : "Inativo"}
                                    </Badge>
                                </div>
                                <CardDescription>{treino.descricao}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        <Dumbbell className="h-4 w-4" />
                                        {treino.itens?.length || 0} exercícios
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Calendar className="h-4 w-4" />
                                        {new Date(treino.data_criacao).toLocaleDateString('pt-BR')}
                                    </div>
                                </div>
                                <Button variant="ghost" className="w-full mt-4" size="sm" asChild>
                                    <Link href={`/dashboard/aluno/treinos/${treino.id}`}>
                                        Ver Detalhes
                                        <ChevronRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
