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
    Mail,
    Phone,
    Award,
    Users,
    Dumbbell,
    Pencil,
    Eye,
    Building2,
    Trash2,
} from "lucide-react";
import { personalAPI, alunoAPI } from "@/lib/api";

interface Personal {
    id: number;
    user?: {
        id: number;
        email: string;
        first_name: string;
        last_name: string;
        academia?: {
            id: number;
            nome_fantasia: string;
        };
    };
    nome?: string;
    email?: string;
    cref: string;
    especialidade?: string;
    telefone?: string;
    biografia?: string;
    ativo?: boolean;
}

interface Aluno {
    id: number;
    user?: {
        id?: number;
        first_name: string;
        last_name: string;
        email: string;
    };
    nome?: string;
    email?: string;
    objetivo?: string;
    total_treinos?: number;
}

export default function PersonalDetalhesPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const router = useRouter();
    const [personal, setPersonal] = useState<Personal | null>(null);
    const [alunos, setAlunos] = useState<Aluno[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await personalAPI.delete(resolvedParams.id);
            router.push("/dashboard/admin/personais");
        } catch (error) {
            console.error("Erro ao excluir personal:", error);
            setDeleting(false);
        }
    };

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
                <Link href="/dashboard/admin/personais">
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
                    <Link href="/dashboard/admin/personais">
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-3xl font-bold">
                                {personal.user?.first_name || personal.nome} {personal.user?.last_name || ""}
                            </h1>
                            <Badge variant={personal.ativo !== false ? "default" : "secondary"}>
                                {personal.ativo !== false ? "Ativo" : "Inativo"}
                            </Badge>
                        </div>
                        <p className="text-muted-foreground">{personal.user?.email || personal.email}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Link href={`/dashboard/admin/personais/${resolvedParams.id}/editar`}>
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
                                    Tem certeza que deseja excluir este personal? Esta ação não pode ser desfeita.
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
                {personal.user?.academia && (
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Academia</CardTitle>
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-lg font-bold truncate">
                                {personal.user?.academia?.nome_fantasia}
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
                        <div className="flex items-center gap-3">
                            <Mail className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <p className="text-sm text-muted-foreground">Email</p>
                                <p className="font-medium">{personal.user?.email || personal.email}</p>
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
                        {personal.user?.academia && (
                            <div className="flex items-center gap-3">
                                <Building2 className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Academia</p>
                                    <Link
                                        href={`/dashboard/admin/academias/${personal.user?.academia?.id}`}
                                        className="font-medium text-primary hover:underline"
                                    >
                                        {personal.user?.academia?.nome_fantasia}
                                    </Link>
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
                                    <TableRow key={aluno.id || aluno.user?.id}>
                                        <TableCell className="font-medium">
                                            {aluno.user?.first_name || aluno.nome} {aluno.user?.last_name || ""}
                                        </TableCell>
                                        <TableCell>{aluno.user?.email || aluno.email}</TableCell>
                                        <TableCell>{aluno.objetivo || "-"}</TableCell>
                                        <TableCell className="text-center">
                                            {aluno.total_treinos || 0}
                                        </TableCell>
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
