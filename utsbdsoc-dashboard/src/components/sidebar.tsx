"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  CheckSquare,
  Users,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/events", label: "Events", icon: CalendarDays },
  { href: "/my-tasks", label: "My Tasks", icon: CheckSquare },
  { href: "/team", label: "Team", icon: Users },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col bg-bg-card border-r border-bg-elevated">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 px-6 border-b border-bg-elevated">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-gold text-bg-base font-bold text-sm">
          BD
        </div>
        <span className="text-lg font-semibold text-text-primary">
          UTSBDSOC
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive =
            pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-accent-gold/10 text-accent-gold"
                  : "text-text-secondary hover:bg-bg-elevated hover:text-text-primary"
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-bg-elevated px-4 py-3">
        <p className="text-xs text-text-secondary">
          UTS Bangladeshi Society
        </p>
      </div>
    </aside>
  );
}
