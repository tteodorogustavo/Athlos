"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dumbbell,
  Users,
  Building2,
  BarChart3,
  ChevronRight,
  CheckCircle2,
  Zap,
  Shield,
  Smartphone,
  ArrowRight,
  Star,
} from "lucide-react";

export default function HomePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  // Redirecionar usuário logado para o dashboard
  useEffect(() => {
    if (!isLoading && user) {
      switch (user.user_type) {
        case "PERSONAL":
          router.push("/dashboard/personal");
          break;
        case "ALUNO":
          router.push("/dashboard/aluno");
          break;
        case "ADMIN":
          router.push("/dashboard/academia");
          break;
        case "ADMIN_SISTEMA":
          router.push("/dashboard/admin");
          break;
      }
    }
  }, [user, isLoading, router]);

  const features = [
    {
      icon: Dumbbell,
      title: "Gestão de Treinos",
      description:
        "Crie e gerencie treinos personalizados para cada aluno com facilidade.",
    },
    {
      icon: Users,
      title: "Controle de Alunos",
      description:
        "Acompanhe o progresso de todos os seus alunos em um só lugar.",
    },
    {
      icon: BarChart3,
      title: "Relatórios Detalhados",
      description:
        "Visualize métricas e KPIs para tomar decisões baseadas em dados.",
    },
    {
      icon: Building2,
      title: "Multi-Academia",
      description:
        "Gerencie múltiplas academias e personais em uma única plataforma.",
    },
  ];

  const benefits = [
    "Treinos personalizados e adaptáveis",
    "Acompanhamento de progresso em tempo real",
    "Comunicação direta com personal trainers",
    "Histórico completo de exercícios",
    "Métricas de desempenho detalhadas",
    "Acesso em qualquer dispositivo",
  ];

  const stats = [
    { value: "10k+", label: "Usuários Ativos" },
    { value: "500+", label: "Academias" },
    { value: "50k+", label: "Treinos Criados" },
    { value: "98%", label: "Satisfação" },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-zinc-900 to-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-zinc-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="bg-yellow-500 p-2 rounded-lg">
                <Dumbbell className="h-6 w-6 text-black" />
              </div>
              <span className="text-xl font-bold text-white">Athlos</span>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <a
                href="#features"
                className="text-zinc-400 hover:text-white transition-colors"
              >
                Recursos
              </a>
              <a
                href="#benefits"
                className="text-zinc-400 hover:text-white transition-colors"
              >
                Benefícios
              </a>
              <a
                href="#pricing"
                className="text-zinc-400 hover:text-white transition-colors"
              >
                Planos
              </a>
            </nav>
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" className="text-zinc-300 hover:text-white hover:bg-zinc-800">
                  Entrar
                </Button>
              </Link>
              <Link href="/login">
                <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
                  Começar Agora
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            <Badge className="mb-6 bg-yellow-500/10 text-yellow-400 border-yellow-500/20 hover:bg-yellow-500/20">
              <Zap className="h-3 w-3 mr-1" />
              Plataforma #1 para Personal Trainers
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Transforme sua forma de{" "}
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500">
                gerenciar treinos
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-zinc-400 max-w-3xl mx-auto mb-10">
              O Athlos é a plataforma completa para personal trainers, academias
              e alunos. Gerencie treinos, acompanhe progresso e alcance
              resultados incríveis.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/login">
                <Button
                  size="lg"
                  className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8 py-6 text-lg"
                >
                  Começar Gratuitamente
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>

            </div>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-zinc-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-black/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-yellow-500/10 text-yellow-400 border-yellow-500/20">
              Recursos
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Tudo que você precisa em um só lugar
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              Ferramentas poderosas para gerenciar seus treinos, alunos e
              academias de forma eficiente.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="bg-black/50 border-zinc-800 hover:border-yellow-500/50 transition-all duration-300 group"
              >
                <CardContent className="p-6">
                  <div className="bg-yellow-500/10 p-3 rounded-lg w-fit mb-4 group-hover:bg-yellow-500/20 transition-colors">
                    <feature.icon className="h-6 w-6 text-yellow-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-zinc-400 text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge className="mb-4 bg-yellow-500/10 text-yellow-400 border-yellow-500/20">
                Benefícios
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                Por que escolher o Athlos?
              </h2>
              <p className="text-zinc-400 mb-8">
                Nossa plataforma foi desenvolvida pensando em todas as
                necessidades de personal trainers, academias e alunos.
              </p>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-yellow-400 flex-shrink-0" />
                    <span className="text-zinc-300">{benefit}</span>
                  </li>
                ))}
              </ul>
              <Link href="/login">
                <Button className="mt-8 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
                  Começar Agora
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-yellow-500/20 to-amber-500/20 rounded-2xl p-8 border border-zinc-800">
                <div className="space-y-4">
                  <div className="bg-black rounded-lg p-4 border border-zinc-800">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-yellow-500 p-2 rounded-lg">
                        <Dumbbell className="h-4 w-4 text-black" />
                      </div>
                      <span className="text-white font-medium">
                        Treino do Dia
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-zinc-400">Supino Reto</span>
                        <span className="text-yellow-400">4x12</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-zinc-400">Crucifixo</span>
                        <span className="text-yellow-400">3x15</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-zinc-400">Tríceps Pulley</span>
                        <span className="text-yellow-400">4x12</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-black rounded-lg p-4 border border-zinc-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-zinc-400 text-sm">
                        Progresso Semanal
                      </span>
                      <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20">
                        +12%
                      </Badge>
                    </div>
                    <div className="w-full bg-zinc-800 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-yellow-500 to-amber-500 h-2 rounded-full"
                        style={{ width: "75%" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-black/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-yellow-500/10 text-yellow-400 border-yellow-500/20">
              Planos
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Escolha o plano ideal para você
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              Comece gratuitamente e evolua conforme sua necessidade.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <Card className="bg-black/50 border-zinc-800">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold text-white mb-2">
                  Gratuito
                </h3>
                <p className="text-zinc-400 text-sm mb-6">
                  Perfeito para começar
                </p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-white">R$ 0</span>
                  <span className="text-zinc-500">/mês</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2 text-zinc-300 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-yellow-400" />
                    Até 5 alunos
                  </li>
                  <li className="flex items-center gap-2 text-zinc-300 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-yellow-400" />
                    Treinos ilimitados
                  </li>
                  <li className="flex items-center gap-2 text-zinc-300 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-yellow-400" />
                    Relatórios básicos
                  </li>
                </ul>
                <Link href="/login" className="block">
                  <Button
                    variant="outline"
                    className="w-full border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                  >
                    Começar Grátis
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="bg-gradient-to-b from-yellow-500/10 to-black/50 border-yellow-500/50 relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <Badge className="bg-yellow-500 text-black font-semibold">
                  <Star className="h-3 w-3 mr-1" />
                  Mais Popular
                </Badge>
              </div>
              <CardContent className="p-8 pt-10">
                <h3 className="text-xl font-semibold text-white mb-2">
                  Profissional
                </h3>
                <p className="text-zinc-400 text-sm mb-6">
                  Para personal trainers
                </p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-white">R$ 49</span>
                  <span className="text-zinc-500">/mês</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2 text-zinc-300 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-yellow-400" />
                    Alunos ilimitados
                  </li>
                  <li className="flex items-center gap-2 text-zinc-300 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-yellow-400" />
                    Treinos ilimitados
                  </li>
                  <li className="flex items-center gap-2 text-zinc-300 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-yellow-400" />
                    Relatórios avançados
                  </li>
                  <li className="flex items-center gap-2 text-zinc-300 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-yellow-400" />
                    Suporte prioritário
                  </li>
                </ul>
                <Link href="/login" className="block">
                  <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
                    Assinar Agora
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Enterprise Plan */}
            <Card className="bg-black/50 border-zinc-800">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold text-white mb-2">
                  Academia
                </h3>
                <p className="text-zinc-400 text-sm mb-6">
                  Para academias e redes
                </p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-white">R$ 199</span>
                  <span className="text-zinc-500">/mês</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2 text-zinc-300 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-yellow-400" />
                    Tudo do Profissional
                  </li>
                  <li className="flex items-center gap-2 text-zinc-300 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-yellow-400" />
                    Multi-unidades
                  </li>
                  <li className="flex items-center gap-2 text-zinc-300 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-yellow-400" />
                    Gestão de personal trainers
                  </li>
                  <li className="flex items-center gap-2 text-zinc-300 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-yellow-400" />
                    API e integrações
                  </li>
                </ul>
                <Link href="/login" className="block">
                  <Button
                    variant="outline"
                    className="w-full border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                  >
                    Falar com Vendas
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-gradient-to-r from-yellow-500/20 to-amber-500/20 rounded-2xl p-8 sm:p-12 border border-yellow-500/20 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Pronto para transformar sua forma de treinar?
            </h2>
            <p className="text-zinc-400 mb-8 max-w-2xl mx-auto">
              Junte-se a milhares de personal trainers e academias que já usam o
              Athlos para alcançar resultados incríveis.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/login">
                <Button
                  size="lg"
                  className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8"
                >
                  Criar Conta Gratuita
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-zinc-800">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-yellow-500 p-2 rounded-lg">
                  <Dumbbell className="h-5 w-5 text-black" />
                </div>
                <span className="text-lg font-bold text-white">Athlos</span>
              </div>
              <p className="text-zinc-500 text-sm">
                A plataforma completa para gestão de treinos e academias.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Produto</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-zinc-500 hover:text-zinc-300 text-sm">
                    Recursos
                  </a>
                </li>
                <li>
                  <a href="#" className="text-zinc-500 hover:text-zinc-300 text-sm">
                    Planos
                  </a>
                </li>
                <li>
                  <a href="#" className="text-zinc-500 hover:text-zinc-300 text-sm">
                    Integrações
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-zinc-500 hover:text-zinc-300 text-sm">
                    Sobre
                  </a>
                </li>
                <li>
                  <a href="#" className="text-zinc-500 hover:text-zinc-300 text-sm">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-zinc-500 hover:text-zinc-300 text-sm">
                    Carreiras
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Suporte</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-zinc-500 hover:text-zinc-300 text-sm">
                    Central de Ajuda
                  </a>
                </li>
                <li>
                  <a href="#" className="text-zinc-500 hover:text-zinc-300 text-sm">
                    Contato
                  </a>
                </li>
                <li>
                  <a href="#" className="text-zinc-500 hover:text-zinc-300 text-sm">
                    Privacidade
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-zinc-800 text-center">
            <p className="text-zinc-500 text-sm">
              © 2025 Athlos. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
