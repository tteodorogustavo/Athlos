"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { treinoAPI, alunoAPI } from "@/lib/api";

interface Aluno {
    user_id: number;
    user: {
        first_name: string;
        last_name: string;
    };
}

export default function EditarTreinoPage() {
    const params = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [alunos, setAlunos] = useState<Aluno[]>([]);
    const [formData, setFormData] = useState({
        nome: "",
        descricao: "",
        objetivo: "",
        aluno: "",
        ativo: true,
    });

    useEffect(() => {
        async function fetchData() {
            try {
                const [treinoResponse, alunosResponse] = await Promise.all([
                    treinoAPI.get(Number(params.id)),
                    alunoAPI.list(),
                ]);

                const treino = treinoResponse.data || treinoResponse;
                setFormData({
                    nome: treino.nome || "",
                    descricao: treino.descricao || "",
                    objetivo: treino.objetivo || "",
                    aluno: treino.aluno?.user_id?.toString() || "",
                    ativo: treino.ativo ?? true,
                });

                setAlunos(alunosResponse.data || alunosResponse);
            } catch (error) {
                console.error("Erro ao buscar dados:", error);
                setError("Erro ao carregar dados");
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [params.id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError("");

        try {
            await treinoAPI.update(Number(params.id), {
                ...formData,
                aluno: formData.aluno ? parseInt(formData.aluno) : null,
            });
            router.push(`/dashboard/personal/treinos/${params.id}`);
        } catch (err: unknown) {
            const error = err as { response?: { data?: { detail?: string } } };
            setError(error.response?.data?.detail || "Erro ao atualizar treino");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href={`/dashboard/personal/treinos/${params.id}`}>
                    <Button variant="outline" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold">Editar Treino</h1>
                    <p className="text-muted-foreground">
                        Atualize os dados do treino
                    </p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Informações do Treino</CardTitle>
                    <CardDescription>
                        Edite os dados do treino
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg">
                                {error}
                            </div>
                        )}

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="nome">Nome do Treino *</Label>
                                <Input
                                    id="nome"
                                    name="nome"
                                    value={formData.nome}
                                    onChange={handleChange}
                                    required
                                    placeholder="Ex: Treino A - Peito e Tríceps"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="aluno">Aluno</Label>
                                <Select
                                    value={formData.aluno}
                                    onValueChange={(value) => handleSelectChange("aluno", value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione um aluno" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {alunos.map(aluno => (
                                            <SelectItem key={aluno.user_id} value={aluno.user_id.toString()}>
                                                {aluno.user.first_name} {aluno.user.last_name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="objetivo">Objetivo</Label>
                            <Select
                                value={formData.objetivo}
                                onValueChange={(value) => handleSelectChange("objetivo", value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione o objetivo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="EMAGRECIMENTO">Emagrecimento</SelectItem>
                                    <SelectItem value="HIPERTROFIA">Hipertrofia</SelectItem>
                                    <SelectItem value="CONDICIONAMENTO">Condicionamento</SelectItem>
                                    <SelectItem value="FORCA">Força</SelectItem>
                                    <SelectItem value="RESISTENCIA">Resistência</SelectItem>
                                    <SelectItem value="FLEXIBILIDADE">Flexibilidade</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="descricao">Descrição</Label>
                            <Textarea
                                id="descricao"
                                name="descricao"
                                value={formData.descricao}
                                onChange={handleChange}
                                placeholder="Descrição do treino, instruções gerais, etc."
                                rows={4}
                            />
                        </div>

                        <div className="flex items-center space-x-2">
                            <Switch
                                id="ativo"
                                checked={formData.ativo}
                                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, ativo: checked }))}
                            />
                            <Label htmlFor="ativo">Treino Ativo</Label>
                        </div>

                        <div className="flex justify-end gap-4">
                            <Link href={`/dashboard/personal/treinos/${params.id}`}>
                                <Button type="button" variant="outline">
                                    Cancelar
                                </Button>
                            </Link>
                            <Button type="submit" disabled={saving}>
                                {saving ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Salvando...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        Salvar Alterações
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
