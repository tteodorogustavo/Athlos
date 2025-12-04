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
    ClipboardList,
    Loader2
} from 'lucide-react';
import { treinoAPI } from '@/lib/api';

interface Treino {
    id: number;
    nome_treino: string;
    aluno_nome: string;
    total_exercicios: number;
    data_criacao: string;
    ativo: boolean;
}

export default function TreinosPage() {
    const [search, setSearch] = useState('');
    const [treinos, setTreinos] = useState<Treino[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadTreinos() {
            try {
                setLoading(true);
                const data = await treinoAPI.list();
                const treinosList = data.results || data;
                setTreinos(treinosList);
            } catch (err: any) {
                console.error('Erro ao carregar treinos:', err);
                setError(err.response?.data?.error || 'Erro ao carregar dados');
            } finally {
                setLoading(false);
            }
        }
        loadTreinos();
    }, []);

    const filteredTreinos = treinos.filter(treino =>
        treino.nome_treino?.toLowerCase().includes(search.toLowerCase()) ||
        treino.aluno_nome?.toLowerCase().includes(search.toLowerCase())
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
                    <h1 className="text-3xl font-bold tracking-tight">Treinos</h1>
                    <p className="text-muted-foreground">
                        Gerencie os treinos dos seus alunos
                    </p>
                </div>
                <Button asChild>
                    <Link href="/dashboard/personal/treinos/novo">
                        <Plus className="mr-2 h-4 w-4" />
                        Novo Treino
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
                    <CardTitle>Buscar Treinos</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Buscar por nome do treino ou aluno..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Tabela de Treinos */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ClipboardList className="h-5 w-5" />
                        Lista de Treinos
                    </CardTitle>
                    <CardDescription>
                        {filteredTreinos.length} treino(s) encontrado(s)
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {filteredTreinos.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nome do Treino</TableHead>
                                    <TableHead>Aluno</TableHead>
                                    <TableHead>Exercícios</TableHead>
                                    <TableHead>Data de Criação</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredTreinos.map((treino) => (
                                    <TableRow key={treino.id}>
                                        <TableCell className="font-medium">{treino.nome_treino}</TableCell>
                                        <TableCell>{treino.aluno_nome}</TableCell>
                                        <TableCell>{treino.total_exercicios} exercícios</TableCell>
                                        <TableCell>
                                            {new Date(treino.data_criacao).toLocaleDateString('pt-BR')}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={treino.ativo ? "default" : "secondary"}>
                                                {treino.ativo ? 'Ativo' : 'Inativo'}
                                            </Badge>
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
                                                        <Link href={`/dashboard/personal/treinos/${treino.id}`}>
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            Ver detalhes
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/dashboard/personal/treinos/${treino.id}/editar`}>
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
                            {search ? 'Nenhum treino encontrado com esses critérios' : 'Nenhum treino cadastrado ainda'}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
