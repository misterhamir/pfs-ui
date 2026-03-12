import { Header } from "../components/Header";
import { Files, Zap, Users } from "lucide-react";

export function Dashboard() {
    return (
        <div className="flex flex-col h-full bg-[#f9fafb]">
            <Header title="DASHBOARD" />

            <div className="flex-1 p-8 overflow-y-auto">
                <div className="max-w-7xl mx-auto space-y-6">
                    <h2 className="text-xl font-bold tracking-tight text-text-primary">Welcome back, Jane</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-lg border border-border shadow-sm flex items-center gap-4">
                            <div className="p-3 bg-primary-light text-primary rounded-lg">
                                <Files className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-text-primary mt-1">12,492</p>
                                <p className="text-sm font-medium text-text-secondary uppercase tracking-widest text-[10px]">Total Pages Processed</p>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-lg border border-border shadow-sm flex items-center gap-4">
                            <div className="p-3 bg-primary-light text-primary rounded-lg">
                                <Zap className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-text-primary mt-1">98.4%</p>
                                <p className="text-sm font-medium text-text-secondary uppercase tracking-widest text-[10px]">Avg Classification Acc.</p>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-lg border border-border shadow-sm flex items-center gap-4">
                            <div className="p-3 bg-primary-light text-primary rounded-lg">
                                <Users className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-text-primary mt-1">14</p>
                                <p className="text-sm font-medium text-text-secondary uppercase tracking-widest text-[10px]">Pending Reviews</p>
                            </div>
                        </div>
                    </div>

                    {/* Mock charts area */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                        <div className="bg-white border border-border rounded-lg p-6 shadow-sm min-h-[300px] flex items-center justify-center">
                            <p className="text-text-secondary font-medium">Pages Processed Over Time (Chart Placeholder)</p>
                        </div>
                        <div className="bg-white border border-border rounded-lg p-6 shadow-sm min-h-[300px] flex items-center justify-center">
                            <p className="text-text-secondary font-medium">Classification Dist. (Chart Placeholder)</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
