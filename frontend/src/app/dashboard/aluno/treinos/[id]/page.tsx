"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Calendar, Clock, Dumbbell, Loader2, Target, User } from "lucide-react";
import { treinoAPI } from "@/lib/api";

interface Exercicio {
    id: number;
    ordem: number;
    exercicio: {
        id: number;
        nome: string;
        grupo_muscular: string;
        descricao?: string;
    };
    series: number;
    repeticoes: string;
    carga?: string;
    descanso?: number;
    observacoes?: string;
}

interface Treino {
    id: number;
    nome: string;
    descricao?: string;
    tipo: string;
    data_inicio: string;
    data_fim?: string;
    ativo: boolean;
    personal?: {
        id: number;
        user: {
            first_name: string;
            last_name: string;
        };
    };
    exercicios?: Exercicio[];
}

export default function TreinoDetalhesPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const [treino, setTreino] = useState<Treino | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadTreino() {
            try {
                const data = await treinoAPI.get(resolvedParams.id);
                setTreino(data);
            } catch (error) {
                console.error("Erro ao carregar treino:", error);
            } finally {
                setLoading(false);
            }
        }
        loadTreino();
    }, [resolvedParams.id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!treino) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground">Treino não encontrado</p>
                <Link href="/dashboard/aluno/treinos">
                    <Button variant="outline" className="mt-4">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Voltar
                    </Button>
                </Link>
            </div>
        );
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("pt-BR");
    };

    const grupoMuscularColors: Record<string, string> = {
        "Peito": "bg-red-100 text-red-700",
        "Costas": "bg-blue-100 text-blue-700",
        "Pernas": "bg-green-100 text-green-700",
        "Ombros": "bg-purple-100 text-purple-700",
        "Bíceps": "bg-yellow-100 text-yellow-700",
        "Tríceps": "bg-orange-100 text-orange-700",
        "Abdômen": "bg-pink-100 text-pink-700",
        "Cardio": "bg-cyan-100 text-cyan-700",
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/dashboard/aluno/treinos">
                    <Button variant="outline" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <h1 className="text-3xl font-bold">{treino.nome}</h1>
                        <Badge variant={treino.ativo ? "default" : "secondary"}>
                            {treino.ativo ? "Ativo" : "Inativo"}
                        </Badge>
                    </div>
                    <p className="text-muted-foreground">
                        {treino.descricao || "Detalhes do seu treino"}
                    </p>
                </div>
            </div>

            {/* Info Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tipo</CardTitle>
                        <Target className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold capitalize">{treino.tipo}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Exercícios</CardTitle>
                        <Dumbbell className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{treino.exercicios?.length || 0}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Início</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatDate(treino.data_inicio)}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Personal</CardTitle>
                        <User className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-lg font-bold">
                            {treino.personal
                                ? `${treino.personal.user.first_name} ${treino.personal.user.last_name}`
                                : "Não atribuído"
                            }
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Exercícios */}
            <Card>
                <CardHeader>
                    <CardTitle>Exercícios do Treino</CardTitle>
                    <CardDescription>
                        Lista de exercícios na ordem de execução
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {treino.exercicios && treino.exercicios.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[50px]">#</TableHead>
                                    <TableHead>Exercício</TableHead>
                                    <TableHead>Grupo Muscular</TableHead>
                                    <TableHead className="text-center">Séries</TableHead>
                                    <TableHead className="text-center">Repetições</TableHead>
                                    <TableHead className="text-center">Carga</TableHead>
                                    <TableHead className="text-center">Descanso</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {treino.exercicios.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-bold">{item.ordem}</TableCell>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium">{item.exercicio.nome}</p>
                                                {item.observacoes && (
                                                    <p className="text-sm text-muted-foreground">
                                                        {item.observacoes}
                                                    </p>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={grupoMuscularColors[item.exercicio.grupo_muscular] || ""}
                                            >
                                                {item.exercicio.grupo_muscular}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-center font-semibold">
                                            {item.series}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {item.repeticoes}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {item.carga || "-"}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {item.descanso ? `${item.descanso}s` : "-"}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="text-center py-12">
                            <Dumbbell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <p className="text-muted-foreground">
                                Nenhum exercício cadastrado neste treino
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Dicas do Treino */}
            <Card>
                <CardHeader>
                    <CardTitle>💡 Dicas para o Treino</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-2 text-muted-foreground">
                        <li>• Faça um aquecimento de 5-10 minutos antes de começar</li>
                        <li>• Respeite o tempo de descanso entre as séries</li>
                        <li>• Mantenha uma boa postura durante os exercícios</li>
                        <li>• Hidrate-se durante todo o treino</li>
                        <li>• Em caso de dor, pare o exercício e consulte seu personal</li>
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
}
