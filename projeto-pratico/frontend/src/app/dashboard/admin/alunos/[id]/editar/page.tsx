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
import { alunoAPI, academiaAPI, personalAPI } from "@/lib/api";

interface Academia {
    id: number;
    nome_fantasia: string;
}

interface Personal {
    id: number;
    user?: {
        first_name: string;
        last_name: string;
    };
    nome?: string;
}

export default function EditarAlunoPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [academias, setAcademias] = useState<Academia[]>([]);
    const [personais, setPersonais] = useState<Personal[]>([]);
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        data_nascimento: "",
        objetivo: "",
        academia: "",
        personal_responsavel: "",
    });

    useEffect(() => {
        async function loadData() {
            try {
                const [alunoData, academiasData, personaisData] = await Promise.all([
                    alunoAPI.get(resolvedParams.id),
                    academiaAPI.list(),
                    personalAPI.list(),
                ]);

                setFormData({
                    first_name: alunoData.user?.first_name || "",
                    last_name: alunoData.user?.last_name || "",
                    data_nascimento: alunoData.data_nascimento || "",
                    objetivo: alunoData.objetivo || "",
                    academia: alunoData.academia?.id?.toString() || "",
                    personal_responsavel: alunoData.personal_responsavel?.id?.toString() || "",
                });
                setAcademias(academiasData.data || academiasData || []);
                setPersonais(personaisData.data || personaisData || []);
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
        setFormData(prev => ({ ...prev, [name]: value === "none" ? "" : value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const payload = {
                first_name: formData.first_name,
                last_name: formData.last_name,
                data_nascimento: formData.data_nascimento || null,
                objetivo: formData.objetivo || null,
                academia: formData.academia ? parseInt(formData.academia) : null,
                personal_responsavel: formData.personal_responsavel ? parseInt(formData.personal_responsavel) : null,
            };

            await alunoAPI.update(resolvedParams.id, payload);
            router.push(`/dashboard/admin/alunos/${resolvedParams.id}`);
        } catch (error) {
            console.error("Erro ao atualizar aluno:", error);
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
                <Link href={`/dashboard/admin/alunos/${resolvedParams.id}`}>
                    <Button variant="outline" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold">Editar Aluno</h1>
                    <p className="text-muted-foreground">Altere os dados do aluno</p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <Card>
                    <CardHeader>
                        <CardTitle>Informações do Aluno</CardTitle>
                        <CardDescription>Atualize os dados do aluno</CardDescription>
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
                                        required
                                        value={formData.first_name}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="last_name">Sobrenome *</Label>
                                    <Input
                                        id="last_name"
                                        name="last_name"
                                        required
                                        value={formData.last_name}
                                        onChange={handleChange}
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
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="objetivo">Objetivo</Label>
                                <Textarea
                                    id="objetivo"
                                    name="objetivo"
                                    value={formData.objetivo}
                                    onChange={handleChange}
                                    placeholder="Ex: Hipertrofia, emagrecimento, condicionamento..."
                                    rows={3}
                                />
                            </div>
                        </div>

                        {/* Vinculações */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg border-b pb-2">Vinculações</h3>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="academia">Academia</Label>
                                    <Select
                                        value={formData.academia || "none"}
                                        onValueChange={(value) => handleSelectChange("academia", value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione uma academia" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">Nenhuma</SelectItem>
                                            {academias.map((academia) => (
                                                <SelectItem key={academia.id} value={academia.id.toString()}>
                                                    {academia.nome_fantasia}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="personal_responsavel">Personal Responsável</Label>
                                    <Select
                                        value={formData.personal_responsavel || "none"}
                                        onValueChange={(value) => handleSelectChange("personal_responsavel", value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione um personal" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">Nenhum</SelectItem>
                                            {personais.map((personal) => (
                                                <SelectItem key={personal.id} value={personal.id.toString()}>
                                                    {personal.nome || `${personal.user?.first_name || ""} ${personal.user?.last_name || ""}`}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        {/* Botões */}
                        <div className="flex gap-4 pt-4">
                            <Link href={`/dashboard/admin/alunos/${resolvedParams.id}`}>
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
