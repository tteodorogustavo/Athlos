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
import { personalAPI } from "@/lib/api";

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
    total_alunos?: number;
    total_treinos?: number;
}

export default function AdminPersonaisPage() {
    const [personais, setPersonais] = useState<Personal[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [deleting, setDeleting] = useState<number | null>(null);

    useEffect(() => {
        fetchPersonais();
    }, []);

    async function fetchPersonais() {
        try {
            const response = await personalAPI.list();
            setPersonais(response.data || response);
        } catch (error) {
            console.error("Erro ao buscar personais:", error);
        } finally {
            setLoading(false);
        }
    }

    const handleDelete = async (id: number) => {
        setDeleting(id);
        try {
            await personalAPI.delete(id);
            setPersonais(personais.filter(p => p.id !== id));
        } catch (error) {
            console.error("Erro ao excluir personal:", error);
        } finally {
            setDeleting(null);
        }
    };

    const filteredPersonais = personais.filter(personal => {
        const nome = `${personal.user?.first_name || ""} ${personal.user?.last_name || ""}`.toLowerCase();
        const email = personal.user?.email?.toLowerCase() || "";
        const search = searchTerm.toLowerCase();
        return nome.includes(search) || email.includes(search) || personal.cref?.toLowerCase().includes(search);
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
                    <h1 className="text-3xl font-bold">Personal Trainers</h1>
                    <p className="text-muted-foreground">
                        Gerencie todos os personal trainers da plataforma
                    </p>
                </div>
                <Link href="/dashboard/admin/personais/novo">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Novo Personal
                    </Button>
                </Link>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total de Personais</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{personais.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total de Alunos</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {personais.reduce((acc, p) => acc + (p.total_alunos || 0), 0)}
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
                            {personais.reduce((acc, p) => acc + (p.total_treinos || 0), 0)}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Search and Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Lista de Personal Trainers</CardTitle>
                    <CardDescription>
                        {filteredPersonais.length} personal(is) encontrado(s)
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar personal..."
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
                                <TableHead>CREF</TableHead>
                                <TableHead>Especialidade</TableHead>
                                <TableHead className="text-center">Alunos</TableHead>
                                <TableHead className="text-center">Treinos</TableHead>
                                <TableHead className="w-[100px]">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredPersonais.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                                        Nenhum personal trainer encontrado
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredPersonais.map((personal) => (
                                    <TableRow key={personal.id}>
                                        <TableCell className="font-medium">
                                            {personal.user?.first_name} {personal.user?.last_name}
                                        </TableCell>
                                        <TableCell>{personal.user?.email}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{personal.cref || "-"}</Badge>
                                        </TableCell>
                                        <TableCell>{personal.especialidade || "-"}</TableCell>
                                        <TableCell className="text-center">{personal.total_alunos || 0}</TableCell>
                                        <TableCell className="text-center">{personal.total_treinos || 0}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <Link href={`/dashboard/admin/personais/${personal.id}`}>
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
                                                                Tem certeza que deseja excluir este personal? Esta ação não pode ser desfeita.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                onClick={() => handleDelete(personal.id)}
                                                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                            >
                                                                {deleting === personal.id ? (
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
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
