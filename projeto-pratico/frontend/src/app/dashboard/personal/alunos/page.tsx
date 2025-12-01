'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Plus,
    Search,
    MoreHorizontal,
    Eye,
    Pencil,
    Trash2,
    Users,
    Loader2
} from 'lucide-react';
import { alunoAPI } from '@/lib/api';

interface Aluno {
    user_id: number;
    nome: string;
    email: string;
    objetivo: string;
    academia_nome: string;
    data_nascimento: string;
    total_treinos: number;
    idade: number | null;
}

export default function AlunosPage() {
    const [search, setSearch] = useState('');
    const [alunos, setAlunos] = useState<Aluno[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadAlunos() {
            try {
                setLoading(true);
                const data = await alunoAPI.list();
                // O DRF retorna paginado, precisamos pegar os results
                const alunosList = data.results || data;
                setAlunos(alunosList);
            } catch (err: any) {
                console.error('Erro ao carregar alunos:', err);
                setError(err.response?.data?.error || 'Erro ao carregar dados');
            } finally {
                setLoading(false);
            }
        }
        loadAlunos();
    }, []);

    const filteredAlunos = alunos.filter(aluno =>
        aluno.nome?.toLowerCase().includes(search.toLowerCase()) ||
        aluno.email?.toLowerCase().includes(search.toLowerCase()) ||
        aluno.objetivo?.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Alunos</h1>
                    <p className="text-muted-foreground">
                        Gerencie seus alunos e acompanhe seu progresso
                    </p>
                </div>
                <Button asChild>
                    <Link href="/dashboard/personal/alunos/novo">
                        <Plus className="mr-2 h-4 w-4" />
                        Novo Aluno
                    </Link>
                </Button>
            </div>

            {error && (
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg">
                    <p className="text-sm">{error}</p>
                </div>
            )}

            {/* Filtros */}
            <Card>
                <CardHeader>
                    <CardTitle>Buscar Alunos</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Buscar por nome, email ou objetivo..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Tabela de Alunos */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Lista de Alunos
                    </CardTitle>
                    <CardDescription>
                        {filteredAlunos.length} aluno(s) encontrado(s)
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {filteredAlunos.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nome</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Idade</TableHead>
                                    <TableHead>Objetivo</TableHead>
                                    <TableHead>Academia</TableHead>
                                    <TableHead>Treinos</TableHead>
                                    <TableHead className="text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredAlunos.map((aluno) => (
                                    <TableRow key={aluno.user_id}>
                                        <TableCell className="font-medium">{aluno.nome}</TableCell>
                                        <TableCell>{aluno.email}</TableCell>
                                        <TableCell>{aluno.idade ? `${aluno.idade} anos` : '-'}</TableCell>
                                        <TableCell>
                                            <Badge variant="secondary">{aluno.objetivo || 'Não definido'}</Badge>
                                        </TableCell>
                                        <TableCell>{aluno.academia_nome || '-'}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{aluno.total_treinos}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/dashboard/personal/alunos/${aluno.user_id}`}>
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            Ver detalhes
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/dashboard/personal/alunos/${aluno.user_id}/editar`}>
                                                            <Pencil className="mr-2 h-4 w-4" />
                                                            Editar
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="text-red-600">
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Excluir
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="text-center py-8 text-muted-foreground">
                            {search ? 'Nenhum aluno encontrado com esses critérios' : 'Nenhum aluno cadastrado ainda'}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
