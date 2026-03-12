import { Header } from "../components/Header";
import { ArrowLeft, Play, RotateCcw, Save, Rocket, Plus, GripVertical, Trash2, Eye, Code, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const SCHEMA_FIELDS = [
    { id: 1, name: "invoice_number", type: "string", required: true, description: "Unique invoice identifier" },
    { id: 2, name: "invoice_date", type: "date", required: true, description: "Date when invoice was issued" },
    { id: 3, name: "total_amount", type: "currency", required: true, description: "Total amount including tax" },
    { id: 4, name: "vendor_name", type: "string", required: true, description: "Name of the vendor/supplier" },
    { id: 5, name: "vendor_address", type: "string", required: false, description: "Full vendor address" },
    { id: 6, name: "line_items", type: "array", required: true, description: "List of purchased items" },
    { id: 7, name: "tax_amount", type: "currency", required: false, description: "Tax amount" },
    { id: 8, name: "payment_due_date", type: "date", required: false, description: "Payment deadline" },
];

const DATA_TYPES = ["string", "number", "date", "boolean", "array", "object", "currency", "email", "phone"];

const JSON_SCHEMA = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "type": "object",
    "properties": {
        "invoice_number": { "type": "string", "description": "Unique invoice identifier" },
        "invoice_date": { "type": "string", "format": "date" },
        "total_amount": { "type": "number" },
        "vendor_name": { "type": "string" },
        "vendor_address": { "type": "string" },
        "line_items": {
            "type": "array",
            "items": { "type": "object" }
        },
        "tax_amount": { "type": "number" },
        "payment_due_date": { "type": "string", "format": "date" }
    },
    "required": ["invoice_number", "invoice_date", "total_amount", "vendor_name", "line_items"]
};

