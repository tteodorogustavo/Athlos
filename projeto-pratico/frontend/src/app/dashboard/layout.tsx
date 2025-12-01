'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarTrigger,
} from '@/components/ui/sidebar';
import {
    Dumbbell,
    LayoutDashboard,
    Building2,
    Users,
    ClipboardList,
    LogOut,
    ChevronUp,
    User2,
    BarChart3,
} from 'lucide-react';

const personalMenuItems = [
    { title: 'Dashboard', url: '/dashboard/personal', icon: LayoutDashboard },
    { title: 'Academias', url: '/dashboard/personal/academias', icon: Building2 },
    { title: 'Alunos', url: '/dashboard/personal/alunos', icon: Users },
    { title: 'Treinos', url: '/dashboard/personal/treinos', icon: ClipboardList },
    { title: 'Relatórios', url: '/dashboard/personal/relatorios', icon: BarChart3 },
];

const adminMenuItems = [
    { title: 'Dashboard', url: '/dashboard/admin', icon: LayoutDashboard },
    { title: 'Academias', url: '/dashboard/admin/academias', icon: Building2 },
    { title: 'Personais', url: '/dashboard/admin/personais', icon: Users },
    { title: 'Alunos', url: '/dashboard/admin/alunos', icon: Users },
    { title: 'Relatórios', url: '/dashboard/admin/relatorios', icon: BarChart3 },
];

const alunoMenuItems = [
    { title: 'Dashboard', url: '/dashboard/aluno', icon: LayoutDashboard },
    { title: 'Meus Treinos', url: '/dashboard/aluno/treinos', icon: ClipboardList },
    { title: 'Meu Progresso', url: '/dashboard/aluno/relatorios', icon: BarChart3 },
];

const academiaMenuItems = [
    { title: 'Dashboard', url: '/dashboard/academia', icon: LayoutDashboard },
    { title: 'Alunos', url: '/dashboard/academia/alunos', icon: Users },
    { title: 'Personal Trainers', url: '/dashboard/academia/personais', icon: Users },
    { title: 'Relatórios', url: '/dashboard/academia/relatorios', icon: BarChart3 },
];

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, logout, isLoading } = useAuth();
    const pathname = usePathname();
    const router = useRouter();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!user) {
        router.push('/login');
        return null;
    }

    const getMenuItems = () => {
        switch (user.user_type) {
            case 'PERSONAL':
                return personalMenuItems;
            case 'ADMIN_SISTEMA':
                return adminMenuItems;
            case 'ADMIN':
                return academiaMenuItems;
            case 'ALUNO':
                return alunoMenuItems;
            default:
                return [];
        }
    };

    const menuItems = getMenuItems();

    const getInitials = () => {
        if (user.first_name && user.last_name) {
            return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
        }
        return user.email[0].toUpperCase();
    };

    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full">
                <Sidebar>
                    <SidebarHeader className="border-b px-6 py-4">
                        <Link href="/dashboard" className="flex items-center gap-2">
                            <div className="p-2 bg-primary rounded-lg">
                                <Dumbbell className="h-5 w-5 text-primary-foreground" />
                            </div>
                            <span className="font-bold text-xl">Athlos</span>
                        </Link>
                    </SidebarHeader>

                    <SidebarContent>
                        <SidebarGroup>
                            <SidebarGroupLabel>Menu</SidebarGroupLabel>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    {menuItems.map((item) => (
                                        <SidebarMenuItem key={item.title}>
                                            <SidebarMenuButton
                                                asChild
                                                isActive={pathname === item.url}
                                            >
                                                <Link href={item.url}>
                                                    <item.icon className="h-4 w-4" />
                                                    <span>{item.title}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    ))}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    </SidebarContent>

                    <SidebarFooter>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <SidebarMenuButton className="w-full">
                                            <Avatar className="h-6 w-6">
                                                <AvatarFallback className="text-xs">
                                                    {getInitials()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className="truncate">
                                                {user.first_name || user.email}
                                            </span>
                                            <ChevronUp className="ml-auto h-4 w-4" />
                                        </SidebarMenuButton>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        side="top"
                                        className="w-[--radix-popper-anchor-width]"
                                    >
                                        <DropdownMenuLabel>
                                            <div className="flex flex-col space-y-1">
                                                <p className="text-sm font-medium">
                                                    {user.first_name} {user.last_name}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {user.email}
                                                </p>
                                            </div>
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem>
                                            <User2 className="mr-2 h-4 w-4" />
                                            Meu Perfil
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={logout} className="text-red-600">
                                            <LogOut className="mr-2 h-4 w-4" />
                                            Sair
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarFooter>
                </Sidebar>

                <main className="flex-1 overflow-auto bg-muted/30">
                    <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-6">
                        <SidebarTrigger />
                    </header>
                    <div className="p-6">
                        {children}
                    </div>
                </main>
            </div>
        </SidebarProvider>
    );
}
