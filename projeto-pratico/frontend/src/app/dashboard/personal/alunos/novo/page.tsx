"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Loader2, UserPlus } from "lucide-react";
import { alunoAPI } from "@/lib/api";

export default function NovoAlunoPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        email: "",
        first_name: "",
        last_name: "",
        password: "",
        telefone: "",
        data_nascimento: "",
        objetivo: "",
        sexo: "",
        peso: "",
        altura: "",
        observacoes: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await alunoAPI.create({
                ...formData,
                peso: formData.peso ? parseFloat(formData.peso) : null,
                altura: formData.altura ? parseFloat(formData.altura) : null,
            });
            router.push("/dashboard/personal/alunos");
        } catch (err: unknown) {
            const error = err as { response?: { data?: { detail?: string } } };
            setError(error.response?.data?.detail || "Erro ao criar aluno");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/personal/alunos">
                    <Button variant="outline" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold">Novo Aluno</h1>
                    <p className="text-muted-foreground">
                        Cadastre um novo aluno no sistema
                    </p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Informações do Aluno</CardTitle>
                    <CardDescription>
                        Preencha os dados do novo aluno
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
                                <Label htmlFor="password">Senha *</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    minLength={6}
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

                        <div className="grid gap-4 md:grid-cols-3">
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
                                    <SelectItem value="CONDICIONAMENTO">Condicionamento Físico</SelectItem>
                                    <SelectItem value="SAUDE">Saúde e Bem-estar</SelectItem>
                                    <SelectItem value="FORCA">Força</SelectItem>
                                    <SelectItem value="FLEXIBILIDADE">Flexibilidade</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="observacoes">Observações</Label>
                            <Textarea
                                id="observacoes"
                                name="observacoes"
                                value={formData.observacoes}
                                onChange={handleChange}
                                placeholder="Observações sobre o aluno, restrições, etc."
                                rows={4}
                            />
                        </div>

                        <div className="flex justify-end gap-4">
                            <Link href="/dashboard/personal/alunos">
                                <Button type="button" variant="outline">
                                    Cancelar
                                </Button>
                            </Link>
                            <Button type="submit" disabled={loading}>
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Salvando...
                                    </>
                                ) : (
                                    <>
                                        <UserPlus className="mr-2 h-4 w-4" />
                                        Criar Aluno
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
