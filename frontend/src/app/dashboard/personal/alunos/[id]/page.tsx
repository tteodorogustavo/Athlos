"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Edit, Loader2, Mail, Phone, Calendar, Target, Dumbbell, User } from "lucide-react";
import { alunoAPI, treinoAPI } from "@/lib/api";

interface Aluno {
    user_id: number;
    user: {
        id: number;
        email: string;
        first_name: string;
        last_name: string;
    };
    telefone?: string;
    data_nascimento?: string;
    objetivo?: string;
    sexo?: string;
    peso?: number;
    altura?: number;
    observacoes?: string;
}

interface Treino {
    id: number;
    nome: string;
    objetivo?: string;
    ativo: boolean;
    data_criacao: string;
}

export default function AlunoDetalhesPage() {
    const params = useParams();
    const [aluno, setAluno] = useState<Aluno | null>(null);
    const [treinos, setTreinos] = useState<Treino[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const alunoResponse = await alunoAPI.get(Number(params.id));
                setAluno(alunoResponse.data || alunoResponse);

                const treinosResponse = await treinoAPI.list();
                const alunoTreinos = (treinosResponse.data || treinosResponse).filter(
                    (t: Treino & { aluno?: number }) => t.aluno === Number(params.id)
                );
                setTreinos(alunoTreinos);
            } catch (error) {
                console.error("Erro ao buscar dados:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [params.id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!aluno) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground">Aluno não encontrado</p>
                <Link href="/dashboard/personal/alunos">
                    <Button className="mt-4">Voltar para lista</Button>
                </Link>
            </div>
        );
    }

    const calcularIdade = (dataNascimento?: string) => {
        if (!dataNascimento) return null;
        const hoje = new Date();
        const nascimento = new Date(dataNascimento);
        let idade = hoje.getFullYear() - nascimento.getFullYear();
        const mes = hoje.getMonth() - nascimento.getMonth();
        if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
            idade--;
        }
        return idade;
    };

    const calcularIMC = () => {
        if (!aluno.peso || !aluno.altura) return null;
        const alturaM = aluno.altura / 100;
        return (aluno.peso / (alturaM * alturaM)).toFixed(1);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/personal/alunos">
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">
                            {aluno.user?.first_name} {aluno.user?.last_name}
                        </h1>
                        <p className="text-muted-foreground">
                            Detalhes do aluno
                        </p>
                    </div>
                </div>
                <Link href={`/dashboard/personal/alunos/${params.id}/editar`}>
                    <Button>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                    </Button>
                </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Treinos Ativos</CardTitle>
                        <Dumbbell className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {treinos.filter(t => t.ativo).length}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">IMC</CardTitle>
                        <User className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {calcularIMC() || "-"}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Idade</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {calcularIdade(aluno.data_nascimento) || "-"} anos
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="info" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="info">Informações</TabsTrigger>
                    <TabsTrigger value="treinos">Treinos ({treinos.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="info">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informações Pessoais</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    <span>{aluno.user?.email}</span>
                                </div>
                                {aluno.telefone && (
                                    <div className="flex items-center gap-2">
                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                        <span>{aluno.telefone}</span>
                                    </div>
                                )}
                                {aluno.data_nascimento && (
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <span>{new Date(aluno.data_nascimento).toLocaleDateString("pt-BR")}</span>
                                    </div>
                                )}
                                {aluno.objetivo && (
                                    <div className="flex items-center gap-2">
                                        <Target className="h-4 w-4 text-muted-foreground" />
                                        <Badge variant="outline">{aluno.objetivo}</Badge>
                                    </div>
                                )}
                            </div>

                            <div className="grid gap-4 md:grid-cols-3">
                                {aluno.sexo && (
                                    <div>
                                        <p className="text-sm text-muted-foreground">Sexo</p>
                                        <p className="font-medium">
                                            {aluno.sexo === "M" ? "Masculino" : aluno.sexo === "F" ? "Feminino" : "Outro"}
                                        </p>
                                    </div>
                                )}
                                {aluno.peso && (
                                    <div>
                                        <p className="text-sm text-muted-foreground">Peso</p>
                                        <p className="font-medium">{aluno.peso} kg</p>
                                    </div>
                                )}
                                {aluno.altura && (
                                    <div>
                                        <p className="text-sm text-muted-foreground">Altura</p>
                                        <p className="font-medium">{aluno.altura} cm</p>
                                    </div>
                                )}
                            </div>

                            {aluno.observacoes && (
                                <div>
                                    <p className="text-sm text-muted-foreground mb-2">Observações</p>
                                    <p className="text-sm bg-muted p-4 rounded-lg">{aluno.observacoes}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="treinos">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Treinos do Aluno</CardTitle>
                                <CardDescription>Lista de treinos atribuídos</CardDescription>
                            </div>
                            <Link href={`/dashboard/personal/treinos/novo?aluno=${params.id}`}>
                                <Button>Novo Treino</Button>
                            </Link>
                        </CardHeader>
                        <CardContent>
                            {treinos.length === 0 ? (
                                <p className="text-center text-muted-foreground py-8">
                                    Nenhum treino encontrado para este aluno
                                </p>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Nome</TableHead>
                                            <TableHead>Objetivo</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Data</TableHead>
                                            <TableHead>Ações</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {treinos.map(treino => (
                                            <TableRow key={treino.id}>
                                                <TableCell className="font-medium">{treino.nome}</TableCell>
                                                <TableCell>{treino.objetivo || "-"}</TableCell>
                                                <TableCell>
                                                    <Badge variant={treino.ativo ? "default" : "secondary"}>
                                                        {treino.ativo ? "Ativo" : "Inativo"}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    {new Date(treino.data_criacao).toLocaleDateString("pt-BR")}
                                                </TableCell>
                                                <TableCell>
                                                    <Link href={`/dashboard/personal/treinos/${treino.id}`}>
                                                        <Button variant="ghost" size="sm">Ver</Button>
                                                    </Link>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
