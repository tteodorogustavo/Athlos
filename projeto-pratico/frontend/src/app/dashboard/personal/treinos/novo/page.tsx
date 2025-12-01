'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Plus,
    Trash2,
    Save,
    ArrowLeft,
    Dumbbell
} from 'lucide-react';
import Link from 'next/link';

// Dados mockados
const mockAlunos = [
    { id: 1, nome: 'João Silva' },
    { id: 2, nome: 'Maria Santos' },
    { id: 3, nome: 'Pedro Oliveira' },
    { id: 4, nome: 'Ana Costa' },
];

const mockExercicios = [
    { id: 1, nome: 'Supino Reto', grupo: 'Peito' },
    { id: 2, nome: 'Supino Inclinado', grupo: 'Peito' },
    { id: 3, nome: 'Crucifixo', grupo: 'Peito' },
    { id: 4, nome: 'Tríceps Pulley', grupo: 'Tríceps' },
    { id: 5, nome: 'Tríceps Francês', grupo: 'Tríceps' },
    { id: 6, nome: 'Agachamento Livre', grupo: 'Pernas' },
    { id: 7, nome: 'Leg Press', grupo: 'Pernas' },
    { id: 8, nome: 'Cadeira Extensora', grupo: 'Pernas' },
    { id: 9, nome: 'Remada Curvada', grupo: 'Costas' },
    { id: 10, nome: 'Puxada Frontal', grupo: 'Costas' },
    { id: 11, nome: 'Rosca Direta', grupo: 'Bíceps' },
    { id: 12, nome: 'Rosca Alternada', grupo: 'Bíceps' },
    { id: 13, nome: 'Desenvolvimento', grupo: 'Ombros' },
    { id: 14, nome: 'Elevação Lateral', grupo: 'Ombros' },
    { id: 15, nome: 'Levantamento Terra', grupo: 'Posterior' },
];

interface ItemTreino {
    id: number;
    exercicio_id: string;
    series: string;
    repeticoes: string;
    carga_kg: string;
}

export default function NovoTreinoPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [nome, setNome] = useState('');
    const [alunoId, setAlunoId] = useState('');
    const [descricao, setDescricao] = useState('');
    const [itens, setItens] = useState<ItemTreino[]>([
        { id: 1, exercicio_id: '', series: '', repeticoes: '', carga_kg: '' }
    ]);

    const adicionarExercicio = () => {
        const novoId = Math.max(...itens.map(i => i.id), 0) + 1;
        setItens([...itens, { id: novoId, exercicio_id: '', series: '', repeticoes: '', carga_kg: '' }]);
    };

    const removerExercicio = (id: number) => {
        if (itens.length > 1) {
            setItens(itens.filter(item => item.id !== id));
        }
    };

    const atualizarItem = (id: number, campo: keyof ItemTreino, valor: string) => {
        setItens(itens.map(item =>
            item.id === id ? { ...item, [campo]: valor } : item
        ));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Aqui faria a chamada para a API
            console.log({
                nome,
                aluno_id: alunoId,
                descricao,
                itens: itens.filter(i => i.exercicio_id)
            });

            // Simular delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            router.push('/dashboard/personal/treinos');
        } catch (error) {
            console.error('Erro ao criar treino:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/dashboard/personal/treinos">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Novo Treino</h1>
                    <p className="text-muted-foreground">
                        Crie um novo treino para seu aluno
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Informações Básicas */}
                <Card>
                    <CardHeader>
                        <CardTitle>Informações do Treino</CardTitle>
                        <CardDescription>
                            Dados básicos do treino
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="nome">Nome do Treino *</Label>
                                <Input
                                    id="nome"
                                    placeholder="Ex: Treino A - Peito e Tríceps"
                                    value={nome}
                                    onChange={(e) => setNome(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="aluno">Aluno *</Label>
                                <Select value={alunoId} onValueChange={setAlunoId} required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione o aluno" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {mockAlunos.map(aluno => (
                                            <SelectItem key={aluno.id} value={String(aluno.id)}>
                                                {aluno.nome}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="descricao">Descrição</Label>
                            <Input
                                id="descricao"
                                placeholder="Observações gerais sobre o treino..."
                                value={descricao}
                                onChange={(e) => setDescricao(e.target.value)}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Exercícios */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <Dumbbell className="h-5 w-5" />
                                Exercícios
                            </CardTitle>
                            <CardDescription>
                                Adicione os exercícios do treino com séries, repetições e carga
                            </CardDescription>
                        </div>
                        <Button type="button" variant="outline" onClick={adicionarExercicio}>
                            <Plus className="mr-2 h-4 w-4" />
                            Adicionar Exercício
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[40%]">Exercício</TableHead>
                                    <TableHead className="w-[15%]">Séries</TableHead>
                                    <TableHead className="w-[20%]">Repetições</TableHead>
                                    <TableHead className="w-[15%]">Carga (kg)</TableHead>
                                    <TableHead className="w-[10%]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {itens.map((item, index) => (
                                    <TableRow key={item.id}>
                                        <TableCell>
                                            <Select
                                                value={item.exercicio_id}
                                                onValueChange={(value) => atualizarItem(item.id, 'exercicio_id', value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecione o exercício" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {mockExercicios.map(ex => (
                                                        <SelectItem key={ex.id} value={String(ex.id)}>
                                                            {ex.nome} ({ex.grupo})
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </TableCell>
                                        <TableCell>
                                            <Input
                                                type="number"
                                                min="1"
                                                placeholder="3"
                                                value={item.series}
                                                onChange={(e) => atualizarItem(item.id, 'series', e.target.value)}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Input
                                                placeholder="10-12"
                                                value={item.repeticoes}
                                                onChange={(e) => atualizarItem(item.id, 'repeticoes', e.target.value)}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Input
                                                type="number"
                                                min="0"
                                                placeholder="20"
                                                value={item.carga_kg}
                                                onChange={(e) => atualizarItem(item.id, 'carga_kg', e.target.value)}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => removerExercicio(item.id)}
                                                disabled={itens.length === 1}
                                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Ações */}
                <div className="flex justify-between">
                    <Button type="button" variant="outline" onClick={() => router.back()}>
                        Cancelar
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? (
                            <>Salvando...</>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                Salvar Treino
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
