import { useState, useRef } from "react";
import { Header } from "../components/Header";
import {
    ArrowLeft,
    ArrowRight,
    Upload,
    FileText,
    Plus,
    Trash2,
    ChevronDown,
    Check,
    Loader2,
    Zap,
    Eye,
    X,
    MousePointer,
    Table,
    CheckSquare,
    PenTool,
    ZoomIn,
    ZoomOut,
    RotateCw,
    MapPin,
    Copy,
    ScanLine,
    Target,
} from "lucide-react";
import { Link } from "react-router-dom";

type Step = 1 | 2 | 3 | 4;

const DATA_TYPES = [
    { value: "string", label: "Text", color: "bg-green-100 text-green-700" },
    { value: "number", label: "Number", color: "bg-blue-100 text-blue-700" },
    { value: "date", label: "Date", color: "bg-orange-100 text-orange-700" },
    { value: "boolean", label: "Boolean", color: "bg-purple-100 text-purple-700" },
    { value: "array", label: "Array", color: "bg-teal-100 text-teal-700" },
    { value: "currency", label: "Currency", color: "bg-yellow-100 text-yellow-700" },
];

// Predefined document types
const PREDEFINED_DOCUMENT_TYPES = [
    "Invoice",
    "Receipt",
    "Purchase Order",
    "Bill of Lading",
    "Packing List",
    "Bank Statement",
    "Tax Form",
    "Contract",
    "ID Document",
    "Medical Record",
    "Insurance Claim",
    "Utility Bill",
];

interface SchemaField {
    id: string;
    name: string;
    type: string;
    required: boolean;
    description: string;
    confidence: number;
    boundingBox?: { x: number; y: number; width: number; height: number; page?: number };
    extractedValue?: string;
}

const GENERATED_FIELDS: SchemaField[] = [
    {
        id: "1",
        name: "vendor_name",
        type: "string",
        required: true,
        description: "Name of the vendor/supplier",
        confidence: 98,
        boundingBox: { x: 120, y: 85, width: 180, height: 24, page: 1 },
        extractedValue: "Acme Corporation"
    },
    {
        id: "2",
        name: "invoice_number",
        type: "string",
        required: true,
        description: "Unique invoice identifier",
        confidence: 99,
        boundingBox: { x: 380, y: 145, width: 140, height: 20, page: 1 },
        extractedValue: "INV-2024-00847"
    },
    {
        id: "3",
        name: "invoice_date",
        type: "date",
        required: true,
        description: "Date when invoice was issued",
        confidence: 95,
        boundingBox: { x: 120, y: 175, width: 120, height: 18, page: 1 },
        extractedValue: "February 16, 2024"
    },
    {
        id: "4",
        name: "due_date",
        type: "date",
        required: false,
        description: "Payment due date",
        confidence: 92,
        boundingBox: { x: 320, y: 175, width: 100, height: 18, page: 1 },
        extractedValue: "March 15, 2024"
    },
    {
        id: "5",
        name: "total_amount",
        type: "currency",
        required: true,
        description: "Total amount including tax",
        confidence: 97,
        boundingBox: { x: 380, y: 520, width: 90, height: 22, page: 1 },
        extractedValue: "$192.50"
    },
    {
        id: "6",
        name: "tax_amount",
        type: "currency",
        required: false,
        description: "Tax amount",
        confidence: 88,
        boundingBox: { x: 380, y: 490, width: 85, height: 20, page: 1 },
        extractedValue: "$17.50"
    },
    {
        id: "7",
        name: "line_items",
        type: "array",
        required: true,
        description: "List of purchased items",
        confidence: 85,
        boundingBox: { x: 80, y: 260, width: 420, height: 180, page: 1 },
        extractedValue: "Product A, Product B"
    },
];

