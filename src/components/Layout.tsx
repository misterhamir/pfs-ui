import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";

export function Layout() {
    return (
        <div className="flex h-screen w-full bg-[#f9fafb]">
            <Sidebar />
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* The Header could go here, or handled per-page if title changes */}
                <main className="flex-1 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
