import { Search, ChevronDown, ListFilter, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { SchemaCard } from "../components/SchemaCard";
import { Header } from "../components/Header";

const MOCK_SCHEMAS = [
    {
        name: "Invoice_Standard_v2",
        id: "SCH_8829_F",
        fields: ["Invoice #", "Date", "Total Amount", "Vendor Name", "Line Items (Table)"],
        version: "v2.4",
        isActive: true,
    },
    {
        name: "Receipt_Thermal_POS",
        id: "SCH_1021_R",
        fields: ["Transaction Time", "Tax ID", "Subtotal"],
        version: "v1.0",
        isActive: false,
    },
    {
        name: "Bill_of_Lading_Intl",
        id: "SCH_5592_L",
        fields: ["Carrier Name", "Gross Weight", "Signatory", "Port of Loading", "Consignee"],
        version: "v3.4",
        isActive: true,
    },
    {
        name: "Medical_Claim_Form_CMS1500",
        id: "SCH_3310_M",
        fields: ["Patient Name", "Policy Number", "Diagnosis Code", "Service Date"],
        version: "v1.8",
        isActive: true,
    },
    {
        name: "Bank_Statement_Multi",
        id: "SCH_0092_B",
        fields: ["Account Holder", "Opening Bal", "Closing Bal", "Transaction List"],
        version: "v0.9 (Beta)",
        isActive: false,
    },
    {
        name: "ID_Passport_MRZ",
        id: "SCH_9110_I",
        fields: ["Surname", "Given Names", "Passport No", "Nationality", "DOB"],
        version: "v4.0",
        isActive: true,
    }
];

export function SchemaLibrary() {
    return (
        <div className="flex flex-col h-full bg-[#f9fafb]">
            <Header title="SCHEMA LIBRARY" />

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
                                    Type: Finance <ChevronDown className="w-4 h-4 text-text-secondary" />
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-row items-center gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                                <input
                                    type="text"
                                    placeholder="Search models..."
                                    className="pl-9 pr-4 py-2 border border-border rounded w-64 text-sm focus:outline-none focus:ring-1 focus:ring-primary h-10"
                                />
                            </div>
                            <Link to="/schemas/new" className="bg-primary hover:bg-primary-hover text-white flex items-center gap-2 px-5 font-bold tracking-wide h-10 text-sm transition-colors rounded">
                                <Plus className="w-4 h-4" strokeWidth={3} /> CREATE NEW SCHEMA
                            </Link>
                        </div>
                    </div>

                    {/* Sorting / Meta row */}
                    <div className="flex justify-between items-center text-sm text-text-secondary">
                        <div>Showing <span className="font-bold text-text-primary">1-6</span> of 24 schemas</div>
                        <div className="flex items-center gap-1.5 cursor-pointer">
                            <ListFilter className="w-4 h-4" />
                            Sort: Last Modified
                        </div>
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
                        {MOCK_SCHEMAS.map(schema => (
                            <SchemaCard
                                key={schema.id}
                                {...schema}
                            />
                        ))}
                    </div>

                </div>
            </div>
        </div>
    );
}
