"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Edit, Loader2, Building2, Users, MapPin, Phone, Calendar } from "lucide-react";
import { academiaAPI } from "@/lib/api";

interface Academia {
    id: number;
    nome_fantasia: string;
    cnpj: string;
    endereco: string;
    telefone: string;
    data_criacao: string;
    total_alunos?: number;
    total_personais?: number;
    ativa?: boolean;
}

export default function AcademiaDetalhesPage() {
    const params = useParams();
    const [academia, setAcademia] = useState<Academia | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchAcademia() {
            try {
                const response = await academiaAPI.get(Number(params.id));
                setAcademia(response.data || response);
            } catch (error) {
                console.error("Erro ao buscar academia:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchAcademia();
    }, [params.id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!academia) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground">Academia não encontrada</p>
                <Link href="/dashboard/personal/academias">
                    <Button className="mt-4">Voltar para lista</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/personal/academias">
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">{academia.nome_fantasia}</h1>
                        <p className="text-muted-foreground">
                            Detalhes da academia
                        </p>
                    </div>
                </div>
                <Link href={`/dashboard/personal/academias/${params.id}/editar`}>
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
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <Badge variant={academia.ativa !== false ? "default" : "secondary"}>
                            {academia.ativa !== false ? "Ativa" : "Inativa"}
                        </Badge>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total de Alunos</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {academia.total_alunos || 0}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Personais</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {academia.total_personais || 0}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Cadastro</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm font-medium">
                            {new Date(academia.data_criacao).toLocaleDateString("pt-BR")}
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Informações da Academia</CardTitle>
                    <CardDescription>Dados cadastrais</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell className="font-medium w-48">
                                    <div className="flex items-center gap-2">
                                        <Building2 className="h-4 w-4 text-muted-foreground" />
                                        Nome Fantasia
                                    </div>
                                </TableCell>
                                <TableCell>{academia.nome_fantasia}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium">
                                    <div className="flex items-center gap-2">
                                        CNPJ
                                    </div>
                                </TableCell>
                                <TableCell>{academia.cnpj}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                        Endereço
                                    </div>
                                </TableCell>
                                <TableCell>{academia.endereco}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium">
                                    <div className="flex items-center gap-2">
                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                        Telefone
                                    </div>
                                </TableCell>
                                <TableCell>{academia.telefone}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
