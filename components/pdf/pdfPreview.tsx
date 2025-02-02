import React from 'react';
import { Card } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";
import { CopyButton } from "./CopyButton";
import { motion } from "framer-motion";
import rehypeRaw from "rehype-raw";

interface PDFPreviewProps {
  content: string;
}

const PDFPreview = ({ content }: PDFPreviewProps) => {
  return (
    <motion.div
      className="space-y-2 h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-primary">Preview</h2>
        <div className="flex gap-2">
          <CopyButton format="text" />
          <CopyButton format="formatted" />
        </div>
      </div>
      <div className="h-[calc(100%-3rem)] relative">
        <Card
          className="absolute inset-0 prose dark:prose-invert max-w-none bg-white dark:bg-card rounded-2xl shadow-lg custom-scrollbar"
          id="markdown-preview"
          style={{
            width: "210mm",
            margin: "0 auto",
            overflowY: "auto",
            overflowX: "hidden"
          }}
        >
          <div className="p-20">
            <div className="text-gray-900 dark:text-gray-100">
              <ReactMarkdown
                rehypePlugins={[rehypeRaw]}
                components={{
                  a: ({ node, ...props }) => (
                    <a {...props} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline" />
                  ),
                }}
              >
                {content}
              </ReactMarkdown>
            </div>
          </div>
        </Card>
      </div>
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 12px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
          border-radius: 8px;
          margin: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #666;
          border-radius: 8px;
          border: 3px solid transparent;
          background-clip: padding-box;
          transition: background-color 0.3s ease;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #888;
          border: 2px solid transparent;
          background-clip: padding-box;
        }

        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #666 transparent;
        }

        @media (prefers-color-scheme: dark) {
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #888;
          }
          
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #999;
          }
        }
      `}</style>
    </motion.div>
  );
};

export default PDFPreview;