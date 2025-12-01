"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Building2, Search, Plus, Users, Dumbbell, Loader2, Eye } from "lucide-react";
import { academiaAPI } from "@/lib/api";

interface Academia {
    id: number;
    nome_fantasia: string;
    endereco: string;
    telefone: string;
    total_alunos?: number;
    total_personais?: number;
    ativo?: boolean;
}

export default function AdminAcademiasPage() {
    const [academias, setAcademias] = useState<Academia[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        async function fetchAcademias() {
            try {
                const response = await academiaAPI.list();
                setAcademias(response.data || response);
            } catch (error) {
                console.error("Erro ao buscar academias:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchAcademias();
    }, []);

    const filteredAcademias = academias.filter(academia => {
        const nome = academia.nome_fantasia?.toLowerCase() || "";
        const endereco = academia.endereco?.toLowerCase() || "";
        const search = searchTerm.toLowerCase();
        return nome.includes(search) || endereco.includes(search);
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
                    <h1 className="text-3xl font-bold">Academias</h1>
                    <p className="text-muted-foreground">
                        Gerencie todas as academias cadastradas na plataforma
                    </p>
                </div>
                <Link href="/dashboard/admin/academias/nova">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Nova Academia
                    </Button>
                </Link>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total de Academias</CardTitle>
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{academias.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Academias Ativas</CardTitle>
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{academias.filter(a => a.ativo !== false).length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total de Alunos</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {academias.reduce((acc, a) => acc + (a.total_alunos || 0), 0)}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Search */}
            <Card>
                <CardHeader>
                    <CardTitle>Lista de Academias</CardTitle>
                    <CardDescription>
                        {filteredAcademias.length} academia(s) encontrada(s)
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar academia..."
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
                                <TableHead>Endereço</TableHead>
                                <TableHead>Telefone</TableHead>
                                <TableHead className="text-center">Alunos</TableHead>
                                <TableHead className="text-center">Personais</TableHead>
                                <TableHead className="text-center">Status</TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredAcademias.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                                        Nenhuma academia encontrada
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredAcademias.map((academia) => (
                                    <TableRow key={academia.id}>
                                        <TableCell className="font-medium">{academia.nome_fantasia}</TableCell>
                                        <TableCell>{academia.endereco || "-"}</TableCell>
                                        <TableCell>{academia.telefone || "-"}</TableCell>
                                        <TableCell className="text-center">{academia.total_alunos || 0}</TableCell>
                                        <TableCell className="text-center">{academia.total_personais || 0}</TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant={academia.ativo !== false ? "default" : "secondary"}>
                                                {academia.ativo !== false ? "Ativa" : "Inativa"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Link href={`/dashboard/admin/academias/${academia.id}`}>
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
