'use client';

import { Textarea } from '@/components/ui/textarea';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
  return (
    <div className="space-y-2">
      <h2 className="text-xl font-semibold text-foreground">Input</h2>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type your markdown here..."
        className="min-h-[calc(100vh-12rem)] resize-none font-mono p-4"
      />
    </div>
  );
}