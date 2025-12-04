"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Edit, Loader2, Dumbbell, User, Calendar, Target } from "lucide-react";
import { treinoAPI } from "@/lib/api";

interface Exercicio {
    id: number;
    nome: string;
    category?: string;
}

interface ItemTreino {
    id: number;
    exercicio: Exercicio;
    series: number;
    repeticoes: number;
    carga?: number;
    descanso?: number;
    observacoes?: string;
    ordem: number;
}

interface Treino {
    id: number;
    nome: string;
    descricao?: string;
    objetivo?: string;
    ativo: boolean;
    data_criacao: string;
    aluno?: {
        user_id: number;
        user: {
            first_name: string;
            last_name: string;
        };
    };
    itens?: ItemTreino[];
}

export default function TreinoDetalhesPage() {
    const params = useParams();
    const [treino, setTreino] = useState<Treino | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchTreino() {
            try {
                const response = await treinoAPI.get(Number(params.id));
                setTreino(response.data || response);
            } catch (error) {
                console.error("Erro ao buscar treino:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchTreino();
    }, [params.id]);

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
                <Link href="/dashboard/personal/treinos">
                    <Button className="mt-4">Voltar para lista</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/personal/treinos">
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">{treino.nome}</h1>
                        <p className="text-muted-foreground">
                            Detalhes do treino
                        </p>
                    </div>
                </div>
                <Link href={`/dashboard/personal/treinos/${params.id}/editar`}>
                    <Button>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                    </Button>
                </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Status</CardTitle>
                        <Dumbbell className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <Badge variant={treino.ativo ? "default" : "secondary"}>
                            {treino.ativo ? "Ativo" : "Inativo"}
                        </Badge>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Exercícios</CardTitle>
                        <Dumbbell className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {treino.itens?.length || 0}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Objetivo</CardTitle>
                        <Target className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm font-medium">{treino.objetivo || "-"}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Criado em</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm font-medium">
                            {new Date(treino.data_criacao).toLocaleDateString("pt-BR")}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {treino.aluno && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Aluno
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Link href={`/dashboard/personal/alunos/${treino.aluno.user_id}`}>
                            <Button variant="outline">
                                {treino.aluno.user.first_name} {treino.aluno.user.last_name}
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            )}

            {treino.descricao && (
                <Card>
                    <CardHeader>
                        <CardTitle>Descrição</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">{treino.descricao}</p>
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Exercícios do Treino</CardTitle>
                    <CardDescription>
                        Lista de exercícios com séries, repetições e carga
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {!treino.itens || treino.itens.length === 0 ? (
                        <p className="text-center text-muted-foreground py-8">
                            Nenhum exercício adicionado a este treino
                        </p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-12">#</TableHead>
                                    <TableHead>Exercício</TableHead>
                                    <TableHead>Categoria</TableHead>
                                    <TableHead className="text-center">Séries</TableHead>
                                    <TableHead className="text-center">Repetições</TableHead>
                                    <TableHead className="text-center">Carga (kg)</TableHead>
                                    <TableHead className="text-center">Descanso (s)</TableHead>
                                    <TableHead>Observações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {treino.itens
                                    .sort((a, b) => a.ordem - b.ordem)
                                    .map((item, index) => (
                                        <TableRow key={item.id}>
                                            <TableCell className="font-medium">{index + 1}</TableCell>
                                            <TableCell className="font-medium">
                                                {item.exercicio?.nome || "-"}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">
                                                    {item.exercicio?.category || "Outros"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-center">{item.series}</TableCell>
                                            <TableCell className="text-center">{item.repeticoes}</TableCell>
                                            <TableCell className="text-center">
                                                {item.carga || "-"}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {item.descanso || "-"}
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {item.observacoes || "-"}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
