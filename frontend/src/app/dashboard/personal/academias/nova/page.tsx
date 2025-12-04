'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    ArrowLeft,
    Save,
    Building2
} from 'lucide-react';
import Link from 'next/link';

export default function NovaAcademiaPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        nome: '',
        cnpj: '',
        endereco: '',
        telefone: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Aqui faria a chamada para a API
            console.log('Nova academia:', formData);

            // Simular delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            router.push('/dashboard/personal/academias');
        } catch (error) {
            console.error('Erro ao criar academia:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/dashboard/personal/academias">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Nova Academia</h1>
                    <p className="text-muted-foreground">
                        Cadastre uma nova academia
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <Card className="max-w-2xl">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Building2 className="h-5 w-5" />
                            Dados da Academia
                        </CardTitle>
                        <CardDescription>
                            Preencha as informações da academia
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="nome">Nome da Academia *</Label>
                            <Input
                                id="nome"
                                name="nome"
                                placeholder="Ex: Academia Força Total"
                                value={formData.nome}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="cnpj">CNPJ *</Label>
                            <Input
                                id="cnpj"
                                name="cnpj"
                                placeholder="00.000.000/0001-00"
                                value={formData.cnpj}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="endereco">Endereço *</Label>
                            <Input
                                id="endereco"
                                name="endereco"
                                placeholder="Rua, número - Bairro, Cidade/UF"
                                value={formData.endereco}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="telefone">Telefone</Label>
                            <Input
                                id="telefone"
                                name="telefone"
                                placeholder="(00) 00000-0000"
                                value={formData.telefone}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="flex justify-between pt-4">
                            <Button type="button" variant="outline" onClick={() => router.back()}>
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? (
                                    <>Salvando...</>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        Salvar Academia
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
