"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { academiaAPI } from "@/lib/api";

export default function EditarAcademiaPage() {
    const params = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        nome_fantasia: "",
        cnpj: "",
        endereco: "",
        telefone: "",
    });

    useEffect(() => {
        async function fetchAcademia() {
            try {
                const response = await academiaAPI.get(Number(params.id));
                const academia = response.data || response;
                setFormData({
                    nome_fantasia: academia.nome_fantasia || "",
                    cnpj: academia.cnpj || "",
                    endereco: academia.endereco || "",
                    telefone: academia.telefone || "",
                });
            } catch (error) {
                console.error("Erro ao buscar academia:", error);
                setError("Erro ao carregar dados da academia");
            } finally {
                setLoading(false);
            }
        }

        fetchAcademia();
    }, [params.id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError("");

        try {
            await academiaAPI.update(Number(params.id), formData);
            router.push(`/dashboard/personal/academias/${params.id}`);
        } catch (err: unknown) {
            const error = err as { response?: { data?: { detail?: string } } };
            setError(error.response?.data?.detail || "Erro ao atualizar academia");
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
                <Link href={`/dashboard/personal/academias/${params.id}`}>
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

            <Card>
                <CardHeader>
                    <CardTitle>Informações da Academia</CardTitle>
                    <CardDescription>
                        Edite os dados da academia
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
                                <Label htmlFor="cnpj">CNPJ *</Label>
                                <Input
                                    id="cnpj"
                                    name="cnpj"
                                    value={formData.cnpj}
                                    onChange={handleChange}
                                    required
                                    placeholder="00.000.000/0000-00"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="endereco">Endereço *</Label>
                            <Input
                                id="endereco"
                                name="endereco"
                                value={formData.endereco}
                                onChange={handleChange}
                                required
                                placeholder="Rua, número, bairro, cidade - UF"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="telefone">Telefone *</Label>
                            <Input
                                id="telefone"
                                name="telefone"
                                value={formData.telefone}
                                onChange={handleChange}
                                required
                                placeholder="(00) 0000-0000"
                            />
                        </div>

                        <div className="flex justify-end gap-4">
                            <Link href={`/dashboard/personal/academias/${params.id}`}>
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
