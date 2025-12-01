"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Search, Plus, Award, Loader2, Mail, UserCheck, Eye } from "lucide-react";
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
    telefone?: string;
    total_alunos?: number;
    ativo?: boolean;
}

export default function AcademiaPersonaisPage() {
    const [personais, setPersonais] = useState<Personal[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
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

        fetchPersonais();
    }, []);

    const filteredPersonais = personais.filter(personal => {
        const nome = `${personal.user?.first_name || ""} ${personal.user?.last_name || ""}`.toLowerCase();
        const email = personal.user?.email?.toLowerCase() || "";
        const cref = personal.cref?.toLowerCase() || "";
        const search = searchTerm.toLowerCase();
        return nome.includes(search) || email.includes(search) || cref.includes(search);
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
                        Gerencie os personais da sua academia
                    </p>
                </div>
                <Link href="/dashboard/academia/personais/novo">
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
                        <CardTitle className="text-sm font-medium">Ativos</CardTitle>
                        <UserCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {personais.filter(p => p.ativo !== false).length}
                        </div>
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
                                <TableHead>Status</TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredPersonais.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                                        Nenhum personal encontrado
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredPersonais.map((personal) => (
                                    <TableRow key={personal.id}>
                                        <TableCell className="font-medium">
                                            {personal.user?.first_name} {personal.user?.last_name}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <Mail className="h-3 w-3 text-muted-foreground" />
                                                {personal.user?.email}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <Award className="h-3 w-3 text-muted-foreground" />
                                                {personal.cref}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-sm">{personal.especialidade || "-"}</span>
                                        </TableCell>
                                        <TableCell className="text-center">{personal.total_alunos || 0}</TableCell>
                                        <TableCell>
                                            <Badge variant={personal.ativo !== false ? "default" : "secondary"}>
                                                {personal.ativo !== false ? "Ativo" : "Inativo"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Link href={`/dashboard/academia/personais/${personal.id}`}>
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
