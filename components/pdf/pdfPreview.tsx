import { Card } from "@/components/ui/card"
import ReactMarkdown from "react-markdown"
import { CopyButton } from "./CopyButton"
import { motion } from "framer-motion"
import rehypeRaw from "rehype-raw"

interface PDFPreviewProps {
  content: string
}

const PDFPreview = ({ content }: PDFPreviewProps) => {
  return (
    <motion.div
      className="space-y-2 sm:space-y-4 h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <div className="flex items-center justify-between mb-2 sm:mb-4">
        <h2 className="text-xl sm:text-2xl font-semibold text-primary-foreground">Preview</h2>
        <div className="flex gap-2">
          <CopyButton format="text" />
          <CopyButton format="formatted" />
        </div>
      </div>
      <div className="h-[calc(100%-32px)] sm:h-[calc(100%-40px)] w-full relative overflow-hidden rounded-lg sm:rounded-xl">
        <Card
          className="absolute inset-0 prose dark:prose-invert max-w-none bg-white dark:bg-black custom-scrollbar"
          id="markdown-preview"
          style={{
            width: "100%",
            height: "100%",
            margin: "0 auto",
            overflowY: "auto",
            overflowX: "hidden",
            boxShadow: "none",
            border: "none",
          }}
        >
          <div className="p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 min-h-full" style={{ maxWidth: "100%", margin: "0 auto" }}>
            <div className="text-gray-900 dark:text-gray-100">
              <ReactMarkdown
                rehypePlugins={[rehypeRaw]}
                components={{
                  h1: ({ node, ...props }) => (
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6" {...props} />
                  ),
                  h2: ({ node, ...props }) => (
                    <h2
                      className="text-xl sm:text-2xl md:text-3xl font-semibold mt-6 sm:mt-8 mb-3 sm:mb-4"
                      {...props}
                    />
                  ),
                  h3: ({ node, ...props }) => (
                    <h3 className="text-lg sm:text-xl md:text-2xl font-medium mt-4 sm:mt-6 mb-2 sm:mb-3" {...props} />
                  ),
                  p: ({ node, ...props }) => <p className="mb-3 sm:mb-4 text-sm sm:text-base" {...props} />,
                  ul: ({ node, ...props }) => <ul className="list-disc pl-4 sm:pl-6 mb-3 sm:mb-4" {...props} />,
                  ol: ({ node, ...props }) => <ol className="list-decimal pl-4 sm:pl-6 mb-3 sm:mb-4" {...props} />,
                  li: ({ node, ...props }) => <li className="mb-1 sm:mb-2 text-sm sm:text-base" {...props} />,
                  a: ({ node, ...props }) => (
                    <a {...props} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer" />
                  ),
                }}
              >
                {content}
              </ReactMarkdown>
            </div>
          </div>
        </Card>
      </div>
    </motion.div>
  )
}

export default PDFPreview

