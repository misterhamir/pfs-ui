import { Header } from "../components/Header";
import { Rocket, FileText, Network, CheckCircle, Clock, AlertCircle, ArrowUpRight, ChevronDown } from "lucide-react";
import { Switch } from "../components/Switch";

const DEPLOYED_SCHEMAS = [
    {
        id: "SCH_8829_F",
        name: "Invoice_Standard_v2",
        version: "v2.4",
        deployedAt: "2024-01-15 10:30",
        status: "Active",
        documentsProcessed: 8429,
        accuracy: 98.2,
    },
    {
        id: "SCH_5592_L",
        name: "Bill_of_Lading_Intl",
        version: "v3.4",
        deployedAt: "2024-01-20 14:15",
        status: "Active",
        documentsProcessed: 2156,
        accuracy: 96.8,
    },
    {
        id: "SCH_3310_M",
        name: "Medical_Claim_Form_CMS1500",
        version: "v1.8",
        deployedAt: "2024-02-01 09:00",
        status: "Active",
        documentsProcessed: 1834,
        accuracy: 97.5,
    },
    {
        id: "SCH_9110_I",
        name: "ID_Passport_MRZ",
        version: "v4.0",
        deployedAt: "2024-02-05 16:45",
        status: "Active",
        documentsProcessed: 673,
        accuracy: 99.1,
    },
];

const DEPLOYED_WORKFLOWS = [
    {
        id: "WF_001",
        name: "Invoice Processing Pipeline",
        deployedAt: "2024-01-15 11:00",
        status: "Active",
        runsCompleted: 4521,
        avgProcessingTime: "2.3s",
    },
    {
        id: "WF_002",
        name: "Receipt Reconciliation",
        deployedAt: "2024-01-20 15:30",
        status: "Active",
        runsCompleted: 1892,
        avgProcessingTime: "1.8s",
    },
    {
        id: "WF_004",
        name: "Medical Claims Processing",
        deployedAt: "2024-02-01 10:00",
        status: "Active",
        runsCompleted: 987,
        avgProcessingTime: "4.1s",
    },
];

const DEPLOYMENT_HISTORY = [
    {
        id: "DEP_001",
        type: "Schema",
        name: "Invoice_Standard_v2",
        version: "v2.4",
        action: "Deployed",
        timestamp: "2024-02-10 14:32",
        user: "Jane Smith",
    },
    {
        id: "DEP_002",
        type: "Workflow",
        name: "Medical Claims Processing",
        version: "-",
        action: "Deployed",
        timestamp: "2024-02-01 10:00",
        user: "Jane Smith",
    },
    {
        id: "DEP_003",
        type: "Schema",
        name: "ID_Passport_MRZ",
        version: "v4.0",
        action: "Deployed",
        timestamp: "2024-02-05 16:45",
        user: "John Doe",
    },
    {
        id: "DEP_004",
        type: "Schema",
        name: "Receipt_Thermal_POS",
        version: "v1.0",
        action: "Undeployed",
        timestamp: "2024-01-28 09:15",
        user: "Jane Smith",
    },
    {
        id: "DEP_005",
        type: "Workflow",
        name: "Invoice Processing Pipeline",
        version: "-",
        action: "Updated",
        timestamp: "2024-01-25 11:20",
        user: "Jane Smith",
    },
];

