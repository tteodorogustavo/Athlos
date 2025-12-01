"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Search, Plus, Dumbbell, Loader2, Mail, Phone, Eye } from "lucide-react";
import { alunoAPI } from "@/lib/api";

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
    objetivo?: string;
    personal_responsavel?: {
        id: number;
        user: {
            first_name: string;
            last_name: string;
        };
    };
    total_treinos?: number;
}

export default function AcademiaAlunosPage() {
    const [alunos, setAlunos] = useState<Aluno[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        async function fetchAlunos() {
            try {
                const response = await alunoAPI.list();
                setAlunos(response.data || response);
            } catch (error) {
                console.error("Erro ao buscar alunos:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchAlunos();
    }, []);

    const filteredAlunos = alunos.filter(aluno => {
        const nome = `${aluno.user?.first_name || ""} ${aluno.user?.last_name || ""}`.toLowerCase();
        const email = aluno.user?.email?.toLowerCase() || "";
        const search = searchTerm.toLowerCase();
        return nome.includes(search) || email.includes(search);
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Alunos</h1>
                    <p className="text-muted-foreground">
                        Gerencie os alunos da sua academia
                    </p>
                </div>
                <Link href="/dashboard/academia/alunos/novo">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Novo Aluno
                    </Button>
                </Link>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-3">
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
                        <CardTitle className="text-sm font-medium">Com Personal</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {alunos.filter(a => a.personal_responsavel).length}
                        </div>
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

            {/* Search and Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Lista de Alunos</CardTitle>
                    <CardDescription>
                        {filteredAlunos.length} aluno(s) encontrado(s)
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar aluno..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nome</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Telefone</TableHead>
                                <TableHead>Personal</TableHead>
                                <TableHead>Objetivo</TableHead>
                                <TableHead className="text-center">Treinos</TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredAlunos.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                                        Nenhum aluno encontrado
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredAlunos.map((aluno) => (
                                    <TableRow key={aluno.id}>
                                        <TableCell className="font-medium">
                                            {aluno.user?.first_name} {aluno.user?.last_name}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <Mail className="h-3 w-3 text-muted-foreground" />
                                                {aluno.user?.email}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {aluno.telefone ? (
                                                <div className="flex items-center gap-1">
                                                    <Phone className="h-3 w-3 text-muted-foreground" />
                                                    {aluno.telefone}
                                                </div>
                                            ) : "-"}
                                        </TableCell>
                                        <TableCell>
                                            {aluno.personal_responsavel ? (
                                                <Badge variant="outline">
                                                    {aluno.personal_responsavel.user?.first_name} {aluno.personal_responsavel.user?.last_name}
                                                </Badge>
                                            ) : (
                                                <span className="text-muted-foreground">Sem personal</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-sm">{aluno.objetivo || "-"}</span>
                                        </TableCell>
                                        <TableCell className="text-center">{aluno.total_treinos || 0}</TableCell>
                                        <TableCell>
                                            <Link href={`/dashboard/academia/alunos/${aluno.id}`}>
                                                <Button variant="ghost" size="sm">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
