"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const formats = [
  { id: "csv", label: "CSV", icon: "📊" },
  { id: "xlsx", label: "Excel", icon: "📈" },
  { id: "json", label: "JSON", icon: "📋" }
];

interface ExportPanelProps {
  onExport?: (format: string) => void;
}

export function ExportPanel({ onExport }: ExportPanelProps) {
  const [exporting, setExporting] = useState<string | null>(null);
  const [lastExport, setLastExport] = useState<string | null>(null);

  const handleExport = async (format: string) => {
    setExporting(format);
    
    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (onExport) {
      onExport(format);
    } else {
      // Simulate download
      console.log(`Exporting as ${format}...`);
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `health-data-${timestamp}.${format === 'xlsx' ? 'xlsx' : format}`;
      alert(`Downloaded: ${filename}`);
    }
    
    setLastExport(format);
    setExporting(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Export data</CardTitle>
        <CardDescription>Download vitals, GPS tracks and AI annotations</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 md:grid-cols-3">
          {formats.map((format) => (
            <Button
              key={format.id}
              variant="outline"
              className="h-20 flex-col gap-2"
              onClick={() => handleExport(format.id)}
              disabled={exporting === format.id}
            >
              <span className="text-2xl">{format.icon}</span>
              <span>{exporting === format.id ? "Exporting..." : format.label}</span>
            </Button>
          ))}
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="secondary">
            Send to doctor via email
          </Button>
          <Button size="sm" variant="secondary">
            Upload to cloud
          </Button>
        </div>

        {lastExport && (
          <div className="rounded-lg border border-green-500/20 bg-green-500/10 p-3">
            <div className="flex items-center gap-2">
              <Badge className="bg-green-500">Success</Badge>
              <p className="text-sm">Last exported as {lastExport.toUpperCase()}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
