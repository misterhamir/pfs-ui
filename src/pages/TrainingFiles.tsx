import { Header } from "../components/Header";
import { Search, ChevronDown, ListFilter, Upload, FileText, Trash2, Eye, RotateCcw } from "lucide-react";

const MOCK_TRAINING_FILES = [
    {
        id: "TF_001",
        name: "invoice_sample_001.pdf",
        type: "PDF",
        schema: "Invoice_Standard_v2",
        uploadDate: "2024-02-15",
        pages: 3,
        uploadedBy: "Jane Smith",
    },
    {
        id: "TF_002",
        name: "receipt_thermal_002.jpg",
        type: "Image",
        schema: "Receipt_Thermal_POS",
        uploadDate: "2024-02-14",
        pages: 1,
        uploadedBy: "John Doe",
    },
    {
        id: "TF_003",
        name: "bill_of_lading_intl.pdf",
        type: "PDF",
        schema: "Bill_of_Lading_Intl",
        uploadDate: "2024-02-13",
        pages: 5,
        uploadedBy: "Jane Smith",
    },
    {
        id: "TF_004",
        name: "medical_claim_form.pdf",
        type: "PDF",
        schema: "Medical_Claim_Form_CMS1500",
        uploadDate: "2024-02-12",
        pages: 2,
        uploadedBy: "Sarah Wilson",
    },
    {
        id: "TF_005",
        name: "bank_statement_jan.pdf",
        type: "PDF",
        schema: "Bank_Statement_Multi",
        uploadDate: "2024-02-11",
        pages: 4,
        uploadedBy: "Jane Smith",
    },
    {
        id: "TF_006",
        name: "passport_scan_001.jpg",
        type: "Image",
        schema: "ID_Passport_MRZ",
        uploadDate: "2024-02-10",
        pages: 1,
        uploadedBy: "Mike Johnson",
    },
];

export function TrainingFiles() {
    return (
        <div className="flex flex-col h-full bg-[#f9fafb]">
            <Header title="TRAINING FILES" />

            <div className="flex-1 p-8 overflow-y-auto">
                <div className="max-w-7xl mx-auto space-y-6">
                    {/* Top Bar Actions */}
                    <div className="flex items-center justify-between pb-4 border-b border-border/60">
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2 text-sm">
                                <span className="text-text-secondary font-medium text-xs uppercase tracking-wider">Filter By:</span>
                                <div className="flex items-center border border-border bg-white rounded flex-row gap-2 px-3 py-1.5 cursor-pointer hover:bg-surface">
                                    Schema: All <ChevronDown className="w-4 h-4 text-text-secondary" />
                                </div>
                                <div className="flex items-center border border-border bg-white rounded flex-row gap-2 px-3 py-1.5 cursor-pointer hover:bg-surface">
                                    Type: All <ChevronDown className="w-4 h-4 text-text-secondary" />
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-row items-center gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                                <input
                                    type="text"
                                    placeholder="Search files..."
                                    className="pl-9 pr-4 py-2 border border-border rounded w-64 text-sm focus:outline-none focus:ring-1 focus:ring-primary h-10"
                                />
                            </div>
                            <button className="bg-primary hover:bg-primary-hover text-white flex items-center gap-2 px-5 font-bold tracking-wide h-10 text-sm transition-colors rounded">
                                <Upload className="w-4 h-4" strokeWidth={3} /> UPLOAD FILES
                            </button>
                        </div>
                    </div>

                    {/* Sorting / Meta row */}
                    <div className="flex justify-between items-center text-sm text-text-secondary">
                        <div>Showing <span className="font-bold text-text-primary">1-6</span> of 42 training files</div>
                        <div className="flex items-center gap-1.5 cursor-pointer">
                            <ListFilter className="w-4 h-4" />
                            Sort: Upload Date
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-lg border border-border shadow-sm overflow-hidden">
                        <table className="min-w-full divide-y divide-border">
                            <thead className="bg-surface">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                                        <input type="checkbox" className="rounded border-border" />
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">File Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Associated Schema</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Pages</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Uploaded By</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Upload Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-border">
                                {MOCK_TRAINING_FILES.map((file) => (
                                    <tr key={file.id} className="hover:bg-surface/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <input type="checkbox" className="rounded border-border" />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <FileText className="w-4 h-4 text-text-secondary" />
                                                <span className="text-sm font-medium text-text-primary">{file.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-primary-light text-primary">
                                                {file.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                                            {file.schema}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                                            {file.pages}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                                            {file.uploadedBy}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                                            {file.uploadDate}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <button className="p-1.5 text-text-secondary hover:text-primary hover:bg-primary-light rounded transition-colors" title="Preview">
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button className="p-1.5 text-text-secondary hover:text-warning hover:bg-warning/10 rounded transition-colors" title="Retest Schema">
                                                    <RotateCcw className="w-4 h-4" />
                                                </button>
                                                <button className="p-1.5 text-text-secondary hover:text-error hover:bg-error/10 rounded transition-colors" title="Delete">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
