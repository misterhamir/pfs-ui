import { useState } from "react";
import {
    ArrowLeft,
    ChevronDown,
    FileText,
    GitBranch,
    Layers3,
    Move,
    PanelLeft,
    PanelRight,
    Play,
    Save,
    Settings2,
    Sparkles,
    Upload,
    Workflow,
    ZoomIn,
    ZoomOut,
    SplitSquareHorizontal,
    UserRound,
} from "lucide-react";
import { Link } from "react-router-dom";

type NodeId = "trigger" | "ocr" | "decision" | "review" | "webhook";

type PaletteItem = {
    name: string;
    subtitle: string;
    badge?: string;
    icon: typeof FileText;
};

type CanvasNode = {
    id: NodeId;
    title: string;
    detail: string;
    x: number;
    y: number;
    headerTint: string;
    icon: typeof FileText;
    bodyRows: string[];
};

const PALETTE_SECTIONS: Array<{ title: string; items: PaletteItem[] }> = [
    {
        title: "Process Nodes",
        items: [
            { name: "Trigger", subtitle: "Doc Upload", icon: Upload },
            { name: "AI OCR", subtitle: "Extraction", icon: Sparkles },
            { name: "Condition", subtitle: "Logic Gate", icon: SplitSquareHorizontal },
            { name: "Integration", subtitle: "ERP Push", icon: GitBranch },
        ],
    },
    {
        title: "UI-generating Nodes",
        items: [
            { name: "Document Intake", subtitle: "Operator Upload", badge: "UI", icon: FileText },
            { name: "Human Review", subtitle: "Manual Check", badge: "UI", icon: UserRound },
            { name: "Approval Queue", subtitle: "Work Queue", badge: "UI", icon: Layers3 },
            { name: "Status Tracker", subtitle: "Live Updates", badge: "UI", icon: Workflow },
        ],
    },
];

const CANVAS_NODES: CanvasNode[] = [
    {
        id: "trigger",
        title: "Document Upload",
        detail: "Email inbox • invoices@acme.co",
        x: 56,
        y: 132,
        headerTint: "bg-primary-light",
        icon: Upload,
        bodyRows: ["Source: AP Inbox", "Mode: Watcher"],
    },
    {
        id: "ocr",
        title: "AI OCR Extractor",
        detail: "Model: Invoice v2.1",
        x: 420,
        y: 132,
        headerTint: "bg-primary-light",
        icon: Sparkles,
        bodyRows: ["Confidence: 98%", "Status: Ready"],
    },
    {
        id: "decision",
        title: "Confidence Check",
        detail: "If < 85%",
        x: 784,
        y: 132,
        headerTint: "bg-primary-light",
        icon: SplitSquareHorizontal,
        bodyRows: ["True path: Review", "False path: ERP"],
    },
    {
        id: "review",
        title: "Manual Review",
        detail: "Finance Team",
        x: 1148,
        y: 52,
        headerTint: "bg-primary-light",
        icon: UserRound,
        bodyRows: ["Queue: Exceptions", "SLA: 30 min"],
    },
    {
        id: "webhook",
        title: "Send to ERP",
        detail: "POST /api/v1/invoices",
        x: 1148,
        y: 232,
        headerTint: "bg-primary-light",
        icon: GitBranch,
        bodyRows: ["Endpoint: ERP API", "Auth: Service token"],
    },
];

