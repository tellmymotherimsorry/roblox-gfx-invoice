"use client"

import { ThemeToggle } from "@/components/theme-toggle"
import { Badge } from "@/components/ui/badge"

interface InvoiceHeaderProps {
  invoiceNumber: string
  date: string
  status: "pending_payment" | "pending_review" | "submitted"
}

export function InvoiceHeader({ invoiceNumber, date, status }: InvoiceHeaderProps) {

  const statusConfig = {
    pending_payment: { label: "Pending Payment", className: "bg-accent text-accent-foreground" },
    pending_review: { label: "Pending Review", className: "bg-secondary text-secondary-foreground" },
    submitted: { label: "Submitted", className: "bg-primary text-primary-foreground" },
  }

  const currentStatus = statusConfig[status]

  return (
    <header className="flex flex-col gap-6 pb-6 border-b border-border">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-5 w-5 text-primary-foreground"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-foreground">GFX Studio</h1>
            <p className="text-xs text-muted-foreground">Roblox Commission Services</p>
          </div>
        </div>
        <ThemeToggle />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Invoice</p>
          <p className="mt-1 font-mono text-2xl font-bold tracking-tight text-foreground">
            {invoiceNumber}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className={currentStatus.className}>
            {currentStatus.label}
          </Badge>
          <span className="font-mono text-xs text-muted-foreground">
            {date}
          </span>
        </div>
      </div>
    </header>
  )
}
