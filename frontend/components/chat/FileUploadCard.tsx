"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function FileUploadCard() {
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ name: string; type: string; status: string }>>([
    { name: "ECG_Report_2024.pdf", type: "ECG", status: "analyzed" },
  ]);
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setUploading(true);
    // Simulate upload
    setTimeout(() => {
      const newFiles = Array.from(files).map(file => ({
        name: file.name,
        type: file.type.includes('pdf') ? 'PDF' : file.type.includes('image') ? 'Image' : 'Document',
        status: 'processing'
      }));
      setUploadedFiles(prev => [...prev, ...newFiles]);
      setUploading(false);

      // Simulate analysis completion
      setTimeout(() => {
        setUploadedFiles(prev => prev.map((f, idx) => 
          idx >= prev.length - newFiles.length ? { ...f, status: 'analyzed' } : f
        ));
      }, 2000);
    }, 1000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>File Upload</CardTitle>
        <CardDescription>Medical documents & reports</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg border-2 border-dashed p-6 text-center">
          <input
            type="file"
            id="file-upload"
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png"
            multiple
            onChange={handleFileUpload}
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <div className="text-4xl mb-2">📄</div>
            <p className="text-sm font-semibold">Click to upload</p>
            <p className="text-xs text-muted-foreground mt-1">
              ECG PDF, blood test images, medical reports
            </p>
          </label>
        </div>

        {uploadedFiles.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-semibold">Uploaded files:</p>
            {uploadedFiles.map((file, idx) => (
              <div key={idx} className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">
                    {file.type === 'PDF' ? '📑' : file.type === 'Image' ? '🖼️' : '📄'}
                  </span>
                  <div>
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{file.type}</p>
                  </div>
                </div>
                <Badge variant={file.status === 'analyzed' ? 'default' : 'secondary'}>
                  {file.status}
                </Badge>
              </div>
            ))}
          </div>
        )}

        <div className="rounded-lg border border-blue-500/20 bg-blue-500/10 p-3">
          <p className="text-xs font-semibold">✓ AI Analysis Features:</p>
          <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
            <li>• ECG waveform interpretation</li>
            <li>• Blood test result parsing</li>
            <li>• Medical report summarization</li>
            <li>• Image-based diagnosis support</li>
          </ul>
        </div>

        {uploading && (
          <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-3">
            <p className="text-sm">Uploading and analyzing...</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
