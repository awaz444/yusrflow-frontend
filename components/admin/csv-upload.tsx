'use client';

import React from "react"

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/lib/i18n/language-context';
import { Upload, FileCheck, AlertCircle, Trash2 } from 'lucide-react';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  uploadedAt: string;
  rows: number;
}

export function CSVUpload() {
  const { t } = useLanguage();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    await processFiles(files);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files) {
      await processFiles(files);
    }
  };

  const processFiles = async (files: FileList) => {
    setIsLoading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
          // Simulate file processing
          await new Promise((resolve) => setTimeout(resolve, 1000));

          const newFile: UploadedFile = {
            id: Math.random().toString(36).substr(2, 9),
            name: file.name,
            size: file.size,
            uploadedAt: new Date().toLocaleString(),
            rows: Math.floor(Math.random() * 1000) + 100,
          };

          setUploadedFiles((prev) => [newFile, ...prev]);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const deleteFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <Card className="border border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5 text-accent" />
          {t('admin.csvUpload')}
        </CardTitle>
        <CardDescription>{t('admin.uploadData')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Upload Area */}
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-accent bg-accent/5'
              : 'border-border hover:border-accent hover:bg-accent/5'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".csv"
            onChange={handleFileSelect}
            className="hidden"
            aria-label={t('admin.selectFile')}
          />

          <div className="flex flex-col items-center gap-3">
            <Upload className="w-8 h-8 text-muted-foreground" />
            <div>
              <p className="font-semibold text-foreground">Drag and drop CSV files here</p>
              <p className="text-sm text-muted-foreground">or click to select files</p>
            </div>
            <p className="text-xs text-muted-foreground">
              Supported format: CSV (Comma-Separated Values)
            </p>
          </div>
        </div>

        {/* Data Format Info */}
        <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
          <h4 className="font-semibold text-sm mb-3">{t('admin.dataFormat')}</h4>
          <p className="text-sm text-muted-foreground mb-3">
            Each tenant can upload data in their own format. Expected CSV columns:
          </p>
          <div className="space-y-2 text-sm font-mono bg-card rounded p-3">
            <p className="text-muted-foreground">
              application_name, category, monthly_cost, users_count, risk_level, compliance_status
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              * Customize your column mapping in tenant configuration
            </p>
          </div>
        </div>

        {/* Uploaded Files */}
        {uploadedFiles.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold text-sm">Uploaded Files</h4>
            <div className="space-y-2">
              {uploadedFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-3 bg-card border border-border rounded-lg"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <FileCheck className="w-4 h-4 text-green-500" />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm truncate">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(file.size)} • {file.rows} rows • {file.uploadedAt}
                      </p>
                    </div>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => deleteFile(file.id)}
                    className="text-destructive hover:text-destructive/90"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Helpful Info */}
        <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-blue-900">Tip: Customize Data Format</p>
            <p className="text-blue-800 text-xs mt-1">
              Go to Tenant Configuration to map your CSV columns to the standard format.
              Each tenant can have unique column names.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
