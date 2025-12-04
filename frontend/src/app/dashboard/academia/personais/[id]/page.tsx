"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
    Mail,
    Phone,
    Award,
    Users,
    Dumbbell,
    Pencil,
    Eye,
} from "lucide-react";
import { personalAPI, alunoAPI } from "@/lib/api";

interface Personal {
    id: number;
    user: {
        id: number;
        email: string;
        first_name: string;
        last_name: string;
    };
    cref: string;
    especialidade?: string;
    telefone?: string;
    biografia?: string;
    ativo?: boolean;
}

interface Aluno {
    id: number;
    user: {
        first_name: string;
        last_name: string;
        email: string;
    };
    objetivo?: string;
    total_treinos?: number;
}

export default function PersonalDetalhesPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const [personal, setPersonal] = useState<Personal | null>(null);
    const [alunos, setAlunos] = useState<Aluno[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                const personalData = await personalAPI.get(resolvedParams.id);
                setPersonal(personalData);

                // Buscar alunos deste personal
                try {
                    const alunosData = await alunoAPI.list({ personal: resolvedParams.id });
                    setAlunos(alunosData.results || alunosData || []);
                } catch {
                    setAlunos([]);
                }
            } catch (error) {
                console.error("Erro ao carregar dados:", error);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, [resolvedParams.id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!personal) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground">Personal não encontrado</p>
                <Link href="/dashboard/academia/personais">
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
                    <Link href="/dashboard/academia/personais">
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-3xl font-bold">
                                {personal.user.first_name} {personal.user.last_name}
                            </h1>
                            <Badge variant={personal.ativo !== false ? "default" : "secondary"}>
                                {personal.ativo !== false ? "Ativo" : "Inativo"}
                            </Badge>
                        </div>
                        <p className="text-muted-foreground">{personal.user.email}</p>
                    </div>
                </div>
                <Link href={`/dashboard/academia/personais/${resolvedParams.id}/editar`}>
                    <Button>
                        <Pencil className="mr-2 h-4 w-4" />
                        Editar
                    </Button>
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">CREF</CardTitle>
                        <Award className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{personal.cref}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total de Alunos</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{alunos.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total de Treinos</CardTitle>
                        <Dumbbell className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {alunos.reduce((acc, a) => acc + (a.total_treinos || 0), 0)}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Informações */}
            <Card>
                <CardHeader>
                    <CardTitle>Informações</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="flex items-center gap-3">
                            <Mail className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <p className="text-sm text-muted-foreground">Email</p>
                                <p className="font-medium">{personal.user.email}</p>
                            </div>
                        </div>
                        {personal.telefone && (
                            <div className="flex items-center gap-3">
                                <Phone className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Telefone</p>
                                    <p className="font-medium">{personal.telefone}</p>
                                </div>
                            </div>
                        )}
                        {personal.especialidade && (
                            <div className="flex items-center gap-3">
                                <Award className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Especialidade</p>
                                    <p className="font-medium">{personal.especialidade}</p>
                                </div>
                            </div>
                        )}
                    </div>
                    {personal.biografia && (
                        <div className="mt-4 pt-4 border-t">
                            <p className="text-sm text-muted-foreground mb-2">Biografia</p>
                            <p className="whitespace-pre-wrap">{personal.biografia}</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Alunos */}
            <Card>
                <CardHeader>
                    <CardTitle>Alunos ({alunos.length})</CardTitle>
                    <CardDescription>
                        Lista de alunos atendidos por este personal
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {alunos.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            Nenhum aluno cadastrado
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nome</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Objetivo</TableHead>
                                    <TableHead className="text-center">Treinos</TableHead>
                                    <TableHead className="text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {alunos.map((aluno) => (
                                    <TableRow key={aluno.id}>
                                        <TableCell className="font-medium">
                                            {aluno.user.first_name} {aluno.user.last_name}
                                        </TableCell>
                                        <TableCell>{aluno.user.email}</TableCell>
                                        <TableCell>{aluno.objetivo || "-"}</TableCell>
                                        <TableCell className="text-center">
                                            {aluno.total_treinos || 0}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Link href={`/dashboard/academia/alunos/${aluno.id}`}>
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
        </div>
    );
}
