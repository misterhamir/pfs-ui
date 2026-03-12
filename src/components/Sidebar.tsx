import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    FileText,
    Files,
    Users,
    Network,
    Rocket
} from "lucide-react";
import { cn } from "../lib/utils";

const navigation = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Schema Manager", href: "/schemas", icon: FileText },
    { name: "Training Files", href: "/training-files", icon: Files },
    { name: "Users & Roles", href: "/users", icon: Users },
    { name: "Workflows", href: "/workflows", icon: Network },
    { name: "Deployments", href: "/deployments", icon: Rocket },
];

export function Sidebar() {
    return (
        <div className="flex h-full w-64 flex-col border-r border-border bg-background">
            <div className="flex h-16 shrink-0 items-center px-6 border-b border-border">
                {/* Mock Logo */}
                <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
                    <div className="bg-[#1C1C1C] text-current p-1 rounded-sm w-7 h-7 flex items-center justify-center">
                        <div className="w-3 h-3 bg-primary transform rotate-45"></div>
                    </div>
                    RENUSCULE
                </div>
            </div>

            <div className="flex flex-1 flex-col overflow-y-auto px-3 py-6">
                <nav className="flex-1 space-y-1">
                    {navigation.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.href}
                            className={({ isActive }) =>
                                cn(
                                    "group flex items-center px-3 py-2 text-sm font-medium rounded-md w-full",
                                    "border-l-4 transition-colors",
                                    isActive
                                        ? "bg-primary-light text-primary border-primary"
                                        : "border-transparent text-text-secondary hover:bg-surface hover:text-text-primary"
                                )
                            }
                        >
                            <item.icon
                                className="mr-3 h-5 w-5 shrink-0"
                                aria-hidden="true"
                            />
                            {item.name}
                        </NavLink>
                    ))}
                </nav>
            </div>

            {/* User Profile Snippet in Sidebar Bottom potentially */}
            <div className="border-t border-border p-4">
                <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-surface border border-border flex items-center justify-center text-sm font-medium">
                        JS
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-text-primary">Jane Smith</span>
                        <span className="text-xs text-text-secondary">Admin</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
