"use client"

import { useState, useCallback, useMemo, useEffect } from "react"
import { InvoiceHeader } from "@/components/invoice-header"
import { ClientInfoSection } from "@/components/client-info-section"
import { GfxDetailsSection } from "@/components/gfx-details-section"
import { InvoiceSummary } from "@/components/invoice-summary"
import { SubmissionSuccess } from "@/components/submission-success"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Loader2, Send } from "lucide-react"

function generateInvoiceNumber(): string {
  const prefix = "GFX"
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `${prefix}-${timestamp}-${random}`
}

function formatDate(): string {
  return new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function InvoiceForm() {
  // Generate invoice number and formatted date only on the client
  const [invoiceNumber, setInvoiceNumber] = useState<string | null>(null)
  const [date, setDate] = useState<string | null>(null)

  useEffect(() => {
    setInvoiceNumber(generateInvoiceNumber())
    setDate(formatDate())
  }, [])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState("")

  const [clientInfo, setClientInfo] = useState({
    robloxUsername: "",
    discordUsername: "",
    email: "",
  })

  const [gfxDetails, setGfxDetails] = useState({
    rigType: "",
    lighting: "",
    positioning: "",
    weapons: "",
    stages: "",
    effects: "",
    textureFinish: "Shiny",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = useCallback(() => {
    const newErrors: Record<string, string> = {}
    if (!clientInfo.robloxUsername.trim()) {
      newErrors.robloxUsername = "Roblox username is required"
    }
    if (!clientInfo.discordUsername.trim()) {
      newErrors.discordUsername = "Discord username is required"
    }
    if (!gfxDetails.rigType) {
      newErrors.rigType = "Please select a rig type"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [clientInfo, gfxDetails.rigType])

  const total = useMemo(() => {
    let amount = 0
    if (gfxDetails.rigType === "R15") amount += 400
    else if (gfxDetails.rigType === "R6") amount += 200
    if (gfxDetails.textureFinish === "Rough") amount += 50
    if (gfxDetails.lighting.trim()) amount += 50
    if (gfxDetails.positioning.trim()) amount += 50

    // Weapons/Tools: charge 100 Robux per listed tool (one per line)
    const weaponsCount = gfxDetails.weapons
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter(Boolean).length
    if (weaponsCount > 0) amount += weaponsCount * 100

    if (gfxDetails.stages.trim()) amount += 50
    if (gfxDetails.effects.trim()) amount += 50
    return amount
  }, [gfxDetails])

  const weaponsCount = useMemo(() => {
    return gfxDetails.weapons
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter(Boolean).length
  }, [gfxDetails.weapons])

  const handleSubmit = async () => {
    if (!validate()) return

    setIsSubmitting(true)
    setSubmitError("")

    try {
      const response = await fetch("/api/submit-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoiceNumber,
          client: clientInfo,
          gfx: gfxDetails,
          total,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Submission failed")
      }

      setIsSubmitted(true)
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Something went wrong. Please try again."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    setIsSubmitted(false)
    setClientInfo({ robloxUsername: "", discordUsername: "", email: "" })
    setGfxDetails({
      rigType: "",
      lighting: "",
      positioning: "",
      weapons: "",
      stages: "",
      effects: "",
      textureFinish: "Shiny",
    })
    setErrors({})
    setSubmitError("")
    // Reload page to get new invoice number
    window.location.reload()
  }

  if (isSubmitted) {
    return (
      <div className="mx-auto w-full max-w-2xl">
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm sm:p-10">
          <InvoiceHeader
            invoiceNumber={invoiceNumber}
            date={date}
            status="submitted"
          />
          <SubmissionSuccess
            invoiceNumber={invoiceNumber}
            onReset={handleReset}
          />
          <InvoiceFooter />
        </div>
      </div>
    )
  }

  return (
      <div className="mx-auto w-full max-w-2xl">
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm sm:p-10">
          <InvoiceHeader
            invoiceNumber={invoiceNumber ?? ""}
            date={date ?? ""}
            status="pending_payment"
          />

        <div className="flex flex-col gap-8 pt-8">
          <ClientInfoSection
            data={clientInfo}
            onChange={setClientInfo}
            errors={errors}
          />

          <Separator />

          <GfxDetailsSection
            data={gfxDetails}
            onChange={setGfxDetails}
            errors={errors}
          />

          <Separator />

          <InvoiceSummary
            rigType={gfxDetails.rigType}
            textureFinish={gfxDetails.textureFinish}
            hasCustomLighting={!!gfxDetails.lighting.trim()}
            hasCustomPose={!!gfxDetails.positioning.trim()}
            weaponsCount={weaponsCount}
            hasStages={!!gfxDetails.stages.trim()}
            hasEffects={!!gfxDetails.effects.trim()}
          />

          {submitError && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3">
              <p className="text-sm text-destructive">{submitError}</p>
            </div>
          )}

          <Button
            size="lg"
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting Order...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Submit Order
              </>
            )}
          </Button>
        </div>

        <InvoiceFooter />
      </div>
    </div>
  )
}

function InvoiceFooter() {
  return (
    <footer className="mt-8 border-t border-border pt-6">
      <div className="flex flex-col items-center gap-1 text-center">
        <p className="text-xs text-muted-foreground">
          GFX Studio - Professional Roblox GFX Commission Services
        </p>
        <p className="text-xs text-muted-foreground/70">
          All orders are subject to review. Payment details will be provided via Discord.
        </p>
      </div>
    </footer>
  )
}
