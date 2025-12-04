"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { alunoAPI, personalAPI } from "@/lib/api";

interface Personal {
    id: number;
    user: {
        id: number;
        first_name: string;
        last_name: string;
    };
}

export default function EditarAlunoPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [personais, setPersonais] = useState<Personal[]>([]);
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        telefone: "",
        data_nascimento: "",
        sexo: "",
        objetivo: "",
        peso: "",
        altura: "",
        observacoes: "",
        personal_responsavel: "",
    });

    useEffect(() => {
        async function loadData() {
            try {
                const [alunoData, personaisData] = await Promise.all([
                    alunoAPI.get(resolvedParams.id),
                    personalAPI.list(),
                ]);

                setFormData({
                    first_name: alunoData.user?.first_name || "",
                    last_name: alunoData.user?.last_name || "",
                    telefone: alunoData.telefone || "",
                    data_nascimento: alunoData.data_nascimento || "",
                    sexo: alunoData.sexo || "",
                    objetivo: alunoData.objetivo || "",
                    peso: alunoData.peso?.toString() || "",
                    altura: alunoData.altura?.toString() || "",
                    observacoes: alunoData.observacoes || "",
                    personal_responsavel: alunoData.personal_responsavel?.id?.toString() || "",
                });
                setPersonais(personaisData.data || personaisData);
            } catch (error) {
                console.error("Erro ao carregar dados:", error);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, [resolvedParams.id]);

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

        try {
            const payload = {
                user: {
                    first_name: formData.first_name,
                    last_name: formData.last_name,
                },
                telefone: formData.telefone || null,
                data_nascimento: formData.data_nascimento || null,
                sexo: formData.sexo || null,
                objetivo: formData.objetivo || null,
                peso: formData.peso ? parseFloat(formData.peso) : null,
                altura: formData.altura ? parseFloat(formData.altura) : null,
                observacoes: formData.observacoes || null,
                personal_responsavel: formData.personal_responsavel ? parseInt(formData.personal_responsavel) : null,
            };

            await alunoAPI.update(resolvedParams.id, payload);
            router.push(`/dashboard/academia/alunos/${resolvedParams.id}`);
        } catch (error: any) {
            console.error("Erro ao atualizar aluno:", error);
            alert(error.response?.data?.error || "Erro ao atualizar aluno");
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
                <Link href={`/dashboard/academia/alunos/${resolvedParams.id}`}>
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

            <form onSubmit={handleSubmit}>
                <Card>
                    <CardHeader>
                        <CardTitle>Informações do Aluno</CardTitle>
                        <CardDescription>
                            Edite os dados do aluno
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Dados Pessoais */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg border-b pb-2">Dados Pessoais</h3>
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
                            <div className="grid gap-4 md:grid-cols-3">
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
                        </div>

                        {/* Dados Físicos */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg border-b pb-2">Dados Físicos e Objetivos</h3>
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
                                            <SelectItem value="hipertrofia">Hipertrofia</SelectItem>
                                            <SelectItem value="emagrecimento">Emagrecimento</SelectItem>
                                            <SelectItem value="condicionamento">Condicionamento</SelectItem>
                                            <SelectItem value="forca">Força</SelectItem>
                                            <SelectItem value="flexibilidade">Flexibilidade</SelectItem>
                                            <SelectItem value="saude">Saúde</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        {/* Personal e Observações */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg border-b pb-2">Acompanhamento</h3>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="personal_responsavel">Personal Trainer</Label>
                                    <Select
                                        value={formData.personal_responsavel}
                                        onValueChange={(value) => handleSelectChange("personal_responsavel", value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione um personal" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="">Nenhum</SelectItem>
                                            {personais.map((personal) => (
                                                <SelectItem key={personal.id} value={personal.id.toString()}>
                                                    {personal.user.first_name} {personal.user.last_name}
                                                </SelectItem>
                                            ))}
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
                                    rows={4}
                                />
                            </div>
                        </div>

                        {/* Botões */}
                        <div className="flex gap-4 pt-4">
                            <Link href={`/dashboard/academia/alunos/${resolvedParams.id}`}>
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
                    </CardContent>
                </Card>
            </form>
        </div>
    );
}
