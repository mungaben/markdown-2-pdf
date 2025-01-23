'use client';

import { Card } from '@/components/ui/card';
import ReactMarkdown from 'react-markdown';
import { CopyButton } from './CopyButton';

interface PDFPreviewProps {
  content: string;
}

export function PDFPreview({ content }: PDFPreviewProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Preview</h2>
        <div className="flex gap-2">
          <CopyButton format="text" />
          <CopyButton format="formatted" />
        </div>
      </div>
      <Card 
        className="p-6 min-h-[calc(100vh-12rem)] overflow-auto prose dark:prose-invert max-w-none bg-white"
        id="markdown-preview"
        style={{
          width: '210mm', // A4 width
          minHeight: '297mm', // A4 height
          margin: '0 auto',
          padding: '20mm', // Standard A4 margins
        }}
      >
        <ReactMarkdown>{content}</ReactMarkdown>
      </Card>
    </div>
  );
}