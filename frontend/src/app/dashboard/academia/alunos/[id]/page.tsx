"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    ArrowLeft,
    Loader2,
    User,
    Mail,
    Phone,
    Calendar,
    Target,
    Scale,
    Ruler,
    Dumbbell,
    Pencil,
    Eye,
} from "lucide-react";
import { alunoAPI, treinoAPI } from "@/lib/api";

interface Aluno {
    id: number;
    user: {
        id: number;
        email: string;
        first_name: string;
        last_name: string;
    };
    telefone?: string;
    data_nascimento?: string;
    sexo?: string;
    objetivo?: string;
    peso?: number;
    altura?: number;
    observacoes?: string;
    personal_responsavel?: {
        id: number;
        user: {
            first_name: string;
            last_name: string;
        };
    };
}

interface Treino {
    id: number;
    nome_treino: string;
    objetivo?: string;
    data_criacao: string;
    ativo: boolean;
    total_exercicios: number;
}

export default function AlunoDetalhesPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const [aluno, setAluno] = useState<Aluno | null>(null);
    const [treinos, setTreinos] = useState<Treino[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                const [alunoData, treinosData] = await Promise.all([
                    alunoAPI.get(resolvedParams.id),
                    treinoAPI.list({ aluno: resolvedParams.id }),
                ]);
                setAluno(alunoData);
                setTreinos(treinosData.results || treinosData || []);
            } catch (error) {
                console.error("Erro ao carregar dados:", error);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, [resolvedParams.id]);

    const calcularIdade = (dataNascimento: string) => {
        const hoje = new Date();
        const nascimento = new Date(dataNascimento);
        let idade = hoje.getFullYear() - nascimento.getFullYear();
        const m = hoje.getMonth() - nascimento.getMonth();
        if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
            idade--;
        }
        return idade;
    };

    const calcularIMC = (peso: number, altura: number) => {
        const alturaMetros = altura / 100;
        return (peso / (alturaMetros * alturaMetros)).toFixed(1);
    };

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
                <Link href="/dashboard/academia/alunos">
                    <Button variant="outline" className="mt-4">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Voltar
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/academia/alunos">
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">
                            {aluno.user.first_name} {aluno.user.last_name}
                        </h1>
                        <p className="text-muted-foreground">{aluno.user.email}</p>
                    </div>
                </div>
                <Link href={`/dashboard/academia/alunos/${resolvedParams.id}/editar`}>
                    <Button>
                        <Pencil className="mr-2 h-4 w-4" />
                        Editar
                    </Button>
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                {aluno.peso && aluno.altura && (
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">IMC</CardTitle>
                            <Scale className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {calcularIMC(aluno.peso, aluno.altura)}
                            </div>
                        </CardContent>
                    </Card>
                )}
                {aluno.data_nascimento && (
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Idade</CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {calcularIdade(aluno.data_nascimento)} anos
                            </div>
                        </CardContent>
                    </Card>
                )}
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
                        <CardTitle className="text-sm font-medium">Total de Treinos</CardTitle>
                        <Dumbbell className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{treinos.length}</div>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="info" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="info">Informações</TabsTrigger>
                    <TabsTrigger value="treinos">Treinos ({treinos.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="info" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Dados Pessoais</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="flex items-center gap-3">
                                    <Mail className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Email</p>
                                        <p className="font-medium">{aluno.user.email}</p>
                                    </div>
                                </div>
                                {aluno.telefone && (
                                    <div className="flex items-center gap-3">
                                        <Phone className="h-5 w-5 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Telefone</p>
                                            <p className="font-medium">{aluno.telefone}</p>
                                        </div>
                                    </div>
                                )}
                                {aluno.data_nascimento && (
                                    <div className="flex items-center gap-3">
                                        <Calendar className="h-5 w-5 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Data de Nascimento</p>
                                            <p className="font-medium">
                                                {new Date(aluno.data_nascimento).toLocaleDateString("pt-BR")}
                                            </p>
                                        </div>
                                    </div>
                                )}
                                {aluno.sexo && (
                                    <div className="flex items-center gap-3">
                                        <User className="h-5 w-5 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Sexo</p>
                                            <p className="font-medium">
                                                {aluno.sexo === "M" ? "Masculino" : aluno.sexo === "F" ? "Feminino" : "Outro"}
                                            </p>
                                        </div>
                                    </div>
                                )}
                                {aluno.peso && (
                                    <div className="flex items-center gap-3">
                                        <Scale className="h-5 w-5 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Peso</p>
                                            <p className="font-medium">{aluno.peso} kg</p>
                                        </div>
                                    </div>
                                )}
                                {aluno.altura && (
                                    <div className="flex items-center gap-3">
                                        <Ruler className="h-5 w-5 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Altura</p>
                                            <p className="font-medium">{aluno.altura} cm</p>
                                        </div>
                                    </div>
                                )}
                                {aluno.objetivo && (
                                    <div className="flex items-center gap-3">
                                        <Target className="h-5 w-5 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Objetivo</p>
                                            <p className="font-medium capitalize">{aluno.objetivo}</p>
                                        </div>
                                    </div>
                                )}
                                {aluno.personal_responsavel && (
                                    <div className="flex items-center gap-3">
                                        <User className="h-5 w-5 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Personal Trainer</p>
                                            <p className="font-medium">
                                                {aluno.personal_responsavel.user.first_name} {aluno.personal_responsavel.user.last_name}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {aluno.observacoes && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Observações</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="whitespace-pre-wrap">{aluno.observacoes}</p>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                <TabsContent value="treinos">
                    <Card>
                        <CardHeader>
                            <CardTitle>Treinos do Aluno</CardTitle>
                            <CardDescription>
                                Lista de treinos cadastrados para este aluno
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {treinos.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    Nenhum treino cadastrado
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Nome</TableHead>
                                            <TableHead>Objetivo</TableHead>
                                            <TableHead>Exercícios</TableHead>
                                            <TableHead>Data</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Ações</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {treinos.map((treino) => (
                                            <TableRow key={treino.id}>
                                                <TableCell className="font-medium">
                                                    {treino.nome_treino}
                                                </TableCell>
                                                <TableCell>{treino.objetivo || "-"}</TableCell>
                                                <TableCell>{treino.total_exercicios}</TableCell>
                                                <TableCell>
                                                    {new Date(treino.data_criacao).toLocaleDateString("pt-BR")}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={treino.ativo ? "default" : "secondary"}>
                                                        {treino.ativo ? "Ativo" : "Inativo"}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Link href={`/dashboard/academia/treinos/${treino.id}`}>
                                                        <Button variant="ghost" size="sm">
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
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
