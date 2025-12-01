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
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { alunoAPI } from "@/lib/api";

export default function EditarAlunoPage() {
    const params = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        email: "",
        first_name: "",
        last_name: "",
        telefone: "",
        data_nascimento: "",
        objetivo: "",
        sexo: "",
        peso: "",
        altura: "",
        observacoes: "",
    });

    useEffect(() => {
        async function fetchAluno() {
            try {
                const response = await alunoAPI.get(Number(params.id));
                const aluno = response.data || response;
                setFormData({
                    email: aluno.user?.email || "",
                    first_name: aluno.user?.first_name || "",
                    last_name: aluno.user?.last_name || "",
                    telefone: aluno.telefone || "",
                    data_nascimento: aluno.data_nascimento || "",
                    objetivo: aluno.objetivo || "",
                    sexo: aluno.sexo || "",
                    peso: aluno.peso?.toString() || "",
                    altura: aluno.altura?.toString() || "",
                    observacoes: aluno.observacoes || "",
                });
            } catch (error) {
                console.error("Erro ao buscar aluno:", error);
                setError("Erro ao carregar dados do aluno");
            } finally {
                setLoading(false);
            }
        }

        fetchAluno();
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
            await alunoAPI.update(Number(params.id), {
                ...formData,
                peso: formData.peso ? parseFloat(formData.peso) : null,
                altura: formData.altura ? parseFloat(formData.altura) : null,
            });
            router.push(`/dashboard/personal/alunos/${params.id}`);
        } catch (err: unknown) {
            const error = err as { response?: { data?: { detail?: string } } };
            setError(error.response?.data?.detail || "Erro ao atualizar aluno");
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
                <Link href={`/dashboard/personal/alunos/${params.id}`}>
                    <Button variant="outline" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold">Editar Aluno</h1>
                    <p className="text-muted-foreground">
                        Atualize os dados do aluno
                    </p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Informações do Aluno</CardTitle>
                    <CardDescription>
                        Edite os dados do aluno
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
                                <Label htmlFor="first_name">Nome *</Label>
                                <Input
                                    id="first_name"
                                    name="first_name"
                                    value={formData.first_name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="last_name">Sobrenome *</Label>
                                <Input
                                    id="last_name"
                                    name="last_name"
                                    value={formData.last_name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email *</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="telefone">Telefone</Label>
                                <Input
                                    id="telefone"
                                    name="telefone"
                                    value={formData.telefone}
                                    onChange={handleChange}
                                    placeholder="(00) 00000-0000"
                                />
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="data_nascimento">Data de Nascimento</Label>
                                <Input
                                    id="data_nascimento"
                                    name="data_nascimento"
                                    type="date"
                                    value={formData.data_nascimento}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="sexo">Sexo</Label>
                                <Select
                                    value={formData.sexo}
                                    onValueChange={(value) => handleSelectChange("sexo", value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="M">Masculino</SelectItem>
                                        <SelectItem value="F">Feminino</SelectItem>
                                        <SelectItem value="O">Outro</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="space-y-2">
                                <Label htmlFor="peso">Peso (kg)</Label>
                                <Input
                                    id="peso"
                                    name="peso"
                                    type="number"
                                    step="0.1"
                                    value={formData.peso}
                                    onChange={handleChange}
                                    placeholder="70.5"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="altura">Altura (cm)</Label>
                                <Input
                                    id="altura"
                                    name="altura"
                                    type="number"
                                    value={formData.altura}
                                    onChange={handleChange}
                                    placeholder="175"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="objetivo">Objetivo</Label>
                                <Select
                                    value={formData.objetivo}
                                    onValueChange={(value) => handleSelectChange("objetivo", value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="EMAGRECIMENTO">Emagrecimento</SelectItem>
                                        <SelectItem value="HIPERTROFIA">Hipertrofia</SelectItem>
                                        <SelectItem value="CONDICIONAMENTO">Condicionamento</SelectItem>
                                        <SelectItem value="SAUDE">Saúde</SelectItem>
                                        <SelectItem value="FORCA">Força</SelectItem>
                                        <SelectItem value="FLEXIBILIDADE">Flexibilidade</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="observacoes">Observações</Label>
                            <Textarea
                                id="observacoes"
                                name="observacoes"
                                value={formData.observacoes}
                                onChange={handleChange}
                                placeholder="Observações sobre o aluno"
                                rows={4}
                            />
                        </div>

                        <div className="flex justify-end gap-4">
                            <Link href={`/dashboard/personal/alunos/${params.id}`}>
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
