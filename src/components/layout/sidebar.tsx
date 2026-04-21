"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Timer,
  CheckSquare,
  BookOpen,
  BarChart2,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { logout } from "@/lib/actions/auth";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const navItems = [
  { href: "/", label: "ダッシュボード", icon: LayoutDashboard },
  { href: "/timer", label: "タイマー", icon: Timer },
  { href: "/tasks", label: "タスク", icon: CheckSquare },
  { href: "/subjects", label: "科目", icon: BookOpen },
  { href: "/stats", label: "統計", icon: BarChart2 },
  { href: "/settings", label: "設定", icon: Settings },
];

function NavIcon({ href, label, icon: Icon, isActive }: {
  href: string; label: string; icon: React.ElementType; isActive: boolean;
}) {
  return (
    <Tooltip>
      <TooltipTrigger
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-lg transition-colors cursor-pointer",
          isActive
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        )}
        render={<Link href={href} />}
      >
        <Icon className="h-5 w-5" />
        <span className="sr-only">{label}</span>
      </TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  );
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <TooltipProvider>
      <aside className="fixed inset-y-0 left-0 z-50 flex w-14 flex-col border-r bg-background">
        <div className="flex h-14 items-center justify-center border-b">
          <span className="text-xl">📚</span>
        </div>

        <nav className="flex flex-1 flex-col gap-1 p-2">
          {navItems.map(({ href, label, icon }) => {
            const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <NavIcon key={href} href={href} label={label} icon={icon} isActive={isActive} />
            );
          })}
        </nav>

        <div className="p-2 border-t">
          <Tooltip>
            <TooltipTrigger
              className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer"
              onClick={() => logout()}
            >
              <LogOut className="h-5 w-5" />
              <span className="sr-only">ログアウト</span>
            </TooltipTrigger>
            <TooltipContent side="right">ログアウト</TooltipContent>
          </Tooltip>
        </div>
      </aside>
    </TooltipProvider>
  );
}
