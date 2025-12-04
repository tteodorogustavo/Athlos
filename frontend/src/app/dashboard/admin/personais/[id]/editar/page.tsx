"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { personalAPI, academiaAPI } from "@/lib/api";

interface Academia {
    id: number;
    nome_fantasia: string;
}

export default function EditarPersonalPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [academias, setAcademias] = useState<Academia[]>([]);
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        cref: "",
        especialidade: "",
        telefone: "",
        biografia: "",
        academia: "",
        ativo: true,
    });

    useEffect(() => {
        async function loadData() {
            try {
                const [personalData, academiasData] = await Promise.all([
                    personalAPI.get(resolvedParams.id),
                    academiaAPI.list(),
                ]);

                setFormData({
                    first_name: personalData.user?.first_name || "",
                    last_name: personalData.user?.last_name || "",
                    cref: personalData.cref || "",
                    especialidade: personalData.especialidade || "",
                    telefone: personalData.telefone || "",
                    biografia: personalData.biografia || "",
                    academia: personalData.user?.academia?.id?.toString() || "",
                    ativo: personalData.ativo !== false,
                });
                setAcademias(academiasData.data || academiasData);
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
                cref: formData.cref,
                especialidade: formData.especialidade || null,
            };

            await personalAPI.update(resolvedParams.id, payload);
            router.push(`/dashboard/admin/personais/${resolvedParams.id}`);
        } catch (error: any) {
            console.error("Erro ao atualizar personal:", error);
            alert(error.response?.data?.error || "Erro ao atualizar personal");
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
                <Link href={`/dashboard/admin/personais/${resolvedParams.id}`}>
                    <Button variant="outline" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold">Editar Personal</h1>
                    <p className="text-muted-foreground">
                        Atualize os dados do personal trainer
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <Card>
                    <CardHeader>
                        <CardTitle>Informações do Personal</CardTitle>
                        <CardDescription>
                            Edite os dados do personal trainer
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
                            <div className="grid gap-4 md:grid-cols-2">
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
                        </div>

                        {/* Dados Profissionais */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg border-b pb-2">Dados Profissionais</h3>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="cref">CREF *</Label>
                                    <Input
                                        id="cref"
                                        name="cref"
                                        value={formData.cref}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="especialidade">Especialidade</Label>
                                    <Input
                                        id="especialidade"
                                        name="especialidade"
                                        value={formData.especialidade}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="academia">Academia</Label>
                                <Select
                                    value={formData.academia || "none"}
                                    onValueChange={(value) => handleSelectChange("academia", value === "none" ? "" : value)}
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
                                <Label htmlFor="biografia">Biografia</Label>
                                <Textarea
                                    id="biografia"
                                    name="biografia"
                                    value={formData.biografia}
                                    onChange={handleChange}
                                    rows={4}
                                />
                            </div>
                        </div>

                        {/* Status */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg border-b pb-2">Status</h3>
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="ativo"
                                    checked={formData.ativo}
                                    onCheckedChange={(checked) =>
                                        setFormData(prev => ({ ...prev, ativo: checked }))
                                    }
                                />
                                <Label htmlFor="ativo">Personal ativo</Label>
                            </div>
                        </div>

                        {/* Botões */}
                        <div className="flex gap-4 pt-4">
                            <Link href={`/dashboard/admin/personais/${resolvedParams.id}`}>
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
