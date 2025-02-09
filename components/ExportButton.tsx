import { Button } from "@/components/ui/button"

interface ExportButtonProps {
  onExport: () => void
  format: string
}

export function ExportButton({ onExport, format }: ExportButtonProps) {
  return (
    <Button onClick={onExport} variant="secondary" size="sm" className="text-xs sm:text-sm">
      Export {format}
    </Button>
  )
}

