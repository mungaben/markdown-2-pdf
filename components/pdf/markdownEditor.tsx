'use client';

import { Textarea } from '@/components/ui/textarea';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <h2 className="text-xl font-semibold text-foreground">Input</h2>

      {/* Textarea */}
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type your markdown here..."
        className="min-h-[calc(100vh-12rem)] w-full resize-none font-mono p-4 rounded-lg border border-muted-foreground/20 focus:border-muted-foreground/40 focus:ring-2 focus:ring-muted-foreground/10 transition-all"
      />
    </div>
  );
}