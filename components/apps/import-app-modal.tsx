"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UploadCloud, FileText, FileSpreadsheet, AlertCircle, Download, Table } from "lucide-react";
import { fetchFromApi } from "@/lib/api";

interface ImportAppModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

const CSV_TEMPLATE_HEADERS = ["App Name", "Category", "Cost Per User", "Monthly Cost", "Billing Cycle", "Renewal Date"];
const CSV_TEMPLATE_EXAMPLE = [
    ["Slack", "Communication", "7.25", "", "monthly", "2025-12-31"],
    ["Salesforce", "CRM", "", "1500", "annual", "2026-06-30"],
    ["Zoom", "Communication", "14.99", "", "monthly", ""],
];

const CATEGORY_OPTIONS = ["Communication", "CRM", "Storage", "Productivity", "Analytics", "HR", "Security", "Finance", "Other"];

function downloadCsvTemplate() {
    const rows = [
        CSV_TEMPLATE_HEADERS,
        ...CSV_TEMPLATE_EXAMPLE,
    ];
    const csvContent = rows.map(r => r.map(v => `"${v}"`).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "yusrflow-apps-template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

function getFileInfo(fileName: string) {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') return { icon: <FileText className="h-6 w-6" />, className: 'bg-red-100 text-red-600' };
    if (ext === 'xlsx' || ext === 'xls') return { icon: <FileSpreadsheet className="h-6 w-6" />, className: 'bg-emerald-100 text-emerald-600' };
    return { icon: <FileSpreadsheet className="h-6 w-6" />, className: 'bg-green-100 text-green-600' };
}

export function ImportAppModal({ open, onOpenChange, onSuccess }: ImportAppModalProps) {
    const [isHovering, setIsHovering] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsHovering(true);
    };

    const handleDragLeave = () => {
        setIsHovering(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsHovering(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFileSelected(e.dataTransfer.files[0]);
        }
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            handleFileSelected(e.target.files[0]);
        }
    };

    const handleFileSelected = (selectedFile: File) => {
        const ext = selectedFile.name.split('.').pop()?.toLowerCase();
        if (ext !== 'csv' && ext !== 'pdf' && ext !== 'xlsx' && ext !== 'xls') {
            alert("Invalid file type. Please upload a CSV, Excel (.xlsx / .xls), or PDF file.");
            return;
        }
        setFile(selectedFile);
    };

    const clearFile = () => setFile(null);

    const handleUpload = async () => {
        if (!file) return;
        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        try {
            const response = await fetchFromApi('/tenants/apps/import', {
                method: 'POST',
                body: formData,
            });
            alert(`Import Successful: ${response?.message || "Applications imported successfully."}`);
            onSuccess();
            onOpenChange(false);
            setTimeout(() => setFile(null), 300);
        } catch (error: any) {
            alert(`Import Failed: ${error.message || "Failed to import applications. Please try again."}`);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(val) => {
            if (!val && !isUploading) {
                onOpenChange(val);
                setTimeout(() => setFile(null), 300);
            }
        }}>
            <DialogContent className="sm:max-w-[560px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Import Applications</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col space-y-5 py-2">
                    <p className="text-sm text-muted-foreground">
                        Upload a CSV or Excel spreadsheet to bulk-import your SaaS applications. Use the template below to ensure your file matches the required format.
                    </p>

                    {/* Format Guide + Template Download */}
                    <div className="rounded-lg border border-border bg-muted/40 p-4">
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-3 flex-1 min-w-0">
                                <div className="p-2 bg-primary/10 rounded-md text-primary mt-0.5 shrink-0">
                                    <Table className="h-4 w-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold">Required Spreadsheet Format</p>
                                    <p className="text-xs text-muted-foreground mt-0.5 mb-2">
                                        Your file must use these exact column headers (row 1):
                                    </p>
                                    <div className="flex flex-wrap gap-1.5 mb-3">
                                        {CSV_TEMPLATE_HEADERS.map(h => (
                                            <code key={h} className="text-xs bg-background border border-border rounded px-1.5 py-0.5 font-mono">
                                                {h}
                                            </code>
                                        ))}
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="text-xs text-muted-foreground">
                                            • <strong>App Name</strong> — <span className="text-destructive font-medium">required</span>. The application name.
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            • <strong>Category</strong> — e.g. {CATEGORY_OPTIONS.slice(0, 4).join(', ')}, …
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            • <strong>Cost Per User</strong> — per-seat monthly cost (number). Use this <em>or</em> Monthly Cost.
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            • <strong>Monthly Cost</strong> — flat monthly total (number). Use this <em>or</em> Cost Per User.
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            • <strong>Billing Cycle</strong> —{" "}
                                            <code className="font-mono text-xs">monthly</code> or{" "}
                                            <code className="font-mono text-xs">annual</code>.
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            • <strong>Renewal Date</strong> — format{" "}
                                            <code className="font-mono text-xs">YYYY-MM-DD</code> (optional).
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                className="shrink-0 gap-1.5 whitespace-nowrap"
                                onClick={downloadCsvTemplate}
                            >
                                <Download className="h-3.5 w-3.5" />
                                Download Template
                            </Button>
                        </div>
                    </div>

                    {/* Drop Zone or File Preview */}
                    {!file ? (
                        <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center transition-colors cursor-pointer ${
                                isHovering
                                    ? "border-primary bg-primary/5"
                                    : "border-slate-300 dark:border-slate-700 hover:border-primary/50 hover:bg-slate-50 dark:hover:bg-muted/30"
                            }`}
                        >
                            <input
                                type="file"
                                accept=".csv,.xlsx,.xls,.pdf"
                                className="hidden"
                                id="file-upload"
                                onChange={handleFileInput}
                            />
                            <label htmlFor="file-upload" className="flex flex-col items-center justify-center cursor-pointer w-full h-full">
                                <div className="p-4 bg-primary/10 text-primary rounded-full mb-3">
                                    <UploadCloud className="h-7 w-7" />
                                </div>
                                <h3 className="font-semibold text-base mb-1">Drag and drop your file</h3>
                                <p className="text-sm text-muted-foreground text-center mb-4">
                                    Supports CSV, Excel (.xlsx / .xls), and PDF
                                </p>
                                <Button type="button" variant="outline" size="sm" className="pointer-events-none">
                                    Select File
                                </Button>
                            </label>
                        </div>
                    ) : (
                        <div className="border border-slate-200 dark:border-border rounded-lg p-4 flex flex-col space-y-4">
                            <div className="flex items-center space-x-4">
                                <div className={`p-3 rounded-full flex-shrink-0 ${getFileInfo(file.name).className}`}>
                                    {getFileInfo(file.name).icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-sm truncate">{file.name}</p>
                                    <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                                </div>
                                {!isUploading && (
                                    <Button variant="ghost" size="sm" onClick={clearFile} className="text-muted-foreground hover:text-red-500">
                                        Remove
                                    </Button>
                                )}
                            </div>

                            <div className="bg-blue-50 dark:bg-blue-950/30 text-blue-800 dark:text-blue-300 text-sm p-3 rounded-md flex items-start space-x-2">
                                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                <p>
                                    {file.name.endsWith('.pdf')
                                        ? "PDF imports will attempt to extract the app name. Costs may need manual review after import."
                                        : "Ensure your spreadsheet uses the required column headers shown above. Extra columns are safely ignored."}
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end space-x-3 pt-2 border-t">
                        <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isUploading}>
                            Cancel
                        </Button>
                        <Button onClick={handleUpload} disabled={!file || isUploading}>
                            {isUploading ? "Importing..." : "Start Import"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