export function Deployments() {
    return (
        <div className="flex flex-col h-full bg-[#f9fafb]">
            <Header title="DEPLOYMENTS" />

            <div className="flex-1 p-8 overflow-y-auto">
                <div className="max-w-7xl mx-auto space-y-8">
                    {/* Stats Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-white p-5 rounded-lg border border-border shadow-sm flex items-center gap-4">
                            <div className="p-3 bg-primary-light text-primary rounded-lg">
                                <FileText className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-text-primary">4</p>
                                <p className="text-xs text-text-secondary uppercase tracking-widest">Active Schemas</p>
                            </div>
                        </div>
                        <div className="bg-white p-5 rounded-lg border border-border shadow-sm flex items-center gap-4">
                            <div className="p-3 bg-primary-light text-primary rounded-lg">
                                <Network className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-text-primary">3</p>
                                <p className="text-xs text-text-secondary uppercase tracking-widest">Active Workflows</p>
                            </div>
                        </div>
                        <div className="bg-white p-5 rounded-lg border border-border shadow-sm flex items-center gap-4">
                            <div className="p-3 bg-primary-light text-primary rounded-lg">
                                <Rocket className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-text-primary">13,092</p>
                                <p className="text-xs text-text-secondary uppercase tracking-widest">Total Processed</p>
                            </div>
                        </div>
                        <div className="bg-white p-5 rounded-lg border border-border shadow-sm flex items-center gap-4">
                            <div className="p-3 bg-primary-light text-primary rounded-lg">
                                <CheckCircle className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-text-primary">97.9%</p>
                                <p className="text-xs text-text-secondary uppercase tracking-widest">Avg Accuracy</p>
                            </div>
                        </div>
                    </div>

                    {/* Deployed Schemas Section */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-text-primary">Deployed Schemas</h2>
                            <div className="flex items-center border border-border bg-white rounded flex-row gap-2 px-3 py-1.5 cursor-pointer hover:bg-surface text-sm">
                                Sort: Name <ChevronDown className="w-4 h-4 text-text-secondary" />
                            </div>
                        </div>
                        <div className="bg-white rounded-lg border border-border shadow-sm overflow-hidden">
                            <table className="min-w-full divide-y divide-border">
                                <thead className="bg-surface">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Schema Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Version</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Deployed At</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Docs Processed</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Accuracy</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-border">
                                    {DEPLOYED_SCHEMAS.map((schema) => (
                                        <tr key={schema.id} className="hover:bg-surface/50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <FileText className="w-4 h-4 text-text-secondary" />
                                                    <span className="text-sm font-medium text-text-primary">{schema.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary font-mono">
                                                {schema.version}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                                                {schema.deployedAt}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary font-medium">
                                                {schema.documentsProcessed.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-primary-light text-primary">
                                                    {schema.accuracy}%
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] uppercase font-bold tracking-wider text-primary">ACTIVE</span>
                                                    <Switch checked={true} />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Deployed Workflows Section */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-text-primary">Deployed Workflows</h2>
                        </div>
                        <div className="bg-white rounded-lg border border-border shadow-sm overflow-hidden">
                            <table className="min-w-full divide-y divide-border">
                                <thead className="bg-surface">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Workflow Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Deployed At</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Runs Completed</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Avg Processing</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-border">
                                    {DEPLOYED_WORKFLOWS.map((workflow) => (
                                        <tr key={workflow.id} className="hover:bg-surface/50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <Network className="w-4 h-4 text-text-secondary" />
                                                    <span className="text-sm font-medium text-text-primary">{workflow.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                                                {workflow.deployedAt}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary font-medium">
                                                {workflow.runsCompleted.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-700">
                                                    {workflow.avgProcessingTime}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] uppercase font-bold tracking-wider text-primary">ACTIVE</span>
                                                    <Switch checked={true} />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Deployment History */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-text-primary">Deployment History</h2>
                            <button className="text-sm text-primary font-medium hover:underline flex items-center gap-1">
                                View All <ArrowUpRight className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="bg-white rounded-lg border border-border shadow-sm overflow-hidden">
                            <table className="min-w-full divide-y divide-border">
                                <thead className="bg-surface">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Type</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Action</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Timestamp</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">User</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-border">
                                    {DEPLOYMENT_HISTORY.map((entry) => (
                                        <tr key={entry.id} className="hover:bg-surface/50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                                                    entry.type === 'Schema' ? 'bg-primary-light text-primary' : 'bg-blue-100 text-blue-700'
                                                }`}>
                                                    {entry.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-primary">
                                                {entry.name}
                                                {entry.version !== '-' && <span className="text-text-secondary font-normal ml-2">({entry.version})</span>}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                                                    entry.action === 'Deployed' ? 'bg-primary-light text-primary' :
                                                    entry.action === 'Undeployed' ? 'bg-gray-100 text-gray-600' :
                                                    'bg-blue-100 text-blue-700'
                                                }`}>
                                                    {entry.action === 'Deployed' && <CheckCircle className="w-3 h-3" />}
                                                    {entry.action === 'Undeployed' && <AlertCircle className="w-3 h-3" />}
                                                    {entry.action === 'Updated' && <Clock className="w-3 h-3" />}
                                                    {entry.action}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                                                {entry.timestamp}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                                                {entry.user}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
