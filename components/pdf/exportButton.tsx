'use client';

import { Button } from '@/components/ui/button';
import { FileDown } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface PDFExportButtonProps {
  onExport: () => Promise<void>;
}

export function PDFExportButton({ onExport }: PDFExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const handleExport = async () => {
    try {
      setIsExporting(true);
      await onExport();
      toast({
        title: "Success",
        description: "PDF has been generated and downloaded",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate PDF",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button 
      onClick={handleExport}
      className="bg-primary hover:bg-primary/90"
      disabled={isExporting}
    >
      <FileDown className="mr-2 h-4 w-4" />
      {isExporting ? 'Generating...' : 'Export PDF'}
    </Button>
  );
}