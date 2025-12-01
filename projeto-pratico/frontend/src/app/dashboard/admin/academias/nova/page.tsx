"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Loader2, Building2 } from "lucide-react";
import { academiaAPI } from "@/lib/api";

export default function NovaAcademiaPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
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
        // Admin da academia
        admin_email: "",
        admin_password: "",
        admin_first_name: "",
        admin_last_name: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

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
                admin: formData.admin_email ? {
                    email: formData.admin_email,
                    password: formData.admin_password,
                    first_name: formData.admin_first_name,
                    last_name: formData.admin_last_name,
                } : null,
            };

            await academiaAPI.create(payload);
            router.push("/dashboard/admin/academias");
        } catch (error: any) {
            console.error("Erro ao criar academia:", error);
            alert(error.response?.data?.error || "Erro ao criar academia");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/admin/academias">
                    <Button variant="outline" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold">Nova Academia</h1>
                    <p className="text-muted-foreground">
                        Cadastre uma nova academia na plataforma
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
                                        placeholder="Nome da academia"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="razao_social">Razão Social</Label>
                                    <Input
                                        id="razao_social"
                                        name="razao_social"
                                        value={formData.razao_social}
                                        onChange={handleChange}
                                        placeholder="Razão social"
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
                                        placeholder="00.000.000/0000-00"
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
                                        placeholder="contato@academia.com"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="telefone">Telefone</Label>
                                    <Input
                                        id="telefone"
                                        name="telefone"
                                        value={formData.telefone}
                                        onChange={handleChange}
                                        placeholder="(00) 0000-0000"
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
                                    placeholder="Rua, número, bairro"
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
                                        placeholder="Cidade"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="estado">Estado</Label>
                                    <Input
                                        id="estado"
                                        name="estado"
                                        value={formData.estado}
                                        onChange={handleChange}
                                        placeholder="UF"
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
                                        placeholder="00000-000"
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
                                    placeholder="Descrição da academia..."
                                    rows={3}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Administrador da Academia</CardTitle>
                            <CardDescription>
                                Dados do usuário administrador desta academia (opcional)
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="admin_email">Email do Admin</Label>
                                    <Input
                                        id="admin_email"
                                        name="admin_email"
                                        type="email"
                                        value={formData.admin_email}
                                        onChange={handleChange}
                                        placeholder="admin@academia.com"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="admin_password">Senha</Label>
                                    <Input
                                        id="admin_password"
                                        name="admin_password"
                                        type="password"
                                        value={formData.admin_password}
                                        onChange={handleChange}
                                        placeholder="Senha inicial"
                                    />
                                </div>
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="admin_first_name">Nome</Label>
                                    <Input
                                        id="admin_first_name"
                                        name="admin_first_name"
                                        value={formData.admin_first_name}
                                        onChange={handleChange}
                                        placeholder="Nome"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="admin_last_name">Sobrenome</Label>
                                    <Input
                                        id="admin_last_name"
                                        name="admin_last_name"
                                        value={formData.admin_last_name}
                                        onChange={handleChange}
                                        placeholder="Sobrenome"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Botões */}
                    <div className="flex gap-4">
                        <Link href="/dashboard/admin/academias">
                            <Button type="button" variant="outline">
                                Cancelar
                            </Button>
                        </Link>
                        <Button type="submit" disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Cadastrando...
                                </>
                            ) : (
                                <>
                                    <Building2 className="mr-2 h-4 w-4" />
                                    Cadastrar Academia
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}