const NODE_DETAILS: Record<NodeId, {
    summary: string;
    generated: string;
    owner: string;
    settings: Array<{ label: string; value: string }>;
    actions: string[];
}> = {
    trigger: {
        summary: "Listens for new invoices from the AP mailbox and starts the workflow.",
        generated: "operator/intake/document-upload.html",
        owner: "Intake",
        settings: [
            { label: "Mailbox", value: "invoices@acme.co" },
            { label: "File types", value: "PDF, PNG, JPG" },
            { label: "Dedup window", value: "30 min" },
        ],
        actions: ["Route to OCR", "Create case", "Notify ops"],
    },
    ocr: {
        summary: "Extracts vendor, date, line items, and totals using the invoice OCR model.",
        generated: "operator/intake/ocr-review.html",
        owner: "Document AI",
        settings: [
            { label: "Model", value: "Invoice v2.1" },
            { label: "Threshold", value: "98%" },
            { label: "Retries", value: "2" },
        ],
        actions: ["Send to decision", "Write confidence log", "Flag anomalies"],
    },
    decision: {
        summary: "Routes low-confidence results to human review and lets high-confidence results continue.",
        generated: "operator/routes/decision.html",
        owner: "Workflow",
        settings: [
            { label: "Confidence rule", value: "< 85%" },
            { label: "Fallback", value: "Human review" },
            { label: "Timeout", value: "15 min" },
        ],
        actions: ["Open review task", "Continue to ERP", "Escalate if stale"],
    },
    review: {
        summary: "Creates a manual queue item for finance staff when extraction confidence is too low.",
        generated: "operator/approvals/review-detail.html",
        owner: "Operations",
        settings: [
            { label: "Queue", value: "Exceptions" },
            { label: "Priority", value: "High" },
            { label: "SLA", value: "30 min" },
        ],
        actions: ["Approve", "Reject", "Request more info"],
    },
    webhook: {
        summary: "Posts the approved invoice payload into ERP for downstream posting.",
        generated: "operator/integrations/erp-push.html",
        owner: "Integration",
        settings: [
            { label: "Method", value: "POST" },
            { label: "Auth", value: "Service token" },
            { label: "Retry", value: "Exponential" },
        ],
        actions: ["Send payload", "Log response", "Alert on failure"],
    },
};