export function SchemaDetail() {
    const [viewMode, setViewMode] = useState<'tree' | 'raw'>('tree');
    const fields = SCHEMA_FIELDS;

    return (
        <div className="flex flex-col h-full bg-[#f9fafb]">
            <Header title="SCHEMA EDITOR" />

            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Action Bar */}
                <div className="bg-white border-b border-border px-6 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link to="/schemas" className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors">
                            <ArrowLeft className="w-4 h-4" />
                            <span className="text-sm">Back to Schemas</span>
                        </Link>
                        <div className="h-5 w-px bg-border" />
                        <div>
                            <h2 className="font-bold text-text-primary">Invoice_Standard_v2</h2>
                            <p className="text-xs text-text-secondary">ID: SCH_8829_F • Version 2.4</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-text-secondary border border-border rounded hover:bg-surface transition-colors">
                            <Play className="w-4 h-4" /> Test Schema
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-text-secondary border border-border rounded hover:bg-surface transition-colors">
                            <RotateCcw className="w-4 h-4" /> Retrain
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-text-secondary border border-border rounded hover:bg-surface transition-colors">
                            <Save className="w-4 h-4" /> Save
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-primary hover:bg-primary-hover rounded transition-colors">
                            <Rocket className="w-4 h-4" /> Deploy
                        </button>
                    </div>
                </div>

                {/* Main Content - Split View */}
                <div className="flex-1 flex overflow-hidden">
                    {/* Left Panel - Field Editor */}
                    <div className="w-1/2 border-r border-border bg-white overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-text-primary">Extraction Fields</h3>
                                <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-primary bg-primary-light rounded hover:bg-primary/20 transition-colors">
                                    <Plus className="w-3 h-3" /> Add Field
                                </button>
                            </div>

                            {/* Field Table */}
                            <div className="space-y-2">
                                {fields.map((field) => (
                                    <div key={field.id} className="flex items-center gap-3 p-3 bg-surface/50 rounded-lg border border-border/50 hover:border-border transition-colors group">
                                        <GripVertical className="w-4 h-4 text-text-secondary cursor-grab opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <div className="flex-1 grid grid-cols-12 gap-3 items-center">
                                            <input
                                                type="text"
                                                value={field.name}
                                                className="col-span-4 px-2 py-1.5 text-sm bg-white border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary"
                                            />
                                            <div className="col-span-3 relative">
                                                <select
                                                    value={field.type}
                                                    className="w-full px-2 py-1.5 text-sm bg-white border border-border rounded appearance-none focus:outline-none focus:ring-1 focus:ring-primary"
                                                >
                                                    {DATA_TYPES.map(type => (
                                                        <option key={type} value={type}>{type}</option>
                                                    ))}
                                                </select>
                                                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-text-secondary pointer-events-none" />
                                            </div>
                                            <div className="col-span-2 flex items-center justify-center">
                                                <label className="flex items-center gap-1.5 text-xs text-text-secondary">
                                                    <input type="checkbox" checked={field.required} className="rounded border-border" />
                                                    Required
                                                </label>
                                            </div>
                                            <input
                                                type="text"
                                                value={field.description}
                                                placeholder="Description..."
                                                className="col-span-3 px-2 py-1.5 text-sm bg-white border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary"
                                            />
                                        </div>
                                        <button className="p-1 text-text-secondary hover:text-error hover:bg-error/10 rounded opacity-0 group-hover:opacity-100 transition-all">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Panel - JSON Preview */}
                    <div className="w-1/2 bg-[#1e1e1e] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-white">JSON Schema Preview</h3>
                                <div className="flex items-center gap-1 bg-white/10 rounded p-1">
                                    <button
                                        onClick={() => setViewMode('tree')}
                                        className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded transition-colors ${
                                            viewMode === 'tree' ? 'bg-white text-[#1e1e1e]' : 'text-white/70 hover:text-white'
                                        }`}
                                    >
                                        <Eye className="w-3 h-3" /> Tree
                                    </button>
                                    <button
                                        onClick={() => setViewMode('raw')}
                                        className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded transition-colors ${
                                            viewMode === 'raw' ? 'bg-white text-[#1e1e1e]' : 'text-white/70 hover:text-white'
                                        }`}
                                    >
                                        <Code className="w-3 h-3" /> Raw
                                    </button>
                                </div>
                            </div>

                            {viewMode === 'raw' ? (
                                <pre className="text-sm text-white/90 font-mono overflow-x-auto">
                                    {JSON.stringify(JSON_SCHEMA, null, 2)}
                                </pre>
                            ) : (
                                <div className="space-y-2">
                                    {/* Tree View */}
                                    <div className="text-sm font-mono">
                                        <div className="text-purple-400">{"{"}</div>
                                        <div className="pl-4">
                                            <span className="text-teal-400">"$schema"</span>
                                            <span className="text-white">: </span>
                                            <span className="text-orange-300">"http://json-schema.org/draft-07/schema#"</span>
                                            <span className="text-white">,</span>
                                        </div>
                                        <div className="pl-4">
                                            <span className="text-teal-400">"type"</span>
                                            <span className="text-white">: </span>
                                            <span className="text-orange-300">"object"</span>
                                            <span className="text-white">,</span>
                                        </div>
                                        <div className="pl-4">
                                            <span className="text-teal-400">"properties"</span>
                                            <span className="text-white">: </span>
                                            <span className="text-purple-400">{"{"}</span>
                                        </div>
                                        {Object.entries(JSON_SCHEMA.properties).map(([key, value], index, arr) => (
                                            <div key={key} className="pl-8">
                                                <span className="text-teal-400">"{key}"</span>
                                                <span className="text-white">: </span>
                                                <span className="text-purple-400">{"{"}</span>
                                                <span className="text-teal-400">"type"</span>
                                                <span className="text-white">: </span>
                                                <span className="text-orange-300">"{(value as any).type}"</span>
                                                {(value as any).format && (
                                                    <>
                                                        <span className="text-white">, </span>
                                                        <span className="text-teal-400">"format"</span>
                                                        <span className="text-white">: </span>
                                                        <span className="text-orange-300">"{(value as any).format}"</span>
                                                    </>
                                                )}
                                                <span className="text-purple-400">{"}"}</span>
                                                {index < arr.length - 1 && <span className="text-white">,</span>}
                                            </div>
                                        ))}
                                        <div className="pl-4">
                                            <span className="text-purple-400">{"}"}</span>
                                            <span className="text-white">,</span>
                                        </div>
                                        <div className="pl-4">
                                            <span className="text-teal-400">"required"</span>
                                            <span className="text-white">: </span>
                                            <span className="text-purple-400">[</span>
                                        </div>
                                        <div className="pl-8">
                                            {JSON_SCHEMA.required.map((req, index, arr) => (
                                                <span key={req}>
                                                    <span className="text-orange-300">"{req}"</span>
                                                    {index < arr.length - 1 && <span className="text-white">, </span>}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="pl-4">
                                            <span className="text-purple-400">]</span>
                                        </div>
                                        <div className="text-purple-400">{"}"}</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
