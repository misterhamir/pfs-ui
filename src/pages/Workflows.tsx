import { Header } from "../components/Header";
import { Search, ChevronDown, ListFilter, Plus, ArrowRight, Copy, Pencil, Trash2 } from "lucide-react";
import { Switch } from "../components/Switch";

const MOCK_WORKFLOWS = [
    {
        id: "WF_001",
        name: "Invoice Processing Pipeline",
        steps: ["Upload", "Classify", "Extract", "Review L1", "Approve", "Export"],
        status: "Deployed",
        linkedSchema: "Invoice_Standard_v2",
        createdAt: "2024-01-15",
        lastModified: "2024-02-10",
        isActive: true,
    },
    {
        id: "WF_002",
        name: "Receipt Reconciliation",
        steps: ["Upload", "Extract", "Review L1", "Review L2", "Export"],
        status: "Deployed",
        linkedSchema: "Receipt_Thermal_POS",
        createdAt: "2024-01-20",
        lastModified: "2024-02-08",
        isActive: true,
    },
    {
        id: "WF_003",
        name: "Shipping Document Workflow",
        steps: ["Upload", "Classify", "Extract", "Approve"],
        status: "Draft",
        linkedSchema: "Bill_of_Lading_Intl",
        createdAt: "2024-02-01",
        lastModified: "2024-02-12",
        isActive: false,
    },
    {
        id: "WF_004",
        name: "Medical Claims Processing",
        steps: ["Upload", "Extract", "Review L1", "Review L2", "Review L3", "Approve", "Export"],
        status: "Deployed",
        linkedSchema: "Medical_Claim_Form_CMS1500",
        createdAt: "2024-01-25",
        lastModified: "2024-02-14",
        isActive: true,
    },
    {
        id: "WF_005",
        name: "Identity Verification Flow",
        steps: ["Upload", "Extract", "Verify", "Approve"],
        status: "Paused",
        linkedSchema: "ID_Passport_MRZ",
        createdAt: "2024-02-05",
        lastModified: "2024-02-13",
        isActive: false,
    },
];

const STATUS_COLORS: Record<string, string> = {
    Deployed: "bg-primary-light text-primary",
    Draft: "bg-gray-100 text-gray-600",
    Paused: "bg-warning/10 text-warning",
};

export function Workflows() {
    return (
        <div className="flex flex-col h-full bg-[#f9fafb]">
            <Header title="WORKFLOWS" />

            <div className="flex-1 p-8 overflow-y-auto">
                <div className="max-w-7xl mx-auto space-y-6">
                    {/* Top Bar Actions */}
                    <div className="flex items-center justify-between pb-4 border-b border-border/60">
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2 text-sm">
                                <span className="text-text-secondary font-medium text-xs uppercase tracking-wider">Filter By:</span>
                                <div className="flex items-center border border-border bg-white rounded flex-row gap-2 px-3 py-1.5 cursor-pointer hover:bg-surface">
                                    Status: All <ChevronDown className="w-4 h-4 text-text-secondary" />
                                </div>
                                <div className="flex items-center border border-border bg-white rounded flex-row gap-2 px-3 py-1.5 cursor-pointer hover:bg-surface">
                                    Schema: All <ChevronDown className="w-4 h-4 text-text-secondary" />
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-row items-center gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                                <input
                                    type="text"
                                    placeholder="Search workflows..."
                                    className="pl-9 pr-4 py-2 border border-border rounded w-64 text-sm focus:outline-none focus:ring-1 focus:ring-primary h-10"
                                />
                            </div>
                            <button className="bg-primary hover:bg-primary-hover text-white flex items-center gap-2 px-5 font-bold tracking-wide h-10 text-sm transition-colors rounded">
                                <Plus className="w-4 h-4" strokeWidth={3} /> CREATE WORKFLOW
                            </button>
                        </div>
                    </div>

                    {/* Sorting / Meta row */}
                    <div className="flex justify-between items-center text-sm text-text-secondary">
                        <div>Showing <span className="font-bold text-text-primary">1-5</span> of 5 workflows</div>
                        <div className="flex items-center gap-1.5 cursor-pointer">
                            <ListFilter className="w-4 h-4" />
                            Sort: Last Modified
                        </div>
                    </div>

                    {/* Workflow Cards */}
                    <div className="space-y-4">
                        {MOCK_WORKFLOWS.map((workflow) => (
                            <div key={workflow.id} className="bg-white rounded-lg border border-border shadow-sm p-5 hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="font-bold text-lg text-text-primary tracking-tight">{workflow.name}</h3>
                                            <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${STATUS_COLORS[workflow.status]}`}>
                                                {workflow.status}
                                            </span>
                                        </div>
                                        <p className="text-xs text-text-secondary font-mono tracking-wider mb-4">Linked Schema: {workflow.linkedSchema}</p>

                                        {/* Workflow Steps Visualization */}
                                        <div className="flex items-center gap-2 flex-wrap mb-4">
                                            {workflow.steps.map((step, index) => (
                                                <div key={index} className="flex items-center gap-2">
                                                    <div className="px-3 py-1.5 bg-surface rounded text-xs font-medium text-text-primary border border-border">
                                                        {step}
                                                    </div>
                                                    {index < workflow.steps.length - 1 && (
                                                        <ArrowRight className="w-3 h-3 text-text-secondary" />
                                                    )}
                                                </div>
                                            ))}
                                        </div>

                                        <div className="flex items-center gap-4 text-xs text-text-secondary">
                                            <span>Created: {workflow.createdAt}</span>
                                            <span>Last Modified: {workflow.lastModified}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 ml-6">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] uppercase font-bold tracking-wider text-text-secondary">
                                                {workflow.isActive ? 'ACTIVE' : 'INACTIVE'}
                                            </span>
                                            <Switch checked={workflow.isActive} />
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <button className="p-1.5 text-text-secondary hover:text-primary hover:bg-primary-light rounded transition-colors" title="Edit">
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button className="p-1.5 text-text-secondary hover:text-text-primary hover:bg-surface rounded transition-colors" title="Duplicate">
                                                <Copy className="w-4 h-4" />
                                            </button>
                                            <button className="p-1.5 text-text-secondary hover:text-error hover:bg-error/10 rounded transition-colors" title="Delete">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