export function CreateSchema() {
    const [currentStep, setCurrentStep] = useState<Step>(1);
    const [schemaType, setSchemaType] = useState<"new" | "update">("new");
    const [schemaName, setSchemaName] = useState("");
    const [version, setVersion] = useState("1.0");
    const [documentTypes, setDocumentTypes] = useState<string[]>([]);
    const [documentTypeInput, setDocumentTypeInput] = useState("");
    const [showDocumentTypeDropdown, setShowDocumentTypeDropdown] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [fields, setFields] = useState<SchemaField[]>([]);
    const [selectedField, setSelectedField] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const documentTypeRef = useRef<HTMLDivElement>(null);

    // Filter available document types (exclude already selected)
    const availableDocumentTypes = PREDEFINED_DOCUMENT_TYPES.filter(
        type => !documentTypes.includes(type) &&
        type.toLowerCase().includes(documentTypeInput.toLowerCase())
    );

    // Check if input matches a new custom type that can be added
    const canAddCustomType = documentTypeInput.trim() !== "" &&
        !PREDEFINED_DOCUMENT_TYPES.includes(documentTypeInput.trim()) &&
        !documentTypes.includes(documentTypeInput.trim());

    const addDocumentType = (type: string) => {
        const trimmedType = type.trim();
        if (trimmedType && !documentTypes.includes(trimmedType)) {
            setDocumentTypes([...documentTypes, trimmedType]);
        }
        setDocumentTypeInput("");
        setShowDocumentTypeDropdown(false);
    };

    const removeDocumentType = (type: string) => {
        setDocumentTypes(documentTypes.filter(t => t !== type));
    };

    const handleDocumentTypeKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (availableDocumentTypes.length > 0) {
                addDocumentType(availableDocumentTypes[0]);
            } else if (canAddCustomType) {
                addDocumentType(documentTypeInput);
            }
        } else if (e.key === "Backspace" && documentTypeInput === "" && documentTypes.length > 0) {
            removeDocumentType(documentTypes[documentTypes.length - 1]);
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setUploadedFiles([...uploadedFiles, ...Array.from(e.target.files)]);
        }
    };

    const removeFile = (index: number) => {
        setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
    };

    const processDocuments = () => {
        setIsProcessing(true);
        // Simulate AI processing
        setTimeout(() => {
            setFields(GENERATED_FIELDS);
            setIsProcessing(false);
            setCurrentStep(4);
        }, 3000);
    };

    const updateField = (id: string, updates: Partial<SchemaField>) => {
        setFields(fields.map(f => f.id === id ? { ...f, ...updates } : f));
    };

    const deleteField = (id: string) => {
        setFields(fields.filter(f => f.id !== id));
        if (selectedField === id) setSelectedField(null);
    };

    const addField = () => {
        const newField: SchemaField = {
            id: `field_${Date.now()}`,
            name: "new_field",
            type: "string",
            required: false,
            description: "",
            confidence: 0,
        };
        setFields([...fields, newField]);
        setSelectedField(newField.id);
    };

    const selectedFieldData = fields.find(f => f.id === selectedField);

    return (
        <div className="flex flex-col h-full bg-[#f9fafb]">
            <Header title="CREATE SCHEMA" />

            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Progress Steps */}
                <div className="bg-white border-b border-border px-6 py-4">
                    <div className="max-w-3xl mx-auto">
                        <div className="flex items-center justify-between">
                            {[
                                { step: 1, label: "Schema Info" },
                                { step: 2, label: "Upload Documents" },
                                { step: 3, label: "AI Processing" },
                                { step: 4, label: "Configure Fields" },
                            ].map((s, i) => (
                                <div key={s.step} className="flex items-center">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                                                currentStep > s.step
                                                    ? "bg-primary text-white"
                                                    : currentStep === s.step
                                                    ? "bg-primary text-white"
                                                    : "bg-surface text-text-secondary"
                                            }`}
                                        >
                                            {currentStep > s.step ? <Check className="w-4 h-4" /> : s.step}
                                        </div>
                                        <span
                                            className={`text-sm font-medium ${
                                                currentStep >= s.step ? "text-text-primary" : "text-text-secondary"
                                            }`}
                                        >
                                            {s.label}
                                        </span>
                                    </div>
                                    {i < 3 && (
                                        <div
                                            className={`w-16 h-0.5 mx-4 ${
                                                currentStep > s.step ? "bg-primary" : "bg-border"
                                            }`}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Step Content */}
                <div className="flex-1 overflow-y-auto">
                    {/* Step 1: Schema Info */}
                    {currentStep === 1 && (
                        <div className="p-8">
                            <div className="max-w-xl mx-auto space-y-8">
                                <div>
                                    <h2 className="text-xl font-bold text-text-primary mb-2">Define Your Schema</h2>
                                    <p className="text-text-secondary">Choose whether to create a new schema or update an existing one.</p>
                                </div>

                                {/* Schema Type Selection */}
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => setSchemaType("new")}
                                        className={`p-6 rounded-lg border-2 text-left transition-all ${
                                            schemaType === "new"
                                                ? "border-primary bg-primary-light"
                                                : "border-border bg-white hover:border-primary/50"
                                        }`}
                                    >
                                        <div className="flex items-center gap-3 mb-3">
                                            <div
                                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                                    schemaType === "new" ? "border-primary" : "border-border"
                                                }`}
                                            >
                                                {schemaType === "new" && (
                                                    <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                                                )}
                                            </div>
                                            <span className="font-bold text-text-primary">Create New Schema</span>
                                        </div>
                                        <p className="text-sm text-text-secondary pl-8">
                                            Start fresh with a new document schema
                                        </p>
                                    </button>

                                    <button
                                        onClick={() => setSchemaType("update")}
                                        className={`p-6 rounded-lg border-2 text-left transition-all ${
                                            schemaType === "update"
                                                ? "border-primary bg-primary-light"
                                                : "border-border bg-white hover:border-primary/50"
                                        }`}
                                    >
                                        <div className="flex items-center gap-3 mb-3">
                                            <div
                                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                                    schemaType === "update" ? "border-primary" : "border-border"
                                                }`}
                                            >
                                                {schemaType === "update" && (
                                                    <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                                                )}
                                            </div>
                                            <span className="font-bold text-text-primary">Update Existing</span>
                                        </div>
                                        <p className="text-sm text-text-secondary pl-8">
                                            Modify an existing schema with new fields
                                        </p>
                                    </button>
                                </div>

                                {/* Schema Name (only for new) */}
                                {schemaType === "new" && (
                                    <div>
                                        <label className="block text-sm font-medium text-text-primary mb-2">
                                            Schema Name
                                        </label>
                                        <input
                                            type="text"
                                            value={schemaName}
                                            onChange={(e) => setSchemaName(e.target.value)}
                                            placeholder="e.g., Invoice_Standard, Receipt_POS"
                                            className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                        />
                                        <p className="text-xs text-text-secondary mt-2">
                                            Use snake_case naming convention
                                        </p>
                                    </div>
                                )}

                                {/* Existing Schema Select (only for update) */}
                                {schemaType === "update" && (
                                    <div>
                                        <label className="block text-sm font-medium text-text-primary mb-2">
                                            Select Schema to Update
                                        </label>
                                        <div className="relative">
                                            <select
                                                value={schemaName}
                                                onChange={(e) => setSchemaName(e.target.value)}
                                                className="w-full px-4 py-3 border border-border rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
                                            >
                                                <option value="">Choose a schema...</option>
                                                <option value="Invoice_Standard_v2">Invoice_Standard_v2</option>
                                                <option value="Receipt_Thermal_POS">Receipt_Thermal_POS</option>
                                                <option value="Bill_of_Lading_Intl">Bill_of_Lading_Intl</option>
                                            </select>
                                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
                                        </div>
                                    </div>
                                )}

                                {/* Version */}
                                <div>
                                    <label className="block text-sm font-medium text-text-primary mb-2">
                                        Version
                                    </label>
                                    <input
                                        type="text"
                                        value={version}
                                        onChange={(e) => setVersion(e.target.value)}
                                        placeholder="e.g., 1.0, 2.1"
                                        className="w-48 px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                    />
                                </div>

                                {/* Document Type */}
                                <div>
                                    <label className="block text-sm font-medium text-text-primary mb-2">
                                        Document Type
                                    </label>
                                    <p className="text-xs text-text-secondary mb-2">
                                        Select one or more document types this schema applies to
                                    </p>
                                    <div
                                        ref={documentTypeRef}
                                        className="relative"
                                    >
                                        <div
                                            className={`min-h-[48px] px-3 py-2 border rounded-lg bg-white cursor-text transition-all ${
                                                showDocumentTypeDropdown
                                                    ? "border-primary ring-2 ring-primary/20"
                                                    : "border-border hover:border-primary/50"
                                            }`}
                                            onClick={() => setShowDocumentTypeDropdown(true)}
                                        >
                                            <div className="flex flex-wrap gap-2 items-center">
                                                {documentTypes.map((type) => (
                                                    <span
                                                        key={type}
                                                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary-light text-primary text-sm font-medium rounded-full"
                                                    >
                                                        {type}
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                removeDocumentType(type);
                                                            }}
                                                            className="ml-0.5 hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </span>
                                                ))}
                                                <input
                                                    type="text"
                                                    value={documentTypeInput}
                                                    onChange={(e) => {
                                                        setDocumentTypeInput(e.target.value);
                                                        setShowDocumentTypeDropdown(true);
                                                    }}
                                                    onKeyDown={handleDocumentTypeKeyDown}
                                                    onFocus={() => setShowDocumentTypeDropdown(true)}
                                                    placeholder={documentTypes.length === 0 ? "Type to search or add new..." : ""}
                                                    className="flex-1 min-w-[150px] outline-none text-sm bg-transparent"
                                                />
                                            </div>
                                        </div>

                                        {/* Dropdown */}
                                        {showDocumentTypeDropdown && (availableDocumentTypes.length > 0 || canAddCustomType) && (
                                            <div className="absolute z-10 w-full mt-1 bg-white border border-border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                                {availableDocumentTypes.map((type) => (
                                                    <button
                                                        key={type}
                                                        onClick={() => addDocumentType(type)}
                                                        className="w-full px-4 py-2.5 text-left text-sm hover:bg-primary-light hover:text-primary transition-colors flex items-center justify-between"
                                                    >
                                                        <span>{type}</span>
                                                        <Plus className="w-4 h-4 text-text-secondary" />
                                                    </button>
                                                ))}
                                                {canAddCustomType && (
                                                    <button
                                                        onClick={() => addDocumentType(documentTypeInput)}
                                                        className="w-full px-4 py-2.5 text-left text-sm bg-primary-light/50 hover:bg-primary-light text-primary font-medium transition-colors flex items-center gap-2 border-t border-border"
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                        Add "{documentTypeInput}" as new type
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    {documentTypes.length === 0 && (
                                        <p className="text-xs text-text-secondary mt-2">
                                            Press Enter or select from dropdown to add types
                                        </p>
                                    )}
                                </div>

                                {/* Navigation */}
                                <div className="flex justify-end pt-4">
                                    <button
                                        onClick={() => setCurrentStep(2)}
                                        disabled={!schemaName || documentTypes.length === 0}
                                        className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-hover disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-colors"
                                    >
                                        Continue <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Upload Documents */}
                    {currentStep === 2 && (
                        <div className="p-8">
                            <div className="max-w-2xl mx-auto space-y-8">
                                <div>
                                    <h2 className="text-xl font-bold text-text-primary mb-2">Upload Sample Documents</h2>
                                    <p className="text-text-secondary">
                                        Upload sample documents to train the AI. Supported formats: PDF, JPG, PNG.
                                    </p>
                                </div>

                                {/* Upload Area */}
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="border-2 border-dashed border-border rounded-lg p-12 text-center cursor-pointer hover:border-primary hover:bg-primary-light/30 transition-all"
                                >
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        multiple
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        onChange={handleFileUpload}
                                        className="hidden"
                                    />
                                    <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Upload className="w-8 h-8 text-primary" />
                                    </div>
                                    <p className="text-text-primary font-medium mb-1">
                                        Drag & drop files here, or click to browse
                                    </p>
                                    <p className="text-sm text-text-secondary">
                                        PDF, JPG, PNG up to 10MB each
                                    </p>
                                </div>

                                {/* Uploaded Files */}
                                {uploadedFiles.length > 0 && (
                                    <div className="space-y-3">
                                        <h3 className="font-medium text-text-primary">Uploaded Files ({uploadedFiles.length})</h3>
                                        <div className="space-y-2">
                                            {uploadedFiles.map((file, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center justify-between p-3 bg-white border border-border rounded-lg"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <FileText className="w-5 h-5 text-primary" />
                                                        <div>
                                                            <p className="text-sm font-medium text-text-primary">{file.name}</p>
                                                            <p className="text-xs text-text-secondary">
                                                                {(file.size / 1024).toFixed(1)} KB
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => removeFile(index)}
                                                        className="p-1.5 text-text-secondary hover:text-error hover:bg-error/10 rounded transition-colors"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Navigation */}
                                <div className="flex justify-between pt-4">
                                    <button
                                        onClick={() => setCurrentStep(1)}
                                        className="flex items-center gap-2 px-6 py-3 border border-border text-text-secondary hover:bg-surface font-medium rounded-lg transition-colors"
                                    >
                                        <ArrowLeft className="w-4 h-4" /> Back
                                    </button>
                                    <button
                                        onClick={processDocuments}
                                        disabled={uploadedFiles.length === 0}
                                        className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-hover disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-colors"
                                    >
                                        Process with AI <Zap className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Processing (Loading) */}
                    {currentStep === 3 && isProcessing && (
                        <div className="flex-1 flex items-center justify-center p-8">
                            <div className="text-center">
                                <div className="w-20 h-20 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Loader2 className="w-10 h-10 text-primary animate-spin" />
                                </div>
                                <h2 className="text-xl font-bold text-text-primary mb-2">AI is analyzing your documents...</h2>
                                <p className="text-text-secondary mb-6">This may take a few moments</p>
                                <div className="flex items-center justify-center gap-2 text-sm text-text-secondary">
                                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                                    <span>Detecting fields and patterns</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Configure Fields */}
                    {currentStep === 4 && (
                        <div className="flex-1 flex overflow-hidden">
                            {/* Left Sidebar - Defined Fields */}
                            <div className="w-72 border-r border-border bg-white flex flex-col">
                                <div className="p-4 border-b border-border">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Search fields..."
                                            className="w-full pl-9 pr-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                        />
                                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                </div>

                                <div className="flex-1 overflow-y-auto p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Defined Fields</span>
                                        <button
                                            onClick={addField}
                                            className="p-1 text-primary hover:bg-primary-light rounded transition-colors"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="space-y-2">
                                        {fields.map((field) => {
                                            const typeInfo = DATA_TYPES.find(t => t.value === field.type);
                                            return (
                                                <div
                                                    key={field.id}
                                                    onClick={() => setSelectedField(field.id)}
                                                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                                                        selectedField === field.id
                                                            ? "border-primary bg-primary-light"
                                                            : "border-border hover:border-primary/50"
                                                    }`}
                                                >
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="text-sm font-medium text-text-primary">{field.name}</span>
                                                        <span className={`text-xs px-1.5 py-0.5 rounded ${typeInfo?.color}`}>
                                                            {typeInfo?.label}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs text-text-secondary">
                                                        {field.required && <span className="text-primary">Required</span>}
                                                        {field.confidence > 0 && (
                                                            <span className={field.confidence >= 90 ? "text-primary" : "text-warning"}>
                                                                {field.confidence}% confidence
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Tool Palette */}
                                <div className="p-4 border-t border-border">
                                    <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3 block">Field Types</span>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button className="flex flex-col items-center gap-1 p-3 border border-border rounded-lg hover:border-primary hover:bg-primary-light/30 transition-all">
                                            <MousePointer className="w-5 h-5 text-text-secondary" />
                                            <span className="text-xs text-text-secondary">Text</span>
                                        </button>
                                        <button className="flex flex-col items-center gap-1 p-3 border border-border rounded-lg hover:border-primary hover:bg-primary-light/30 transition-all">
                                            <Table className="w-5 h-5 text-text-secondary" />
                                            <span className="text-xs text-text-secondary">Table</span>
                                        </button>
                                        <button className="flex flex-col items-center gap-1 p-3 border border-border rounded-lg hover:border-primary hover:bg-primary-light/30 transition-all">
                                            <CheckSquare className="w-5 h-5 text-text-secondary" />
                                            <span className="text-xs text-text-secondary">Checkbox</span>
                                        </button>
                                        <button className="flex flex-col items-center gap-1 p-3 border border-border rounded-lg hover:border-primary hover:bg-primary-light/30 transition-all">
                                            <PenTool className="w-5 h-5 text-text-secondary" />
                                            <span className="text-xs text-text-secondary">Signature</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Center - Document Preview */}
                            <div className="flex-1 bg-[#f0f0f0] p-6 overflow-y-auto">
                                <div className="bg-white rounded-lg shadow-lg max-w-2xl mx-auto">
                                    {/* Document Header */}
                                    <div className="flex items-center justify-between p-3 border-b border-border">
                                        <div className="flex items-center gap-2">
                                            <FileText className="w-4 h-4 text-primary" />
                                            <span className="text-sm font-medium text-text-primary">sample_invoice.pdf</span>
                                            <span className="text-xs text-text-secondary">Page 1 of 1</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <button className="p-1.5 text-text-secondary hover:text-text-primary hover:bg-surface rounded">
                                                <ZoomOut className="w-4 h-4" />
                                            </button>
                                            <span className="text-xs text-text-secondary px-2">100%</span>
                                            <button className="p-1.5 text-text-secondary hover:text-text-primary hover:bg-surface rounded">
                                                <ZoomIn className="w-4 h-4" />
                                            </button>
                                            <button className="p-1.5 text-text-secondary hover:text-text-primary hover:bg-surface rounded">
                                                <RotateCw className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* AI Detection Banner */}
                                    <div className="bg-primary-light px-4 py-2 flex items-center gap-2">
                                        <Zap className="w-4 h-4 text-primary" />
                                        <span className="text-sm text-primary font-medium">AI Detection Active</span>
                                        <span className="text-sm text-text-secondary">- Click on document regions to map fields</span>
                                    </div>

                                    {/* Document Content (Mock) */}
                                    <div className="p-8 min-h-[500px] relative">
                                        {/* Simulated invoice content with field highlights */}
                                        <div className="space-y-6">
                                            <div className="text-center">
                                                <h1 className="text-2xl font-bold text-text-primary">INVOICE</h1>
                                            </div>

                                            <div className="flex justify-between">
                                                <div
                                                    className={`p-3 rounded border-2 transition-all cursor-pointer ${
                                                        selectedField === "1" ? "border-primary bg-primary-light" : "border-transparent hover:border-primary/30"
                                                    }`}
                                                    onClick={() => setSelectedField("1")}
                                                >
                                                    <p className="text-sm text-text-secondary">From:</p>
                                                    <p className="font-bold text-text-primary">Acme Corporation</p>
                                                    <p className="text-sm text-text-secondary">123 Business St</p>
                                                </div>
                                                <div
                                                    className={`p-3 rounded border-2 transition-all cursor-pointer ${
                                                        selectedField === "2" ? "border-primary bg-primary-light" : "border-transparent hover:border-primary/30"
                                                    }`}
                                                    onClick={() => setSelectedField("2")}
                                                >
                                                    <p className="text-sm text-text-secondary">Invoice #:</p>
                                                    <p className="font-bold text-text-primary">INV-2024-00847</p>
                                                </div>
                                            </div>

                                            <div className="flex justify-between">
                                                <div
                                                    className={`p-3 rounded border-2 transition-all cursor-pointer ${
                                                        selectedField === "3" ? "border-primary bg-primary-light" : "border-transparent hover:border-primary/30"
                                                    }`}
                                                    onClick={() => setSelectedField("3")}
                                                >
                                                    <p className="text-sm text-text-secondary">Date:</p>
                                                    <p className="font-bold text-text-primary">February 15, 2024</p>
                                                </div>
                                                <div
                                                    className={`p-3 rounded border-2 transition-all cursor-pointer ${
                                                        selectedField === "4" ? "border-primary bg-primary-light" : "border-transparent hover:border-primary/30"
                                                    }`}
                                                    onClick={() => setSelectedField("4")}
                                                >
                                                    <p className="text-sm text-text-secondary">Due Date:</p>
                                                    <p className="font-bold text-text-primary">March 15, 2024</p>
                                                </div>
                                            </div>

                                            {/* Line Items Table */}
                                            <div
                                                className={`border-2 rounded transition-all cursor-pointer ${
                                                    selectedField === "7" ? "border-primary bg-primary-light" : "border-transparent hover:border-primary/30"
                                                }`}
                                                onClick={() => setSelectedField("7")}
                                            >
                                                <table className="w-full text-sm">
                                                    <thead className="bg-surface">
                                                        <tr>
                                                            <th className="p-2 text-left">Description</th>
                                                            <th className="p-2 text-right">Qty</th>
                                                            <th className="p-2 text-right">Price</th>
                                                            <th className="p-2 text-right">Total</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td className="p-2">Product A</td>
                                                            <td className="p-2 text-right">2</td>
                                                            <td className="p-2 text-right">$50.00</td>
                                                            <td className="p-2 text-right">$100.00</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="p-2">Product B</td>
                                                            <td className="p-2 text-right">1</td>
                                                            <td className="p-2 text-right">$75.00</td>
                                                            <td className="p-2 text-right">$75.00</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>

                                            <div className="flex justify-end">
                                                <div className="w-48 space-y-2">
                                                    <div className="flex justify-between">
                                                        <span className="text-text-secondary">Subtotal:</span>
                                                        <span>$175.00</span>
                                                    </div>
                                                    <div
                                                        className={`flex justify-between p-1 rounded border-2 transition-all cursor-pointer ${
                                                            selectedField === "6" ? "border-primary bg-primary-light" : "border-transparent hover:border-primary/30"
                                                        }`}
                                                        onClick={() => setSelectedField("6")}
                                                    >
                                                        <span className="text-text-secondary">Tax:</span>
                                                        <span>$17.50</span>
                                                    </div>
                                                    <div
                                                        className={`flex justify-between font-bold text-lg p-1 rounded border-2 transition-all cursor-pointer ${
                                                            selectedField === "5" ? "border-primary bg-primary-light" : "border-transparent hover:border-primary/30"
                                                        }`}
                                                        onClick={() => setSelectedField("5")}
                                                    >
                                                        <span>Total:</span>
                                                        <span>$192.50</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Panel - Properties */}
                            <div className="w-80 border-l border-border bg-white overflow-y-auto">
                                {selectedFieldData ? (
                                    <div className="p-4 space-y-6">
                                        <div>
                                            <h3 className="font-bold text-text-primary mb-1">{selectedFieldData.name}</h3>
                                            <p className="text-xs text-text-secondary">Field ID: {selectedFieldData.id}</p>
                                        </div>

                                        {/* Properties Section */}
                                        <div className="space-y-4">
                                            <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Properties</h4>

                                            <div>
                                                <label className="block text-sm font-medium text-text-primary mb-1">Field Name</label>
                                                <input
                                                    type="text"
                                                    value={selectedFieldData.name}
                                                    onChange={(e) => updateField(selectedFieldData.id, { name: e.target.value })}
                                                    className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-text-primary mb-1">Data Type</label>
                                                <div className="relative">
                                                    <select
                                                        value={selectedFieldData.type}
                                                        onChange={(e) => updateField(selectedFieldData.id, { type: e.target.value })}
                                                        className="w-full px-3 py-2 border border-border rounded-lg text-sm appearance-none focus:outline-none focus:ring-1 focus:ring-primary"
                                                    >
                                                        {DATA_TYPES.map(type => (
                                                            <option key={type.value} value={type.value}>{type.label}</option>
                                                        ))}
                                                    </select>
                                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-text-primary mb-1">Description</label>
                                                <textarea
                                                    value={selectedFieldData.description}
                                                    onChange={(e) => updateField(selectedFieldData.id, { description: e.target.value })}
                                                    rows={2}
                                                    className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                                                />
                                            </div>
                                        </div>

                                        {/* Position Info Section */}
                                        {selectedFieldData.boundingBox && (
                                            <div className="space-y-4">
                                                <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Position Info</h4>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div className="p-3 bg-surface rounded-lg">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <MapPin className="w-3.5 h-3.5 text-primary" />
                                                            <span className="text-xs text-text-secondary">X Position</span>
                                                        </div>
                                                        <p className="text-lg font-semibold text-text-primary">{selectedFieldData.boundingBox.x}px</p>
                                                    </div>
                                                    <div className="p-3 bg-surface rounded-lg">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <MapPin className="w-3.5 h-3.5 text-primary" />
                                                            <span className="text-xs text-text-secondary">Y Position</span>
                                                        </div>
                                                        <p className="text-lg font-semibold text-text-primary">{selectedFieldData.boundingBox.y}px</p>
                                                    </div>
                                                    <div className="p-3 bg-surface rounded-lg">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <ScanLine className="w-3.5 h-3.5 text-primary" />
                                                            <span className="text-xs text-text-secondary">Width</span>
                                                        </div>
                                                        <p className="text-lg font-semibold text-text-primary">{selectedFieldData.boundingBox.width}px</p>
                                                    </div>
                                                    <div className="p-3 bg-surface rounded-lg">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <ScanLine className="w-3.5 h-3.5 text-primary" />
                                                            <span className="text-xs text-text-secondary">Height</span>
                                                        </div>
                                                        <p className="text-lg font-semibold text-text-primary">{selectedFieldData.boundingBox.height}px</p>
                                                    </div>
                                                </div>
                                                {selectedFieldData.boundingBox.page && (
                                                    <div className="flex items-center gap-2 px-3 py-2 bg-primary-light/30 rounded-lg">
                                                        <FileText className="w-4 h-4 text-primary" />
                                                        <span className="text-sm text-text-primary">Page {selectedFieldData.boundingBox.page} of 1</span>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Extracted Data Section */}
                                        {selectedFieldData.extractedValue && (
                                            <div className="space-y-4">
                                                <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Extracted Data</h4>
                                                <div className="p-4 bg-surface rounded-lg border-2 border-dashed border-primary/30">
                                                    <div className="flex items-start justify-between gap-2 mb-2">
                                                        <span className="text-xs text-text-secondary">Value at position</span>
                                                        <button
                                                            onClick={() => navigator.clipboard.writeText(selectedFieldData.extractedValue || "")}
                                                            className="p-1 text-text-secondary hover:text-primary hover:bg-primary-light/20 rounded transition-colors"
                                                            title="Copy value"
                                                        >
                                                            <Copy className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                    <p className="text-base font-semibold text-text-primary break-all">
                                                        {selectedFieldData.extractedValue}
                                                    </p>
                                                    <div className="mt-2 flex items-center gap-1.5">
                                                        <Target className="w-3 h-3 text-primary" />
                                                        <span className="text-xs text-text-secondary">
                                                            Mapped from X:{selectedFieldData.boundingBox?.x}, Y:{selectedFieldData.boundingBox?.y}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Validation Section */}
                                        <div className="space-y-4">
                                            <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Validation</h4>

                                            <label className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedFieldData.required}
                                                    onChange={(e) => updateField(selectedFieldData.id, { required: e.target.checked })}
                                                    className="rounded border-border text-primary focus:ring-primary"
                                                />
                                                <span className="text-sm text-text-primary">Required field</span>
                                            </label>

                                            {selectedFieldData.confidence > 0 && (
                                                <div>
                                                    <label className="block text-sm font-medium text-text-primary mb-1">
                                                        Confidence Threshold
                                                    </label>
                                                    <div className="flex items-center gap-3">
                                                        <input
                                                            type="range"
                                                            min="0"
                                                            max="100"
                                                            value={selectedFieldData.confidence}
                                                            className="flex-1 accent-primary"
                                                            readOnly
                                                        />
                                                        <span className={`text-sm font-medium ${
                                                            selectedFieldData.confidence >= 90 ? "text-primary" : "text-warning"
                                                        }`}>
                                                            {selectedFieldData.confidence}%
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div className="pt-4 border-t border-border space-y-2">
                                            <button
                                                onClick={() => deleteField(selectedFieldData.id)}
                                                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-error border border-error/30 rounded-lg hover:bg-error/10 transition-colors text-sm"
                                            >
                                                <Trash2 className="w-4 h-4" /> Delete Field
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-4 text-center text-text-secondary">
                                        <Eye className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                        <p className="text-sm">Select a field to view properties</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions (only for step 4) */}
                {currentStep === 4 && (
                    <div className="bg-white border-t border-border px-6 py-4">
                        <div className="flex items-center justify-between max-w-7xl mx-auto">
                            <Link
                                to="/schemas"
                                className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" /> Cancel
                            </Link>
                            <div className="flex items-center gap-3">
                                <button className="px-4 py-2 text-text-secondary border border-border rounded-lg hover:bg-surface transition-colors font-medium">
                                    Save as Draft
                                </button>
                                <button className="flex items-center gap-2 px-6 py-2 bg-primary hover:bg-primary-hover text-white font-bold rounded-lg transition-colors">
                                    <Check className="w-4 h-4" /> Deploy Schema
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
