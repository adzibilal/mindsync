"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import {
  LayoutDashboard,
  FileText,
  Upload,
  MessageSquare,
  Settings,
  LogOut,
  Bot,
  Users,
} from "lucide-react";
import { getUserData, clearAuth } from "@/utils/cookies";
import { toast } from "sonner";

interface SidebarProps {
  readonly className?: string;
}

const menuItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Documents",
    href: "/dashboard/documents",
    icon: FileText,
  },
  {
    title: "Upload",
    href: "/dashboard/upload",
    icon: Upload,
  },
  // {
  //   title: "Chat History",
  //   href: "/dashboard/chat",
  //   icon: MessageSquare,
  // },
  {
    title: "AI Persona",
    href: "/dashboard/persona",
    icon: Bot,
  },
  // {
  //   title: "Users",
  //   href: "/dashboard/users",
  //   icon: Users,
  // },
  // {
  //   title: "Settings",
  //   href: "/dashboard/settings",
  //   icon: Settings,
  // },
];

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const userData = getUserData();

  const handleLogout = () => {
    clearAuth();
    toast.success("Logged out successfully");
    router.push("/auth/login");
  };

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const userName = userData?.name as string || "User";
  const userEmail = userData?.email as string || userData?.whatsapp_number as string || "";

  return (
    <div
      className={cn(
        "flex h-full flex-col bg-white dark:bg-slate-950",
        "border-r border-slate-200 dark:border-slate-800",
        className
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-slate-200 dark:border-slate-800 px-6">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white transition-transform hover:scale-105">
            <Bot className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
            Mindsync
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          // Untuk Dashboard, hanya exact match. Untuk menu lain, check prefix
          const isActive = item.href === "/dashboard" 
            ? pathname === "/dashboard"
            : pathname === item.href || pathname?.startsWith(`${item.href}/`);

          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start transition-all duration-200",
                  isActive && "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
                  !isActive && "hover:bg-slate-50 dark:hover:bg-slate-900"
                )}
              >
                <Icon className="mr-2 h-4 w-4" />
                {item.title}
              </Button>
            </Link>
          );
        })}
      </nav>

      <Separator className="bg-slate-200 dark:bg-slate-800" />

      {/* User Profile */}
      <div className="p-4">
        <div className="flex items-center gap-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-3">
          <Avatar>
            <AvatarImage src="" alt={userName} />
            <AvatarFallback className="bg-blue-600 text-white">
              {getInitials(userName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-medium">{userName}</p>
            <p className="truncate text-xs text-slate-500 dark:text-slate-400">
              {userEmail}
            </p>
          </div>
        </div>

        <div className="mt-2 space-y-1">
          <ThemeToggle />
          
          <Button
            variant="ghost"
            className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950 transition-colors"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}

