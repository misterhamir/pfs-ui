import { Switch } from "./Switch";
import { Clock } from "lucide-react";
import { cn } from "../lib/utils";

export interface SchemaCardProps {
    name: string;
    id: string;
    fields: string[];
    version: string;
    isActive: boolean;
    onToggleActive?: () => void;
}

export function SchemaCard({ name, id, fields, version, isActive, onToggleActive }: SchemaCardProps) {
    return (
        <div className="flex flex-col bg-white rounded-lg border border-border shadow-sm p-5 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-1">
                <h3 className="font-bold text-lg text-text-primary tracking-tight">{name}</h3>
                <div className={cn("w-2 h-2 rounded-full mt-1.5", isActive ? "bg-primary" : "bg-border")} />
            </div>
            <p className="text-xs text-text-secondary font-mono tracking-wider mb-6">ID: {id}</p>

            <div className="mb-4">
                <p className="text-xs font-semibold text-text-secondary tracking-widest uppercase mb-3 text-[10px]">Extraction Fields</p>
                <div className="flex flex-wrap gap-2">
                    {fields.map((field) => (
                        <span key={field} className="inline-flex items-center px-2 py-1 rounded bg-[#F1F3F5] text-text-primary text-xs font-mono">
                            {field}
                        </span>
                    ))}
                </div>
            </div>

            <div className="mt-auto pt-4 border-t border-border/60 flex items-center justify-between">
                <div className="flex flex-row items-center text-text-secondary text-xs gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {version}
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-text-secondary">
                        {isActive ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                    <Switch checked={isActive} onCheckedChange={onToggleActive} />
                </div>
            </div>
        </div>
    );
}
