'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
    Building2,
    MapPin,
    Phone,
    Users,
    Loader2
} from 'lucide-react';
import Link from 'next/link';
import { academiaAPI } from '@/lib/api';

interface Academia {
    id: number;
    nome: string;
    cnpj: string;
    endereco: string;
    telefone: string;
    total_alunos: number;
    ativa?: boolean;
}

export default function AcademiasPage() {
    const [academias, setAcademias] = useState<Academia[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchAcademias = async () => {
            try {
                const response = await academiaAPI.list();
                setAcademias(response.results || response);
            } catch (error) {
                console.error('Erro ao carregar academias:', error);
                // Fallback data
                setAcademias([]);
            } finally {
                setLoading(false);
            }
        };

        fetchAcademias();
    }, []);

    const academiasFiltradas = academias.filter(academia =>
        academia.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        academia.cnpj?.includes(searchTerm) ||
        academia.endereco?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalAlunos = academias.reduce((acc, a) => acc + (a.total_alunos || 0), 0);
    const academiasAtivas = academias.filter(a => a.ativa !== false).length;

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Academias</h1>
                    <p className="text-muted-foreground">
                        Gerencie as academias onde você atua
                    </p>
                </div>
                <Button asChild>
                    <Link href="/dashboard/personal/academias/nova">
                        <Plus className="mr-2 h-4 w-4" />
                        Nova Academia
                    </Link>
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total de Academias</CardTitle>
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{academias.length}</div>
                        <p className="text-xs text-muted-foreground">
                            {academiasAtivas} ativas
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total de Alunos</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalAlunos}</div>
                        <p className="text-xs text-muted-foreground">
                            Em todas as academias
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Média por Academia</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {academiasAtivas > 0 ? Math.round(totalAlunos / academiasAtivas) : 0}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Alunos por academia ativa
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Search */}
            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar academias..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                    />
                </div>
            </div>

            {/* Academias Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {academiasFiltradas.map(academia => (
                    <Card key={academia.id} className={!academia.ativa ? 'opacity-60' : ''}>
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <Building2 className="h-4 w-4" />
                                        {academia.nome}
                                    </CardTitle>
                                    <CardDescription>{academia.cnpj}</CardDescription>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge variant={academia.ativa ? 'default' : 'secondary'}>
                                        {academia.ativa ? 'Ativa' : 'Inativa'}
                                    </Badge>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem asChild>
                                                <Link href={`/dashboard/personal/academias/${academia.id}`}>
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    Visualizar
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild>
                                                <Link href={`/dashboard/personal/academias/${academia.id}/editar`}>
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
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-start gap-2 text-sm">
                                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                                <span className="text-muted-foreground">{academia.endereco || 'Endereço não informado'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground">{academia.telefone || 'Telefone não informado'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Users className="h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground">
                                    {academia.total_alunos || 0} {academia.total_alunos === 1 ? 'aluno' : 'alunos'}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {academiasFiltradas.length === 0 && (
                <div className="text-center py-10">
                    <Building2 className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-semibold">Nenhuma academia encontrada</h3>
                    <p className="text-muted-foreground">
                        {searchTerm ? 'Tente outro termo de busca.' : 'Comece adicionando sua primeira academia.'}
                    </p>
                    {!searchTerm && (
                        <Button className="mt-4" asChild>
                            <Link href="/dashboard/personal/academias/nova">
                                <Plus className="mr-2 h-4 w-4" />
                                Nova Academia
                            </Link>
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
}
