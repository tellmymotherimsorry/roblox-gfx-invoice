"use client"

import { Button } from "@/components/ui/button"
import { CheckCircle2, Copy, RotateCcw } from "lucide-react"
import { useState } from "react"

interface SubmissionSuccessProps {
  invoiceNumber: string
  onReset: () => void
}

export function SubmissionSuccess({ invoiceNumber, onReset }: SubmissionSuccessProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        `Invoice #${invoiceNumber} - GFX Studio Commission Order`
      )
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard API not available
    }
  }

  return (
    <div className="flex flex-col items-center gap-6 py-12 text-center animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary">
        <CheckCircle2 className="h-8 w-8 text-primary-foreground" />
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Order Submitted</h2>
        <p className="max-w-sm text-sm text-muted-foreground leading-relaxed">
          Your commission order has been received. You will be contacted via Discord for payment and further details.
        </p>
      </div>

      <div className="rounded-lg border border-border bg-secondary/50 px-6 py-3">
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Invoice Number</p>
        <p className="mt-1 font-mono text-lg font-bold text-foreground">{invoiceNumber}</p>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" onClick={handleCopy}>
          <Copy className="mr-2 h-3.5 w-3.5" />
          {copied ? "Copied!" : "Copy Invoice ID"}
        </Button>
        <Button size="sm" onClick={onReset}>
          <RotateCcw className="mr-2 h-3.5 w-3.5" />
          New Order
        </Button>
      </div>
    </div>
  )
}
