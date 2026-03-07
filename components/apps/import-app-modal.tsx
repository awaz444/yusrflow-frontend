"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UploadCloud, FileText, FileSpreadsheet, AlertCircle } from "lucide-react";
import { fetchFromApi } from "@/lib/api";

interface ImportAppModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
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
        if (ext !== 'csv' && ext !== 'pdf') {
            alert("Invalid file type. Please upload a CSV or PDF file.");
            return;
        }
        setFile(selectedFile);
    };

    const clearFile = () => {
        setFile(null);
    };

    const handleUpload = async () => {
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetchFromApi('/tenants/apps/import', {
                method: 'POST',
                // fetch will automatically set the correct boundary for FormData
                body: formData,
            });

            alert(`Import Successful: ${response?.message || "Applications imported successfully."}`);

            onSuccess();
            onOpenChange(false);

            // Delay clearing file so animation finishes smoothly
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
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Import Applications</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col space-y-6 py-4">
                    <p className="text-sm text-muted-foreground">
                        Upload a CSV spreadsheet or a PDF invoice to automatically import your SaaS applications and spending data.
                    </p>

                    {!file ? (
                        <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className={`border-2 border-dashed rounded-lg p-10 flex flex-col items-center justify-center transition-colors cursor-pointer ${isHovering ? "border-primary bg-primary/5" : "border-slate-300 hover:border-primary/50 hover:bg-slate-50"
                                }`}
                        >
                            <input
                                type="file"
                                accept=".csv,.pdf"
                                className="hidden"
                                id="file-upload"
                                onChange={handleFileInput}
                            />
                            <label htmlFor="file-upload" className="flex flex-col items-center justify-center cursor-pointer w-full h-full">
                                <div className="p-4 bg-primary/10 text-primary rounded-full mb-4">
                                    <UploadCloud className="h-8 w-8" />
                                </div>
                                <h3 className="font-semibold text-lg mb-1">Drag and drop</h3>
                                <p className="text-sm text-muted-foreground text-center mb-4">
                                    Drop your CSV or PDF file here, or click to browse.
                                </p>
                                <Button type="button" variant="outline" size="sm" className="pointer-events-none">
                                    Select File
                                </Button>
                            </label>
                        </div>
                    ) : (
                        <div className="border border-slate-200 rounded-lg p-4 flex flex-col space-y-4">
                            <div className="flex items-center space-x-4">
                                <div className={`p-3 rounded-full flex-shrink-0 ${file.name.endsWith('.pdf') ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                                    }`}>
                                    {file.name.endsWith('.pdf') ? <FileText className="h-6 w-6" /> : <FileSpreadsheet className="h-6 w-6" />}
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

                            <div className="bg-blue-50 text-blue-800 text-sm p-3 rounded-md flex items-start space-x-2">
                                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                <p>
                                    {file.name.endsWith('.pdf')
                                        ? "PDF imports will attempt to extract the app name. Costs may need manual review."
                                        : "CSV files should contain columns like 'App Name', 'Category', and 'Monthly Cost'."}
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end space-x-3 pt-4 border-t">
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
