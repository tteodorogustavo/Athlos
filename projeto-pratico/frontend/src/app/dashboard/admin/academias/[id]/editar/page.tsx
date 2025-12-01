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
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { academiaAPI } from "@/lib/api";

export default function EditarAcademiaPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        nome_fantasia: "",
        razao_social: "",
        cnpj: "",
        email: "",
        telefone: "",
        endereco: "",
        cidade: "",
        estado: "",
        cep: "",
        descricao: "",
        ativo: true,
    });

    useEffect(() => {
        async function loadData() {
            try {
                const academiaData = await academiaAPI.get(resolvedParams.id);
                setFormData({
                    nome_fantasia: academiaData.nome_fantasia || "",
                    razao_social: academiaData.razao_social || "",
                    cnpj: academiaData.cnpj || "",
                    email: academiaData.email || "",
                    telefone: academiaData.telefone || "",
                    endereco: academiaData.endereco || "",
                    cidade: academiaData.cidade || "",
                    estado: academiaData.estado || "",
                    cep: academiaData.cep || "",
                    descricao: academiaData.descricao || "",
                    ativo: academiaData.ativo !== false,
                });
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const payload = {
                nome_fantasia: formData.nome_fantasia,
                razao_social: formData.razao_social || null,
                cnpj: formData.cnpj || null,
                email: formData.email || null,
                telefone: formData.telefone || null,
                endereco: formData.endereco || null,
                cidade: formData.cidade || null,
                estado: formData.estado || null,
                cep: formData.cep || null,
                descricao: formData.descricao || null,
                ativo: formData.ativo,
            };

            await academiaAPI.update(resolvedParams.id, payload);
            router.push(`/dashboard/admin/academias/${resolvedParams.id}`);
        } catch (error: any) {
            console.error("Erro ao atualizar academia:", error);
            alert(error.response?.data?.error || "Erro ao atualizar academia");
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
                <Link href={`/dashboard/admin/academias/${resolvedParams.id}`}>
                    <Button variant="outline" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold">Editar Academia</h1>
                    <p className="text-muted-foreground">
                        Atualize os dados da academia
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Dados da Academia</CardTitle>
                            <CardDescription>
                                Informações básicas da academia
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="nome_fantasia">Nome Fantasia *</Label>
                                    <Input
                                        id="nome_fantasia"
                                        name="nome_fantasia"
                                        value={formData.nome_fantasia}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="razao_social">Razão Social</Label>
                                    <Input
                                        id="razao_social"
                                        name="razao_social"
                                        value={formData.razao_social}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="grid gap-4 md:grid-cols-3">
                                <div className="space-y-2">
                                    <Label htmlFor="cnpj">CNPJ</Label>
                                    <Input
                                        id="cnpj"
                                        name="cnpj"
                                        value={formData.cnpj}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="telefone">Telefone</Label>
                                    <Input
                                        id="telefone"
                                        name="telefone"
                                        value={formData.telefone}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="endereco">Endereço</Label>
                                <Input
                                    id="endereco"
                                    name="endereco"
                                    value={formData.endereco}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="grid gap-4 md:grid-cols-3">
                                <div className="space-y-2">
                                    <Label htmlFor="cidade">Cidade</Label>
                                    <Input
                                        id="cidade"
                                        name="cidade"
                                        value={formData.cidade}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="estado">Estado</Label>
                                    <Input
                                        id="estado"
                                        name="estado"
                                        value={formData.estado}
                                        onChange={handleChange}
                                        maxLength={2}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="cep">CEP</Label>
                                    <Input
                                        id="cep"
                                        name="cep"
                                        value={formData.cep}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="descricao">Descrição</Label>
                                <Textarea
                                    id="descricao"
                                    name="descricao"
                                    value={formData.descricao}
                                    onChange={handleChange}
                                    rows={3}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="ativo"
                                    checked={formData.ativo}
                                    onCheckedChange={(checked) =>
                                        setFormData(prev => ({ ...prev, ativo: checked }))
                                    }
                                />
                                <Label htmlFor="ativo">Academia ativa</Label>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Botões */}
                    <div className="flex gap-4">
                        <Link href={`/dashboard/admin/academias/${resolvedParams.id}`}>
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
                </div>
            </form>
        </div>
    );
}
