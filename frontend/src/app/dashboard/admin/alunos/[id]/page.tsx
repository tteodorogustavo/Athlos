"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
    Calendar,
    Target,
    Building2,
    Dumbbell,
    Pencil,
    Trash2,
    User,
} from "lucide-react";
import { alunoAPI } from "@/lib/api";

interface Aluno {
    id?: number;
    user_id?: number;
    user?: {
        id: number;
        email: string;
        first_name: string;
        last_name: string;
    };
    nome?: string;
    email?: string;
    data_nascimento?: string;
    objetivo?: string;
    academia?: {
        id: number;
        nome_fantasia: string;
    };
    academia_nome?: string;
    personal_responsavel?: {
        id?: number;
        user?: {
            first_name: string;
            last_name: string;
        };
        nome?: string;
    };
    total_treinos?: number;
}

export default function AlunoDetalhesPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const router = useRouter();
    const [aluno, setAluno] = useState<Aluno | null>(null);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        async function loadData() {
            try {
                const alunoData = await alunoAPI.get(resolvedParams.id);
                setAluno(alunoData);
            } catch (error) {
                console.error("Erro ao carregar dados:", error);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, [resolvedParams.id]);

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await alunoAPI.delete(resolvedParams.id);
            router.push("/dashboard/admin/alunos");
        } catch (error) {
            console.error("Erro ao excluir aluno:", error);
            setDeleting(false);
        }
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
                <Link href="/dashboard/admin/alunos">
                    <Button variant="outline" className="mt-4">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Voltar
                    </Button>
                </Link>
            </div>
        );
    }

    const nome = aluno.nome || `${aluno.user?.first_name || ""} ${aluno.user?.last_name || ""}`;
    const email = aluno.email || aluno.user?.email;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/admin/alunos">
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">{nome}</h1>
                        <p className="text-muted-foreground">{email}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Link href={`/dashboard/admin/alunos/${resolvedParams.id}/editar`}>
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
                                    Tem certeza que deseja excluir o aluno {nome}? Esta ação não pode ser desfeita.
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
                        <CardTitle className="text-sm font-medium">Total de Treinos</CardTitle>
                        <Dumbbell className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{aluno.total_treinos || 0}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Objetivo</CardTitle>
                        <Target className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-lg font-medium truncate">{aluno.objetivo || "Não definido"}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Academia</CardTitle>
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-lg font-medium truncate">
                            {aluno.academia?.nome_fantasia || aluno.academia_nome || "Não vinculado"}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Personal</CardTitle>
                        <User className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-lg font-medium truncate">
                            {aluno.personal_responsavel?.nome ||
                                (aluno.personal_responsavel?.user
                                    ? `${aluno.personal_responsavel.user.first_name} ${aluno.personal_responsavel.user.last_name}`
                                    : "Não atribuído")}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Informações Detalhadas */}
            <Card>
                <CardHeader>
                    <CardTitle>Informações do Aluno</CardTitle>
                    <CardDescription>Dados cadastrais completos</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="flex items-center gap-3">
                            <Mail className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <p className="text-sm text-muted-foreground">Email</p>
                                <p className="font-medium">{email}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Calendar className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <p className="text-sm text-muted-foreground">Data de Nascimento</p>
                                <p className="font-medium">
                                    {aluno.data_nascimento
                                        ? new Date(aluno.data_nascimento).toLocaleDateString("pt-BR")
                                        : "Não informado"}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Target className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <p className="text-sm text-muted-foreground">Objetivo</p>
                                <p className="font-medium">{aluno.objetivo || "Não definido"}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Building2 className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <p className="text-sm text-muted-foreground">Academia</p>
                                <p className="font-medium">
                                    {aluno.academia?.nome_fantasia || aluno.academia_nome || "Não vinculado"}
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
