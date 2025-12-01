"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import {
    ArrowLeft,
    Loader2,
    Building2,
    Mail,
    Phone,
    MapPin,
    Users,
    Dumbbell,
    Pencil,
    Eye,
    Trash2,
} from "lucide-react";
import { academiaAPI, personalAPI, alunoAPI } from "@/lib/api";

interface Academia {
    id: number;
    nome_fantasia: string;
    razao_social?: string;
    cnpj?: string;
    email?: string;
    telefone?: string;
    endereco?: string;
    cidade?: string;
    estado?: string;
    cep?: string;
    descricao?: string;
    ativo?: boolean;
    total_alunos?: number;
    total_personais?: number;
}

interface User {
    id?: number;
    user?: {
        id?: number;
        first_name: string;
        last_name: string;
        email: string;
    };
    nome?: string;
    email?: string;
}

export default function AcademiaDetalhesPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const router = useRouter();
    const [academia, setAcademia] = useState<Academia | null>(null);
    const [personais, setPersonais] = useState<User[]>([]);
    const [alunos, setAlunos] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await academiaAPI.delete(resolvedParams.id);
            router.push("/dashboard/admin/academias");
        } catch (error) {
            console.error("Erro ao excluir academia:", error);
            setDeleting(false);
        }
    };

    useEffect(() => {
        async function loadData() {
            try {
                const academiaData = await academiaAPI.get(resolvedParams.id);
                setAcademia(academiaData);

                // Buscar personais e alunos desta academia
                try {
                    const [personaisData, alunosData] = await Promise.all([
                        personalAPI.list({ academia: resolvedParams.id }),
                        alunoAPI.list({ academia: resolvedParams.id }),
                    ]);
                    setPersonais(personaisData.results || personaisData || []);
                    setAlunos(alunosData.results || alunosData || []);
                } catch {
                    setPersonais([]);
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

    if (!academia) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground">Academia não encontrada</p>
                <Link href="/dashboard/admin/academias">
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
                    <Link href="/dashboard/admin/academias">
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-3xl font-bold">{academia.nome_fantasia}</h1>
                            <Badge variant={academia.ativo !== false ? "default" : "secondary"}>
                                {academia.ativo !== false ? "Ativa" : "Inativa"}
                            </Badge>
                        </div>
                        {academia.razao_social && (
                            <p className="text-muted-foreground">{academia.razao_social}</p>
                        )}
                    </div>
                </div>
                <div className="flex gap-2">
                    <Link href={`/dashboard/admin/academias/${resolvedParams.id}/editar`}>
                        <Button>
                            <Pencil className="mr-2 h-4 w-4" />
                            Editar
                        </Button>
                    </Link>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Excluir
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Tem certeza que deseja excluir a academia {academia.nome_fantasia}? Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleDelete}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                    {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Excluir"}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
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
                        <CardTitle className="text-sm font-medium">Total de Personais</CardTitle>
                        <Dumbbell className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{personais.length}</div>
                    </CardContent>
                </Card>
                {academia.cnpj && (
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">CNPJ</CardTitle>
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-lg font-bold">{academia.cnpj}</div>
                        </CardContent>
                    </Card>
                )}
                {academia.cidade && academia.estado && (
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Localização</CardTitle>
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-lg font-bold">
                                {academia.cidade}/{academia.estado}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Informações */}
            <Card>
                <CardHeader>
                    <CardTitle>Informações</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                        {academia.email && (
                            <div className="flex items-center gap-3">
                                <Mail className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Email</p>
                                    <p className="font-medium">{academia.email}</p>
                                </div>
                            </div>
                        )}
                        {academia.telefone && (
                            <div className="flex items-center gap-3">
                                <Phone className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Telefone</p>
                                    <p className="font-medium">{academia.telefone}</p>
                                </div>
                            </div>
                        )}
                        {academia.endereco && (
                            <div className="flex items-center gap-3 md:col-span-2">
                                <MapPin className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Endereço</p>
                                    <p className="font-medium">
                                        {academia.endereco}
                                        {academia.cidade && `, ${academia.cidade}`}
                                        {academia.estado && ` - ${academia.estado}`}
                                        {academia.cep && ` - CEP: ${academia.cep}`}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                    {academia.descricao && (
                        <div className="mt-4 pt-4 border-t">
                            <p className="text-sm text-muted-foreground mb-2">Descrição</p>
                            <p className="whitespace-pre-wrap">{academia.descricao}</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Personal Trainers */}
            <Card>
                <CardHeader>
                    <CardTitle>Personal Trainers ({personais.length})</CardTitle>
                    <CardDescription>
                        Lista de personal trainers desta academia
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {personais.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            Nenhum personal trainer cadastrado
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nome</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead className="text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {personais.slice(0, 5).map((personal) => (
                                    <TableRow key={personal.id || personal.user?.id}>
                                        <TableCell className="font-medium">
                                            {personal.user?.first_name || personal.nome} {personal.user?.last_name || ""}
                                        </TableCell>
                                        <TableCell>{personal.user?.email || personal.email}</TableCell>
                                        <TableCell className="text-right">
                                            <Link href={`/dashboard/admin/personais/${personal.id || personal.user?.id}`}>
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

            {/* Alunos */}
            <Card>
                <CardHeader>
                    <CardTitle>Alunos ({alunos.length})</CardTitle>
                    <CardDescription>
                        Lista de alunos desta academia
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
                                    <TableHead className="text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {alunos.slice(0, 5).map((aluno) => (
                                    <TableRow key={aluno.id || aluno.user?.id}>
                                        <TableCell className="font-medium">
                                            {aluno.user?.first_name || aluno.nome} {aluno.user?.last_name || ""}
                                        </TableCell>
                                        <TableCell>{aluno.user?.email || aluno.email}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm">
                                                <Eye className="h-4 w-4" />
                                            </Button>
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
