"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Users, Search, Plus, Dumbbell, Loader2, Eye, Trash2 } from "lucide-react";
import { alunoAPI } from "@/lib/api";

interface Aluno {
    id: number;
    user_id?: number;
    user?: {
        id: number;
        email: string;
        first_name: string;
        last_name: string;
    };
    nome?: string;
    email?: string;
    objetivo?: string;
    academia_nome?: string;
    total_treinos?: number;
}

export default function AdminAlunosPage() {
    const [alunos, setAlunos] = useState<Aluno[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [deleting, setDeleting] = useState<number | null>(null);

    useEffect(() => {
        fetchAlunos();
    }, []);

    async function fetchAlunos() {
        try {
            const response = await alunoAPI.list();
            setAlunos(response.results || response.data || response || []);
        } catch (error) {
            console.error("Erro ao buscar alunos:", error);
        } finally {
            setLoading(false);
        }
    }

    const handleDelete = async (id: number) => {
        setDeleting(id);
        try {
            await alunoAPI.delete(id);
            setAlunos(alunos.filter(a => (a.id || a.user_id) !== id));
        } catch (error) {
            console.error("Erro ao excluir aluno:", error);
        } finally {
            setDeleting(null);
        }
    };

    const filteredAlunos = alunos.filter(aluno => {
        const nome = aluno.nome || `${aluno.user?.first_name || ""} ${aluno.user?.last_name || ""}`.toLowerCase();
        const email = aluno.email || aluno.user?.email || "";
        const search = searchTerm.toLowerCase();
        return nome.toLowerCase().includes(search) || email.toLowerCase().includes(search);
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
                        Gerencie todos os alunos cadastrados na plataforma
                    </p>
                </div>
                <Link href="/dashboard/admin/alunos/novo">
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
                        <CardTitle className="text-sm font-medium">Total de Treinos</CardTitle>
                        <Dumbbell className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {alunos.reduce((acc, a) => acc + (a.total_treinos || 0), 0)}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Média Treinos/Aluno</CardTitle>
                        <Dumbbell className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {alunos.length > 0
                                ? (alunos.reduce((acc, a) => acc + (a.total_treinos || 0), 0) / alunos.length).toFixed(1)
                                : 0}
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
                                <TableHead>Academia</TableHead>
                                <TableHead>Objetivo</TableHead>
                                <TableHead className="text-center">Treinos</TableHead>
                                <TableHead className="w-[100px]">Ações</TableHead>
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
                                filteredAlunos.map((aluno) => {
                                    const alunoId = aluno.id || aluno.user_id || aluno.user?.id;
                                    return (
                                        <TableRow key={alunoId}>
                                            <TableCell className="font-medium">
                                                {aluno.nome || `${aluno.user?.first_name || ""} ${aluno.user?.last_name || ""}`}
                                            </TableCell>
                                            <TableCell>{aluno.email || aluno.user?.email}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline">{aluno.academia_nome || "-"}</Badge>
                                            </TableCell>
                                            <TableCell>{aluno.objetivo || "-"}</TableCell>
                                            <TableCell className="text-center">{aluno.total_treinos || 0}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    <Link href={`/dashboard/admin/alunos/${alunoId}`}>
                                                        <Button variant="ghost" size="sm">
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Tem certeza que deseja excluir este aluno? Esta ação não pode ser desfeita.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    onClick={() => handleDelete(alunoId!)}
                                                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                                >
                                                                    {deleting === alunoId ? (
                                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                                    ) : (
                                                                        "Excluir"
                                                                    )}
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