export function WorkflowBuilder() {
    const [selectedNode, setSelectedNode] = useState<NodeId>("ocr");
    const [zoom, setZoom] = useState(100);

    const nodeMeta = NODE_DETAILS[selectedNode];

    return (
        <div className="flex h-full flex-col bg-[#f9fafb]">
            <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-white px-6 lg:px-8">
                <div className="flex items-center gap-3 min-w-0">
                    <Link
                        to="/workflows"
                        className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-text-secondary transition-colors hover:bg-surface hover:text-text-primary"
                        aria-label="Back to workflows"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.2em] text-text-secondary">
                            <Link to="/workflows" className="hover:text-text-primary">
                                Workflows
                            </Link>
                            <span>/</span>
                            <span className="text-text-primary">AP Invoice Ingestion</span>
                        </div>
                        <h1 className="truncate text-lg font-bold tracking-tight text-text-primary">
                            Workflow Builder
                        </h1>
                    </div>
                    <span className="hidden rounded-full bg-primary-light px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-primary sm:inline-flex">
                        Draft State
                    </span>
                </div>

                <div className="flex items-center gap-2 lg:gap-3">
                    <div className="hidden items-center overflow-hidden rounded-md border border-border bg-surface sm:flex">
                        <button
                            type="button"
                            className="flex h-9 w-9 items-center justify-center text-text-secondary transition-colors hover:bg-white hover:text-text-primary"
                            onClick={() => setZoom((value) => Math.max(50, value - 10))}
                            aria-label="Zoom out"
                        >
                            <ZoomOut className="h-4 w-4" />
                        </button>
                        <span className="border-x border-border px-3 text-xs font-medium text-text-primary">
                            {zoom}%
                        </span>
                        <button
                            type="button"
                            className="flex h-9 w-9 items-center justify-center text-text-secondary transition-colors hover:bg-white hover:text-text-primary"
                            onClick={() => setZoom((value) => Math.min(150, value + 10))}
                            aria-label="Zoom in"
                        >
                            <ZoomIn className="h-4 w-4" />
                        </button>
                    </div>
                    <button
                        type="button"
                        className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-white px-3 text-sm font-medium text-text-primary transition-colors hover:bg-surface"
                    >
                        <Save className="h-4 w-4" />
                        <span className="hidden sm:inline">Save Draft</span>
                    </button>
                    <button
                        type="button"
                        className="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-3 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
                    >
                        <Play className="h-4 w-4" />
                        Publish
                    </button>
                </div>
            </header>

            <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
                <aside className="flex w-full shrink-0 flex-col border-b border-border bg-white lg:w-72 lg:border-b-0 lg:border-r">
                    <div className="border-b border-border px-5 py-4">
                        <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-text-secondary">
                            Components
                        </h2>
                    </div>
                    <div className="flex-1 space-y-6 overflow-y-auto px-4 py-4">
                        {PALETTE_SECTIONS.map((section) => (
                            <div key={section.title} className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-semibold text-text-primary">
                                        {section.title}
                                    </h3>
                                    <ChevronDown className="h-4 w-4 text-text-secondary" />
                                </div>
                                <div className="space-y-2">
                                    {section.items.map((item) => {
                                        const Icon = item.icon;
                                        return (
                                            <button
                                                key={item.name}
                                                type="button"
                                                className="group flex w-full items-center gap-3 rounded-lg border border-transparent px-3 py-2 text-left transition-colors hover:border-border hover:bg-surface/70"
                                            >
                                                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary-light text-primary">
                                                    <Icon className="h-4 w-4" />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="truncate text-sm font-medium text-text-primary">
                                                            {item.name}
                                                        </span>
                                                        {item.badge ? (
                                                            <span className="rounded-full bg-primary-light px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
                                                                {item.badge}
                                                            </span>
                                                        ) : null}
                                                    </div>
                                                    <p className="truncate text-xs text-text-secondary">
                                                        {item.subtitle}
                                                    </p>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </aside>

                <main className="min-h-0 flex-1 overflow-hidden bg-[#f9fafb] p-4 lg:p-6">
                    <div className="grid h-full min-h-0 grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
                        <section className="min-h-[640px] overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
                            <div className="flex items-center justify-between border-b border-border bg-surface/70 px-4 py-3">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2 rounded-md border border-border bg-white px-2 py-1 text-xs text-text-secondary">
                                        <Move className="h-3.5 w-3.5" />
                                        Canvas
                                    </div>
                                    <div className="hidden items-center gap-2 text-xs text-text-secondary md:flex">
                                        <Layers3 className="h-3.5 w-3.5" />
                                        Drag nodes to rearrange
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        className="flex h-8 items-center gap-2 rounded-md border border-border bg-white px-3 text-xs font-medium text-text-primary transition-colors hover:bg-surface"
                                    >
                                        <PanelLeft className="h-3.5 w-3.5" />
                                        Preview
                                    </button>
                                    <button
                                        type="button"
                                        className="flex h-8 items-center gap-2 rounded-md border border-border bg-white px-3 text-xs font-medium text-text-primary transition-colors hover:bg-surface"
                                    >
                                        <PanelRight className="h-3.5 w-3.5" />
                                        Properties
                                    </button>
                                </div>
                            </div>

                            <div
                                className="relative h-[calc(100%-57px)] overflow-hidden bg-[#fbfcfd]"
                                style={{
                                    backgroundImage:
                                        "linear-gradient(to right, rgba(132, 204, 22, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(132, 204, 22, 0.08) 1px, transparent 1px)",
                                    backgroundSize: "32px 32px",
                                    transform: `scale(${zoom / 100})`,
                                    transformOrigin: "top left",
                                    minWidth: 1500,
                                    minHeight: 520,
                                }}
                            >
                                <svg
                                    className="absolute inset-0 h-full w-full pointer-events-none"
                                    viewBox="0 0 1500 520"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M 256 192 C 332 192, 360 192, 420 192"
                                        stroke="#d1d5db"
                                        strokeDasharray="5 7"
                                        strokeWidth="2"
                                    />
                                    <path
                                        d="M 620 192 C 700 192, 724 192, 784 192"
                                        stroke="#d1d5db"
                                        strokeDasharray="5 7"
                                        strokeWidth="2"
                                    />
                                    <path
                                        d="M 984 192 C 1068 192, 1092 112, 1148 112"
                                        stroke="#84cc16"
                                        strokeWidth="2"
                                    />
                                    <path
                                        d="M 984 192 C 1068 192, 1092 292, 1148 292"
                                        stroke="#d1d5db"
                                        strokeDasharray="5 7"
                                        strokeWidth="2"
                                    />
                                </svg>

                                <div className="absolute inset-0">
                                    {CANVAS_NODES.map((node) => {
                                        const Icon = node.icon;
                                        const isSelected = node.id === selectedNode;

                                        return (
                                            <button
                                                key={node.id}
                                                type="button"
                                                onClick={() => setSelectedNode(node.id)}
                                                className={`absolute w-[200px] overflow-hidden rounded-xl border bg-white text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${
                                                    isSelected
                                                        ? "border-primary ring-2 ring-primary/20"
                                                        : "border-border"
                                                }`}
                                                style={{ left: node.x, top: node.y }}
                                            >
                                                <div className={`flex items-center gap-2 border-b border-border px-3 py-2 ${node.headerTint}`}>
                                                    <Icon className="h-3.5 w-3.5 text-primary" />
                                                    <span className="text-xs font-semibold text-text-primary">
                                                        {node.title}
                                                    </span>
                                                </div>
                                                <div className="space-y-2 px-3 py-3">
                                                    <div className="flex items-start justify-between gap-3">
                                                        <div>
                                                            <p className="text-sm font-medium text-text-primary">
                                                                {node.detail}
                                                            </p>
                                                            <p className="mt-0.5 text-xs text-text-secondary">
                                                                {node.bodyRows[0]}
                                                            </p>
                                                        </div>
                                                        <span className="rounded-full bg-primary-light px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
                                                            Live
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-between text-[11px] text-text-secondary">
                                                        <span>{node.bodyRows[1]}</span>
                                                        <div className={`h-3 w-3 rounded-full border-2 border-primary ${isSelected ? "bg-primary" : "bg-white"}`} />
                                                    </div>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </section>

                        <aside className="min-h-0 overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
                            <div className="border-b border-border px-5 py-4">
                                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-text-secondary">
                                    <Settings2 className="h-3.5 w-3.5" />
                                    Properties
                                </div>
                                <h2 className="mt-2 text-lg font-bold tracking-tight text-text-primary">
                                    {CANVAS_NODES.find((node) => node.id === selectedNode)?.title}
                                </h2>
                                <p className="mt-1 text-sm text-text-secondary">
                                    {nodeMeta.summary}
                                </p>
                            </div>

                            <div className="space-y-4 overflow-y-auto px-5 py-5">
                                <div className="rounded-xl bg-primary-light/70 p-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                                            Generates
                                        </span>
                                        <Workflow className="h-4 w-4 text-primary" />
                                    </div>
                                    <p className="mt-2 break-all text-sm font-medium text-text-primary">
                                        {nodeMeta.generated}
                                    </p>
                                </div>

                                <div className="rounded-xl border border-border bg-surface/50 p-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-text-secondary">
                                            Owner
                                        </span>
                                        <FileText className="h-4 w-4 text-primary" />
                                    </div>
                                    <p className="mt-2 text-sm font-medium text-text-primary">
                                        {nodeMeta.owner}
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm font-semibold text-text-primary">Settings</h3>
                                        <ChevronDown className="h-4 w-4 text-text-secondary" />
                                    </div>
                                    <div className="space-y-2">
                                        {nodeMeta.settings.map((setting) => (
                                            <div
                                                key={setting.label}
                                                className="flex items-center justify-between rounded-lg border border-border bg-white px-3 py-2"
                                            >
                                                <span className="text-xs text-text-secondary">{setting.label}</span>
                                                <span className="text-xs font-medium text-text-primary">
                                                    {setting.value}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <h3 className="text-sm font-semibold text-text-primary">Capabilities</h3>
                                    <div className="space-y-2">
                                        {nodeMeta.actions.map((action) => (
                                            <div
                                                key={action}
                                                className="flex items-center gap-2 rounded-lg bg-surface px-3 py-2 text-sm text-text-primary"
                                            >
                                                <div className="h-2 w-2 rounded-full bg-primary" />
                                                {action}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <h3 className="text-sm font-semibold text-text-primary">Live Trace</h3>
                                    <div className="space-y-2 rounded-xl border border-border bg-white p-4">
                                        <div className="flex items-center justify-between text-xs text-text-secondary">
                                            <span>Node ID</span>
                                            <span className="font-mono text-text-primary">{selectedNode.toUpperCase()}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs text-text-secondary">
                                            <span>Connection</span>
                                            <span className="text-primary">Active</span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs text-text-secondary">
                                            <span>Visibility</span>
                                            <span className="text-text-primary">Canvas + properties</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>
                </main>
            </div>
        </div>
    );
}
